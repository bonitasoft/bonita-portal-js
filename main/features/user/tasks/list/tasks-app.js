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
  .controller('TaskAppCtrl',
    function($modal, $modalStack, taskListStore, sessionAPI, screen, iframe, preference, ngToast, TASK_FILTERS, PAGE_SIZES, $timeout, gettextCatalog, $location) {
      var vm = this;
      var store = taskListStore;
      this.tasks = store.tasks;
      this.request = store.request;
      this.TASK_FILTERS = TASK_FILTERS;
      this.PAGE_SIZES = PAGE_SIZES;
      this.search = $location.search();

      Object.defineProperty(this, 'filter', {
        get: function() {
          return store.request.taskFilter;
        },
        set: function(filter) {
          store.request.taskFilter = filter;
          this.updateAll();
        }
      });

      this.count = store.count;
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
          if (this.search && !isNaN(Number(this.search.case))) {
            this.setCase(Number(this.search.case));
            if(store && store.request) {
              store.request.process = null;
              store.request.search = null;
            }
          }
          if (this.search && angular.isString(this.search.filter)) {
            this.setFilter(TASK_FILTERS[this.search.filter.toUpperCase()]);
          }
          this.refresh();
          this.updateProcessList();
        }.bind(this));

      };

      this.refresh = function() {
        this.updateTasks();
        this.updateCount();
      };

      /**
       * Search a task
       */
      this.searchTask = function() {
        this.resetPagination();
        this.updateTasks();
      };

      this.resetPagination = function() {
        store.request.pagination.currentPage = 1;
      };

      /**
       * set case filter for task list
       * @param {Object} process
       */
      this.setCase = function(caseId) {
        store.request.caseId = caseId;
      };

      /**
       * set process filter for task list
       * @param {Object} process
       */
      this.setProcess = function(process) {
        store.request.process = process;
        this.resetPagination();
        this.refresh();
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
          }.bind(this));
      };

      /**
       * update task list
       * @return {object} a promise of a search result
       * @see  store.getTasks
       */
      this.updateTasks = function() {
        this.loadingTasks = true;
        var promise = store.getTasks()
          .then(function() {
            if (store.request.case) {
              $location.search('case', store.request.case);
            }
            if (store.request.taskFilter) {
              $location.search('filter', store.request.taskFilter.id);
            }
          })
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
              .getCaseInfo(store.currentTask.caseId);

          }).finally(function() {
            if (store.currentCase) {
              this.currentCase = store.currentCase;
            }
            this.loadingTasks = false;
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
        store.request.process = currentProcess;
        this.refresh();
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

      /* jshint camelcase:false */
      this.showTaskDetailsPopup = function() {
        this.modaleInstance = $modal.open({
          templateUrl: 'portalTemplates/user/tasks/list/details/task-details-modal.html',
          controller: 'TaskDetailsPopupCtrl',
          controllerAs: 'modal',
          windowClass: 'TaskDetailsModal',
          backdropClass: 'TaskDetailsModal-backdrop',
          animation: false,
          resolve: {
            updateCount: function () {
              return vm.updateCount;
            }
          }
        });

        this.modaleInstance.result.then(
          function() {},
          // modal is dismiss
          function() {}.bind(this));
      };

      /**
       * update current filter and update task List
       * @param  {Object} filter @see app.config#TASK_FILTERS
       */
      this.changeFilter = function(filter) {
        this.setFilter(filter);
        this.resetPagination();
        this.updateAll();
      };

      this.toggleFilters = function() {
        this.showMenu = !this.showMenu;
        preference.set('showFilters', this.showMenu);
      };

      this.toggleDetails = function() {
        this.showDetails = !this.showDetails;
        preference.set('showDetails', this.showDetails);
      };

      this.onFormSubmited = function(message) {
        var jsonMessage = typeof message === 'string' ? JSON.parse(message) : message;
        if (jsonMessage.action === 'Submit task') {
          if (jsonMessage.message === 'error') {
            this.handleFormSubmissionError(jsonMessage);
          } else if (jsonMessage.message === 'success') {
            this.handleFormSubmissionSuccess();
          }
        }
      };

      this.handleFormSubmissionError = function(jsonMessage) {
        if (jsonMessage.dataFromError === 'fileTooBigError' || jsonMessage.status === 413) {
          ngToast.create({
            className: 'danger',
            content: gettextCatalog.getString('The attachment is too big.<br/>Select a smaller attachment and submit the form again.')
          });
        } else if (jsonMessage.status === 404) {
          ngToast.create({
            className: 'danger',
            content: gettextCatalog.getString('An error occurred while submitting the form.<br/>The task may not be available anymore.')
          });
          this.refresh();
        } else {
          ngToast.create({
            className: 'danger',
            content: gettextCatalog.getString('An error occurred while submitting the form.')
          });
        }
      };

      this.handleFormSubmissionSuccess = function() {
        $modalStack.dismissAll();
        ngToast.create(gettextCatalog.getString('Form submitted.<br/>The next task in the list is now selected.'));
        this.refresh();
      };
    }
  )

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
