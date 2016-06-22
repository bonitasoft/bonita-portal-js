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
    .module('org.bonitasoft.features.user.tasks.details')
    .directive('taskDetails', taskDetailsDirective);

  function taskDetailsDirective() {
    return {
      restrict: 'E',
      templateUrl: 'portalTemplates/user/tasks/list/details/task-details.html',
      controller: 'TaskDetailsCtrl',
      replace: false,
      scope: {
        currentTask: '=',
        refresh: '&',
        openDetailsPopup: '&'
      },
      link: function(scope, element, attrs) {
        scope.showToolbar = angular.isDefined(attrs.openDetailsPopup);
      }
    };
  }

})();
