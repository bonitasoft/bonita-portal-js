(function() {
  'use strict';

  angular
    .module('org.bonitasoft.features.user.tasks.list.table')
    .controller('TaskTableCtrl', TaskTableCtrl);

  function TaskTableCtrl($scope, TASK_FILTERS, moment, gettextCatalog) {
    $scope.sortOption = angular.copy($scope.request.taskFilter.sortOption);
    $scope.TASK_FILTERS = TASK_FILTERS;
    $scope.canDoGroupAction = canDoGroupAction;
    $scope.colspan = colspan;
    $scope.canTake = canTake;
    $scope.canRelease = canRelease;
    $scope.disableProcessFilter = disableProcessFilter;
    $scope.getPaginationStatus = getPaginationStatus;
    $scope.isOverdue = isOverdue;
    $scope.getDueDateTitle = getDueDateTitle;
    $scope.isNoTaskAvailableMessageVisible = isNoTaskAvailableMessageVisible;
    $scope.isNoMyTaskMessageVisible = isNoMyTaskMessageVisible;
    $scope.isNoDoneTaskMessageVisible = isNoDoneTaskMessageVisible;
    $scope.isNoTaskFoundVisible = isNoTaskFoundVisible;
    $scope.sort = sort;

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
      return tasks && $scope.canDoGroupAction() && tasks.some(isUnAssigned);
    }

    /**
     * Return a boolean reflecting if selected tasks are assigned to user
     * @return {Boolean}
     */
    function canRelease(tasks) {
      return tasks && $scope.canDoGroupAction() && tasks.some(isAssigned);
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

    function getDueDateTitle(task) {
      var dueDate = moment(task.dueDate).format('LLL');
      return isOverdue(task) ? gettextCatalog.getString('This task is overdue. It was supposed to be completed by {{dueDate}}', { dueDate: dueDate }) : dueDate;
    }

    function isNoTaskAvailableMessageVisible() {
      return $scope.counters.TODO === 0 && $scope.filter !== TASK_FILTERS.DONE && !isNoTaskFoundVisible();
    }

    function isNoMyTaskMessageVisible() {
      return $scope.counters.TODO > 0 && $scope.counters.MY_TASK === 0 && $scope.filter !== TASK_FILTERS.DONE && !isNoTaskFoundVisible();
    }

    function isNoDoneTaskMessageVisible() {
      return $scope.counters.DONE === 0 && $scope.filter === TASK_FILTERS.DONE && !isNoTaskFoundVisible();
    }

    function isNoTaskFoundVisible() {
      return !!$scope.request.search;
    }

    function sort(options) {
      if ($scope.request.taskFilter !== TASK_FILTERS.DONE || options.property !== 'dueDate' && options.property !== 'processInstanceId') {
        $scope.request.taskFilter.sortOption.property = options.property;
        $scope.request.taskFilter.sortOption.direction = options.direction;
        $scope.refresh();
      }
    }
  }
})();
