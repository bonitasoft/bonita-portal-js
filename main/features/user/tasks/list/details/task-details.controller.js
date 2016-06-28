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

    // Watch the currentCase
    $scope.$watch(function() {
      return taskListStore.currentCase;
    }, function(newCase) {
      $scope.currentCase = newCase;
      if (!newCase) {
        return;
      }
      $scope.hasOverview = false;
      //Check if the process has an overview
      formMappingAPI.search({
        p: 0,
        c: 1,
        f: ['processDefinitionId=' + $scope.currentCase.processDefinitionId.id, 'type=PROCESS_OVERVIEW']
      }).$promise.then(function(response) {
          $scope.hasOverview = hasFormMapping(response);
          if ($scope.hasOverview) {
            $scope.overviewUrl = iframe.getCaseOverview(newCase, newCase.processDefinitionId);
          }
        });
    });

    // Watch the currentTask
    $scope.$watch('currentTask', function(newTask) {
      if (!newTask) {
        return;
      }
      $scope.hasForm = false;
      //Check if the task has a form
      if ('USER_TASK' === $scope.currentTask.type) {
        $scope.loading = true;
        formMappingAPI.search({
          p: 0,
          c: 1,
          f: ['processDefinitionId=' + $scope.currentTask.processId, 'task=' + $scope.currentTask.name, 'type=TASK']
        }).$promise.then(function(response) {
            $scope.hasForm = hasFormMapping(response);
            if($scope.hasForm && !hideForm()) {
              /*jshint camelcase: false*/
              return processAPI
                .get({
                  id: $scope.currentTask.processId
                })
                .$promise.then(function(data) {
                  // Load the task informatioin for the iframe
                  $scope.formUrl = iframe.getTaskForm(data, $scope.currentTask, taskListStore.user.user_id, false);
                });
            }
          })
          .finally(function() {
            $scope.loading = false;
          });
      }
      $scope.tab.form = true;
    });

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
