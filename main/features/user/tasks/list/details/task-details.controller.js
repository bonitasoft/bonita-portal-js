(function() {

  'use strict';

  angular
    .module('org.bonitasoft.features.user.tasks.details')
    .controller('TaskDetailsCtrl', TaskDetailsCtrl);

  function TaskDetailsCtrl($scope, iframe, taskListStore, taskDetailsHelper, processAPI, formMappingAPI, userTaskAPI, TASK_FILTERS) {
    $scope.isAssignable = isAssignable;
    $scope.isEditable = isEditable;
    $scope.isInactive = isInactive;
    $scope.hideForm = hideForm;
    $scope.selectTab = selectTab;

    $scope.tab = {
      form: undefined,
      comments: undefined,
      context: undefined
    };
    resetTabsState();
    selectTab('form');

    $scope.hasOverview = false;
    $scope.hasForm = false;
    $scope.hasContract = false;

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
          if (hasFormMappingToBeReloaded(oldTask, newTask)) {
            fetchFormMapping();
          } else {
            $scope.loading = false;
          }
        } else {
          $scope.hasForm = false;
          $scope.loading = false;
        }
      }
      resetTabsState();
      selectTab('form');
    });

    /**
     * Check the tasks values to know if the form mapping must be reloadednew task is a task different from the old task
     */
    function hasFormMappingToBeReloaded(oldTask, newTask) {
      return newTask === oldTask || !oldTask || (newTask && (newTask.id !== oldTask.id || oldTask.archivedDate));
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
        if (!hideForm()) {
          if ($scope.hasForm) {
            /*jshint camelcase: false*/
            return processAPI.get({
              id: $scope.currentTask.processId
            })
              .$promise.then(function (data) {
                // Load the task informatioin for the iframe
                $scope.formUrl = iframe.getTaskForm(data, $scope.currentTask, taskListStore.user.user_id, false);
              })
              .finally(function () {
                $scope.loading = false;
              });
          } else {
            fetchTaskContract();
          }
        } else {
          $scope.loading = false;
        }
      })
        .catch(function () {
          $scope.hasForm = false;
          fetchTaskContract();
        });
    }

    /**
     * Check the task has a contract not empty and set hasContract accordingly and loading to false
     */
    function fetchTaskContract() {
      userTaskAPI.getContract($scope.currentTask.id).then(function (response) {
        if (response.data && response.data.inputs && response.data.inputs.length > 0) {
          $scope.hasContract = true;
        } else {
          $scope.hasContract = false;
        }
      })
        .catch(function () {
          $scope.hasContract = false;
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

    function selectTab(tabName) {
      $scope.tab[tabName].active = true;
      $scope.tab[tabName].loaded = true;
    }

    function resetTabsState() {
      Object.keys($scope.tab).forEach(function(key) {
        $scope.tab[key] = { loaded: false, active: false};
      });
    }
  }

})();
