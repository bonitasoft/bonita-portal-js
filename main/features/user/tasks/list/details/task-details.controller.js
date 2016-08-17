(function() {

  'use strict';

  angular
    .module('org.bonitasoft.features.user.tasks.details')
    .controller('TaskDetailsCtrl', TaskDetailsCtrl);

  function TaskDetailsCtrl($scope, iframe, taskListStore, taskDetailsHelper, processAPI, formMappingAPI, TASK_FILTERS) {
    $scope.isAssignable = isAssignable;
    $scope.isEditable = isEditable;
    $scope.isInactive = isInactive;
    $scope.hideForm = hideForm;

    $scope.tab = {
      form: true,
      comments: false,
      context: false
    };

    $scope.hasOverview = false;
    $scope.hasForm = false;

    // Watch the currentCase
    $scope.$watch(function() {
      return taskListStore.currentCase;
    }, function(newCase) {
      $scope.currentCase = newCase;
      if (!newCase) {
        return;
      }
      //Check if the process has an overview
      fetchOverviewMapping();
    });

    // Watch the currentTask
    $scope.$watch('currentTask', function(newTask, oldTask) {
      $scope.loading = true;
      if (!newTask) {
        return;
      }
      if (!hideForm()) {
        //Check if the task has a form
        if ('USER_TASK' === $scope.currentTask.type) {
          //only check the form mapping if the selected task has changed or the first time a task is selected
          if (newTask === oldTask || isNotSameTask(oldTask, newTask)) {
            fetchFormMapping();
          } else {
            $scope.loading = false;
          }
        } else {
          $scope.hasForm = false;
          $scope.loading = false;
        }
      }
      $scope.tab.form = true;
    });

    /**
     * Check if the new task is a task different from the old task
     */
    function isNotSameTask(oldTask, newTask) {
      return newTask.id !== oldTask.id || oldTask.archivedDate;
    }

    /**
     * onTaskTask button handler
     * @return {[type]} [description]
     */
    $scope.onTakeReleaseTask = function() {
      taskDetailsHelper
        .takeReleaseTask($scope.currentTask)
        .finally(function() {
          $scope.refresh();
        });
    };

    /**
     * Check the process overview mapping and set the hasOverview property and the overviewurl
     */
    function fetchOverviewMapping() {
      formMappingAPI.search({
        p: 0,
        c: 1,
        f: ['processDefinitionId=' + $scope.currentCase.processDefinitionId.id, 'type=PROCESS_OVERVIEW']
      }).$promise.then(function (response) {
          $scope.hasOverview = hasFormMapping(response);
          if ($scope.hasOverview) {
            $scope.overviewUrl = iframe.getCaseOverview($scope.currentCase, $scope.currentCase.processDefinitionId);
          }
        })
        .catch(function () {
          $scope.hasOverview = false;
        });
    }

    /**
     * Check the task form mapping and set the hasForm property and the formUrl
     */
    function fetchFormMapping() {
      formMappingAPI.search({
        p: 0,
        c: 1,
        f: ['processDefinitionId=' + $scope.currentTask.processId, 'task=' + $scope.currentTask.name, 'type=TASK']
      }).$promise.then(function (response) {
          $scope.hasForm = hasFormMapping(response);
          if ($scope.hasForm && !hideForm()) {
            /*jshint camelcase: false*/
            return processAPI
              .get({
                id: $scope.currentTask.processId
              })
              .$promise.then(function (data) {
                // Load the task informatioin for the iframe
                $scope.formUrl = iframe.getTaskForm(data, $scope.currentTask, taskListStore.user.user_id, false);
              });
          }
        })
        .catch(function () {
          $scope.hasForm = false;
        })
        .finally(function () {
          $scope.loading = false;
        });
    }

    function hasFormMapping(formMappingQueryResponse) {
      return !(formMappingQueryResponse.resource.pagination.total > 0 && formMappingQueryResponse.resource[0].target === 'NONE');
    }

    function isEditable() {
      /*jshint camelcase: false*/
      return taskListStore.currentTask && taskListStore.currentTask.assigned_id === taskListStore.user.user_id;
    }

    function isAssignable() {
      return taskListStore.request.taskFilter !== TASK_FILTERS.DONE;
    }

    function isInactive() {
      return taskListStore.tasks.length === 0;
    }

    function hideForm() {
      return taskListStore.request.taskFilter === TASK_FILTERS.DONE;
    }
  }

})();
