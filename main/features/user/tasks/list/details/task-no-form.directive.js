(function() {
  'use strict';

  /**
   * taskNoForm directive display a task form for tasks which have no form mapped.
   * The noForm parameters are:
   * @param {Object}   current-task   A task object
   * @param {boolean}  editable       true if the user can interact with the form
   * @param {boolean}  inactive       if true, will hide tabs content
   * @param {function} refreshAll     refresh handler, called on task submission
   */

  angular
    .module('org.bonitasoft.features.user.tasks.details')
    .directive('noForm', noFormDirective);

  function noFormDirective($window, taskListStore, userTaskAPI, humanTaskAPI, commentAPI, ngToast, gettextCatalog) {
    // Runs during compile
    return {
      restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
      templateUrl: 'portalTemplates/user/tasks/list/details/task-no-form.html',
      replace: false,
      scope: {
        currentTask: '=',
        editable: '=',
        inactive: '=',
        hasContract: '='
      },
      link: function(scope) {

        //Default inactive value to false
        scope.inactive = scope.inactive || false;

        var onSuccess = function() {
          var message = {message: 'success', action: 'Submit task'};
          $window.self.postMessage(JSON.stringify(message), '*');
        };

        var onError = function() {
          var message = {message: 'error', action: 'Submit task'};
          $window.self.postMessage(JSON.stringify(message), '*');
        };

        var addComment = function() {
          if (scope.currentTask.comment) {
            /*jshint camelcase: false*/
            commentAPI.save({
              userId: taskListStore.user.user_id,
              processInstanceId: scope.currentTask.parentCaseId,
              content: scope.currentTask.comment
            }, function() {
            }, function() {
              ngToast.create({
                class: 'warning',
                content: gettextCatalog.getString('The task has been submitted but an error occurred while adding the comment')
              });
            });
          }
        };

        scope.onExecuteTask = function() {
          addComment();
          if ('MANUAL_TASK' === scope.currentTask.type) {
            /*jshint camelcase: false*/
            humanTaskAPI.update({id: scope.currentTask.id, state: 'completed', executedBy: taskListStore.user.user_id}, onSuccess, onError);
          } else {
            userTaskAPI.execute(scope.currentTask.id, {}).then(onSuccess, onError);
          }
        };

      }
    };
  }

})();
