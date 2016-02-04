(function() {
  'use strict';
  /**
   * This module hold the main application
   */

  angular
  .module('org.bonitasoft.features.user.tasks.app', [
    'org.bonitasoft.features.user.tasks.app.store',
    'org.bonitasoft.features.user.tasks.app.pref',
    'org.bonitasoft.features.user.tasks.app.config',
    'api.request',
    'org.bonitasoft.features.user.tasks.ui.iframe.spy',
    'common.screen',
    'common.iframe',
    'org.bonitasoft.common.resources',
    'org.bonitasoft.features.user.tasks.modal.form',
    'org.bonitasoft.features.user.tasks.modal.details',
    'org.bonitasoft.features.user.tasks.ui.switcher',
    'ui.bootstrap.modal',
    'ui.bootstrap.buttons',
    'ui.bootstrap.dropdown',
    'ngToast',
    'gettext'
  ])

  /**
   * NgToast service configuration
   * @param  {[type]} ngToastProvider [description]
   * @return {[type]}                 [description]
   */
  .config(['ngToastProvider',
    function(ngToastProvider) {
      ngToastProvider.configure({
        horizontalPosition: 'center'
      });
    }
  ])

  /**
   * Controller for the task-app diretive
   * it handles app layout, task request parameters
   * and exposes user, tasklist, request, currentTask (the selected one),
   * currentCase.
   */
  .controller('TaskAppCtrl', [
    '$modal',
    '$q',
    'taskListStore',
    'sessionAPI',
    'screen',
    'iframe',
    'preference',
    'humanTaskAPI',
    'processAPI',
    'ngToast',
    'TASK_FILTERS',
    'PAGE_SIZES',
    '$timeout',
    'gettextCatalog',
    function($modal, $q, taskListStore, sessionAPI, screen, iframe, preference, humanTaskAPI, processAPI, ngToast, TASK_FILTERS, PAGE_SIZES, $timeout, gettextCatalog) {
      var store = taskListStore;
      this.tasks = store.tasks;
      this.request = store.request;
      this.TASK_FILTERS = TASK_FILTERS;
      this.PAGE_SIZES = PAGE_SIZES;

      this.showDetails = preference.get('showDetails') === true;
      this.smallScreen = screen.size.name === 'sm';

      this.showMenu = preference.get('showFilters');
      this.expandDetails = false;

      this.getMode = preference.getMode;

      this.loadingTasks = false;

      /**
       * retrieve user and launch requests to boostrap the view data
       */
      this.init = function() {
        store.user = sessionAPI.get({id:'unusedId'});
        store.user.$promise.then(function() {
          this.user = store.user;
          this.updateTasks();
          this.updateCount();
          this.updateProcessList();
        }.bind(this));

      };

      /**
       * Search a task
       */
      this.searchTask = function() {
        this.loadingTasks = true;
        this.updateTasks()
          .finally(function() {
            this.loadingTasks = false;
          }.bind(this));
      };


      /**
       * set process filter for task list
       * @param {Object} process
       */
      this.setProcess = function(process) {
        store.request.process = process;
        this.updateCount();
        this.updateTasks();
      };

      /**
       * select a task
       * @param  {object} task
       */
      this.selectTask = function(task) {
        store.currentTask = task;
        this.currentTask = task;
        store
          .getCaseInfo(task.caseId)
          .then(function() {
            this.currentCase = store.currentCase;
          }.bind(this))
          .then(function() {
            return store.getProcessSupervisors(task.rootContainerId.id);
          });
      };

      /**
       * update task list
       * @return {object} a promise of a search result
       * @see  store.getTasks
       */
      this.updateTasks = function() {
        var promise = store.getTasks()
          .then(function() {
            this.tasks = store.tasks;
            this.currentTask = store.currentTask;
          }.bind(this));
        // once we retrieve the tasks we set the currentTask and retrieve its case
        promise
          .then(function() {
            if (!store.currentTask) {
              return null;
            }
            return store
              .getCaseInfo(store.currentTask.caseId)
              .then(function() {
                return store.getProcessSupervisors(store.currentTask.rootContainerId.id);
              });

          }).finally(function() {
            if (store.currentCase) {
              this.currentCase = store.currentCase;
            }
          }.bind(this));

        return promise;
      };

      /**
       * update number of task in TaskFilters badge
       */
      this.updateCount = function() {
        store.countAll()
          .then(function() {
            this.count = store.count;
          }.bind(this));
      };

      this.updateAll = function() {
        var currentProcess = store.request.process;
        this.updateProcessList();
        this.setProcess(currentProcess);
      };

      /**
       * set request filter
       * @see  config.resources.TASK_FILTERS
       * @param {object} filter
       */
      this.setFilter = function(filter) {
        // reset fullscreen details
        this.expandDetails = false;
        store.request.taskFilter = filter;
        store.request.resetFilters({
          process: store.processes[0]
        });
      };

      /**
       * retrieve the available processes for current user
       */
      this.updateProcessList = function() {
        store.getProcessList()
          .then(function() {
            this.processes = store.processes;
          }.bind(this));
      };

      /**
       * onScreenChange handler
       * @see  common.screen.screen
       * @name onScreenChange
       */
      this.onScreenChange = function() {
        this.smallScreen = screen.size.name === 'sm' || screen.size.name === 'xs';
      };
      screen.on(this.onScreenChange.bind(this));

      /**
       * update app layout
       * @param  {boolean} showDetails are details shown
       */
      this.updateLayout = function(showDetails) {
        preference.set('showDetails', showDetails);
      };


      /**
       * show the bonita form associated to the task in a modale
       * if the tasks is not assigned to user,
       * silently assigned it before display the form
       *
       * @param  {Object} task
       */
      this.showTasksFormPopup = function(task) {
        //FRO 2015/06/05 rebuild the process parent for the task for the case of a subprocess
        //setTimeout because we have to wait the update of store.currentTask
        $timeout(function(that, task) {
          processAPI
            .get({
              id: store.currentTask.processId
            })
            .$promise.then(function(data) {
              /*jshint camelcase: false */
              var url = iframe.getTaskForm(data, task, that.user.user_id);

              /* jshint camelcase:false */
              var promise;

              if (task.assigned_id !== store.user.user_id) {
                promise = humanTaskAPI.update({
                  id: task.id,
                  'assigned_id': store.user.user_id
                }).$promise;
              } else {
                // we assign a blank promise
                var defered = $q.defer();
                defered.resolve({
                  assigned_id: store.user.user_id
                });
                promise = defered.promise;
              }

              promise.then(function(taskUpdated) {
                //update the task
                task.assigned_id = taskUpdated.assigned_id;

                // open the modal
                that.modaleInstance = $modal.open({
                  templateUrl: 'portalTemplates/user/tasks/list/tasks-modal-form.html',
                  controller: 'ModalFormCtrl',
                  controllerAs: 'modal',
                  windowClass: 'FormModal',
                  resolve: {
                    url: function() {
                      return url;
                    },
                    task: function() {
                      return task;
                    },
                    userId: function() {
                      return store.user.user_id;
                    },
                    refreshHandler: function() {
                      return function() {
                        that.updateAll();
                      };
                    }
                  }
                });

                return that.modaleInstance.result;
              }.bind(that))
                .then(
                  function() {},
                  // modal is dismiss
                  function() {
                    that.updateTasks();
                    that.updateCount();
                  }.bind(that)
              );
            }.bind(that));
        }, 100, true, this, task);
      };

      this.showTaskDetailsPopup = function(task) {
        /* jshint camelcase:false */
        var url = iframe.getTaskForm(task.rootContainerId, task, this.user.user_id);
        var ctrl = this;
        this.modaleInstance = $modal.open({
          templateUrl: 'portalTemplates/user/tasks/list/tasks-modal-details.html',
          controller: 'ModalDetailsCtrl',
          controllerAs: 'modal',
          windowClass: 'FormModal',
          resolve: {
            url: function() {
              return url;
            },
            task: function() {
              return task;
            },
            Case: function() {
              return store.currentCase;
            },
            userId: function() {
              return store.user.user_id;
            },
            refreshCountHandler: function() {
              return function() {
                ctrl.updateCount();
              };
            }
          }
        });

        this.modaleInstance.result.then(
          function() {},
          // modal is dismiss
          function() {
            this.updateTasks();
            this.updateCount();
          }.bind(this));
      };

      /**
       * update current filter and update task List
       * @param  {Object} filter @see app.config#TASK_FILTERS
       */
      this.changeFilter = function(filter) {
        this.setFilter(filter);
        this.updateTasks();
        this.updateCount();
      };

      /**
       * helper method for calculating available grid columns for the TaskList container
       * @return {[type]} [description]
       */
      this.getSize = function() {
        var col = 12;

        if (this.showDetails && !this.expandDetails) {
          col /= 2;
        }

        return col;
      };

      this.onFormSubmited = function(message) {
        var jsonMessage = JSON.parse(message);
        if (jsonMessage.message === 'error') {
          if (jsonMessage.dataFromError === 'fileTooBigError' || jsonMessage.status === 413) {
            ngToast.create({
              className:'danger',
              content: gettextCatalog.getString('The attachment is too big.<br/>Select a smaller attachment and submit the form again.')
            });
          } else {
            ngToast.create({
              className: 'danger',
              content: gettextCatalog.getString('An error occurred while submitting the form.')
            });
            this.updateTasks();
            this.updateCount();
          }
        } else if (jsonMessage.message === 'success'){
          ngToast.create(gettextCatalog.getString('Form submitted.<br/>The next task in the list is now selected.'));
          this.updateTasks();
          this.updateCount();
          if(this.modaleInstance) {
            this.modaleInstance.close();
          }
        }
      };

      this.toggleFilters = function() {
        this.showMenu = !this.showMenu;
        preference.set('showFilters', this.showMenu);
      };
    }
  ])

  /**
   * task-app directive (Main app directive)
   */
  .directive('taskApp', function() {
    return {
      controller: 'TaskAppCtrl',
      controllerAs: 'app',
      restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
      link: function($scope, iElm, iAttrs, controller) {
        controller.init();
      }
    };
  });
})();
