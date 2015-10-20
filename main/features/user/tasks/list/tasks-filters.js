(function(){
  'use strict';

  /**
   * task-filters directive
   * Display a button list for filtering task list depending on
   * their status (ready, done, assigned, unassigned)
   * TaskFilters paramters:
   * {Object}   taskStatus    the current task filter associated with the filter
   * {Object}   TASK_FILTERS  the list of the tasks filters
   * {Object}   count         the tasks numbers for each filter entries
   * {function} filterChange  an event handler triggered when filter change
   */
  angular
    .module('org.bonitasoft.features.user.tasks.filter',['ui.bootstrap.buttons', 'ui.bootstrap.collapse'])
    .directive('taskFilters', [
      function(){
        return {
          restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
          templateUrl: 'portalTemplates/user/tasks/list/tasks-filters.html',
          replace: true,
          scope:{
            taskStatus:'=filter',
            TASK_FILTERS:'=filters',
            count:'=',
            filterChange:'&'
          },
          link: function($scope) {
            // assign constant to scope

            /**
             * update TaskFilter value
             * @param {Object} filter a config object @see TASK_FILTERS
             */
            $scope.setStatusTaskFilter = function(filter) {
              $scope.filterChange({filter:filter});
            };
          }
        };
      }
    ]);
})();
