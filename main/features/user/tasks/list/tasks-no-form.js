(function() {
  'use strict';

  /**
   * taskNoForm directive display a task context and is associated form.
   * The task form and the case overview are both iframe from bonita portal
   * The taskDetails parameters are:
   * @param {Object}   current-task   A task object
   * @param {boolean}  editable       true if the user can interact with the form
   * @param {boolean}  inactive       if true, will hide tabs content
   * @param {function} refreshAll     refresh handler, called on task submission
   */

  angular
    .module('org.bonitasoft.features.user.tasks.details')
    .directive('noForm', ['$window', 'taskListStore', 'formMappingAPI', 'userTaskAPI', 'humanTaskAPI', 'commentAPI',
      function($window, taskListStore, formMappingAPI, userTaskAPI, humanTaskAPI, commentAPI) {
        // Runs during compile
        return {
          restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
          templateUrl: 'portalTemplates/user/tasks/list/tasks-no-form.html',
          replace: false,
          scope: {
            currentTask: '=',
            refreshAll: '&',
            editable: '=',
            inactive: '=',
            hasForm: '='
          },
          link: function(scope) {

            //Default inactive value to false
            scope.inactive = scope.inactive || false;

            scope.onExecuteTask = function() {
              addComment();
              if ('MANUAL_TASK' === scope.currentTask.type) {
                /*jshint camelcase: false*/
                humanTaskAPI.update({id: scope.currentTask.id, state: 'completed', executedBy: taskListStore.user.user_id}, onSuccess);
              } else {
                userTaskAPI.execute(scope.currentTask.id, {}).then(onSuccess);
              }
            };

            var onSuccess = function() {
              scope.refreshAll();
              var dataToSend = {message:'success', action: 'Submit task'};
              $window.postMessage(JSON.stringify(dataToSend), '*');
            };

            var addComment = function() {
              if (scope.currentTask.comment) {
                /*jshint camelcase: false*/
                commentAPI.save({
                  userId: taskListStore.user.user_id,
                  processInstanceId: scope.currentTask.parentCaseId,
                  content: scope.currentTask.comment
                });
              }
            };
          }
        };
      }
    ]);

})();
