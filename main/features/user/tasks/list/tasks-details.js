(function() {
  'use strict';

  /**
   * TaskDetails directive display a task context and is associated form.
   * The task form and the case overview are both iframe from bonita portal
   * The taskDetails parameters are:
   * @param {Object}   current-task   A task object
   * @param {Object}   current-case   A case object
   * @param {boolean}  editable       true if the user can interact with the form
   * @param {boolean}  inactive       if true, will hide tabs content
   * @param {boolean}  hide-form      if true, replace the form with an alert (used for done tasks)
   * @param {function} refresh        refresh handler, called on task assignee update
   */

  angular
    .module('org.bonitasoft.features.user.tasks.details', [
      'org.bonitasoft.features.user.tasks.app.store',
      'org.bonitasoft.features.user.tasks.app.pref',
      'common.resources',
      'common.filters',
      'common.iframe',
      'org.bonitasoft.features.user.tasks.ui.iframe',
      'ui.bootstrap.tabs'
    ])
    .service('taskDetailsHelper', ['taskListStore', 'preference', 'humanTaskAPI',
      function(taskListStore, preference, humanTaskAPI) {

        /**
         * assigned a task to the current user
         * @return {object} a promise of an updated task
         */
        this.takeReleaseTask = function(task) {
          /*jshint camelcase: false */
          var assignee;
          if (task.assigned_id === taskListStore.user.user_id) {
            assignee = '';
          } else {
            assignee = taskListStore.user.user_id;
          }

          return humanTaskAPI
            .update({
              id: task.id,
              'assigned_id': assignee
            })
            .$promise.then(function(_task) {
              task.assigned_id = _task.assigned_id;
            });
        };

        this.initTab = function(scope) {
          scope.tab[(preference.get('lastTab') || 'context')] = true;
        };

        this.saveSelectedTab = function(tab) {
          preference.set('lastTab', tab, true);
        };
      }
    ])
    .directive('taskDetails', ['iframe', 'taskListStore', 'taskDetailsHelper', 'processAPI', 'formMappingAPI',
      function(iframe, taskListStore, taskDetailsHelper, processAPI, formMappingAPI) {
        // Runs during compile
        return {
          restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
          templateUrl: 'portalTemplates/user/tasks/list/tasks-details.html',
          replace: false,
          scope: {
            currentTask: '=',
            currentCase: '=',
            refreshCount: '&',
            refreshAll: '&',
            editable: '=',
            inactive: '=',
            hideForm: '=',
            activeTab: '@'
          },
          link: function(scope, element, attr) {
            //Init tab visibility
            scope.tab = {
              context: false,
              form: false
            };
            if (!attr.activeTab) {
              // use last active tab
              taskDetailsHelper.initTab(scope);
            } else {
              scope.tab.context = true;
            }

            //Default inactive value to false
            scope.inactive = scope.inactive || false;

            // Watch the currentCase
            scope.$watch('currentCase', function(newCase) {
              if (!newCase) {
                return;
              }
              /*jshint camelcase: false*/
              processAPI
                .get({
                  id: scope.currentTask.processId
                })
                .$promise.then(function(data) {
                  // Load the task informatioin for the iframe
                  scope.formUrl = iframe.getTaskForm(data, scope.currentTask, taskListStore.user.user_id, false);
                });

              scope.overviewUrl = iframe.getCaseOverview(newCase, newCase.processDefinitionId);
              scope.diagramUrl = iframe.getCaseVisu(newCase, newCase.processDefinitionId);
            });

            scope.hasForm = false;

            // Watch the currentTask
            scope.$watch('currentTask', function(newTask) {
              if (!newTask) {
                return;
              }
              //Check if the task has a form
              if ('USER_TASK' === scope.currentTask.type) {
                scope.hasForm = true;
                formMappingAPI.search({
                  p: 0,
                  c: 1,
                  f: ['processDefinitionId=' + scope.currentTask.processId, 'task=' + scope.currentTask.name, 'type=TASK']
                }, function (results) {
                  if (results.resource.pagination.total > 0 && results.data[0].target === 'NONE') {
                    scope.hasForm = false;
                  }
                });
              }
            });

            /**
             * onSelectTab button handler
             * @return {[type]} [description]
             */
            scope.onClickTab = function(tab) {
              taskDetailsHelper.saveSelectedTab(tab);
            };

            /**
             * onTaskTask button handler
             * @return {[type]} [description]
             */
            scope.onTakeReleaseTask = function() {
              taskDetailsHelper
                .takeReleaseTask(scope.currentTask)
                .then(function() {
                  scope.refreshCount();
                });
            };

          }
        };
      }
    ]);

})();
