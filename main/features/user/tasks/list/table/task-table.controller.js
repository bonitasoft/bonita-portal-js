(function() {
  'use strict';

  angular
    .module('org.bonitasoft.features.user.tasks.list.table')
    .controller('TaskTableCtrl', TaskTableCtrl);

  function TaskTableCtrl($scope, TASK_FILTERS, moment) {
    $scope.TASK_FILTERS = TASK_FILTERS;
    $scope.canDoGroupAction = canDoGroupAction;
    $scope.colspan = colspan;
    $scope.canTake = canTake;
    $scope.canRelease = canRelease;
    $scope.disableProcessFilter = disableProcessFilter;
    $scope.getPaginationStatus = getPaginationStatus;
    $scope.isOverdue = isOverdue;

    this.checkTask = checkTask;
    this.isAssigned = isAssigned;
    this.isUnAssigned = isUnAssigned;

    function checkTask(selected, task) {
      task.selected = selected;
    }

    function isAssigned(task) {
      /* jshint camelcase: false */
      return task.assigned_id === $scope.user.user_id;
    }

    function isUnAssigned(task) {
      /* jshint camelcase: false */
      return task.assigned_id !== $scope.user.user_id;
    }

    /**
     *  button state control
     */
    function canDoGroupAction() {
      return $scope.request.taskFilter !== TASK_FILTERS.DONE;
    }

    /**
     * calculate colspan value
     */
    function colspan(cols) {
      if (!cols) {
        return 0;
      }

      var colspan = cols.reduce(function(val, item) {
        return val + (item.visible ? 1 : 0);
      }, 0);

      if ($scope.mode !== 'mid') {
        colspan += 1;
      }

      if ($scope.request.taskFilter !== TASK_FILTERS.DONE) {
        colspan += 1;
      }

      return colspan + 1;
    }

    /**
     * Return a boolean reflecting if selected tasks are not assigned to user
     * @return {Boolean}
     */
    function canTake(tasks) {
      if (!tasks) {
        return;
      }
      return $scope.canDoGroupAction() &&
        $scope.request.taskFilter !== TASK_FILTERS.MY_TASKS &&
        tasks.some(isUnAssigned);
    }

    /**
     * Return a boolean reflecting if selected tasks are assigned to user
     * @return {Boolean}
     */
    function canRelease(tasks) {
      if (!tasks) {
        return;
      }
      return $scope.canDoGroupAction() &&
        $scope.request.taskFilter !== TASK_FILTERS.MY_TASKS &&
        tasks.some(isAssigned);
    }

    /**
     * disable processFilter is TaskFilter different of TASK_FILTER.TODO
     * @return {[type]} [description]
     */
    function disableProcessFilter() {
      return TASK_FILTERS.TODO !== $scope.request.taskFilter;
    }

    function getPaginationStatus() {
      var pagination = $scope.request.pagination;
      var pageSize = Math.min(pagination.total, pagination.numberPerPage);

      return (((pagination.currentPage - 1) * pageSize) + 1) +
        ' - ' +
        Math.min(pagination.currentPage * pageSize, pagination.total) +
        ' / ' +
        pagination.total;
    }

    function isOverdue(task) {
      return task.dueDate && moment(task.dueDate).isBefore(moment());
    }
  }

})();
