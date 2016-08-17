(function() {

  'use strict';

  angular
    .module('org.bonitasoft.features.user.tasks.list.table')
    .directive('taskTable', taskTableDirective);

  /**
   * The tasklist directive displays  a task list
   * tasklist parameters :
   * {Array}    tasks          an array of tasks
   * {Object}   current-task   the selected tasks
   * {Object}   request        a TaskRequest instance
   * {Object}   user           the connected user
   * {String}   mode           the current layout mode (min / mid / max)
   * {Array}    page-sizes     an array of the page sizes (@see api.request.TaskRequest)
   * {function} refresh        handler for updating tasks
   * {function} selectTask     handler for selecting a task
   * {function} doTask         handler for displaying a popup form task (used in full list layout)
   * {function} viewTask       handler for displaying a popup context task (used in full list layout)
   */
  function taskTableDirective($q, key, humanTaskAPI, preference, $location, $anchorScroll, $timeout, COLUMNS_SETTINGS, priorities, ngToast, gettextCatalog, TASK_FILTERS) {
    return {
      controller: 'TaskTableCtrl',
      restrict: 'AE',
      templateUrl: 'portalTemplates/user/tasks/list/table/task-table.html',
      scope: {
        tasks: '=',
        currentTask: '=',
        request: '=',
        user: '=',
        mode: '=',
        pageSizes: '=',
        refresh: '&',
        selectTask: '&',
        doTask: '&',
        counters: '=',
        filter: '='
      },
      link: function($scope, $elem, attr, ctrl) {

        /**
         * Initializing keymaster
         */
        var lastSelectedIndex = -1;

        $scope.getPriority = priorities.get;
        $scope.TASK_FILTERS = TASK_FILTERS;

        $scope.changeFilter = function(filter) {
          $scope.filter = filter;
        };

        //Scope properties
        $scope.$watch('mode', function(mode) {
          $scope.columnSettings = preference.get(mode) || COLUMNS_SETTINGS.mid;
        });


        /**
         * set request page size
         * @param {int} size the page size
         */
        $scope.pageSizeHandler = function(size) {
          $scope.request.pagination.numberPerPage = size;
          $scope.refresh();
        };

        /**
         * clickTask handler
         */
        $scope.onClickTask = function(task) {
          $scope.selectTask({
            task: task
          });

          if ($scope.mode === 'max') {
            $scope.doTask({
              task: task
            });
          }
        };

        /**
         * save column visibility state as a preference
         */
        $scope.visibilityHandler = function(field, columns) {
          var cols = columns.map(function(item) {
            return item.visible;
          });
          preference.set($scope.mode, cols);
        };

        /**
         * group actions (take / release)
         */
        function assignTasks(tasks, assignee) {
          if (!tasks) {
            return;
          }
          var promises = tasks
            .map(function(task) {
              /* jshint camelcase: false */
              return humanTaskAPI.update({
                id: task.id,
                assigned_id: assignee
              }).$promise;
            });

          $q.all(promises)
            .then(function() {
              $scope.tasks.forEach(function(task) {
                return ctrl.checkTask(false, task);
              });
            })
            .catch(function(error) {
              if (error.status === 403 || error.status === 404) {
                ngToast.create({
                  className: 'warning',
                  content: gettextCatalog.getString('One or more tasks are not available anymore. The list is now up to date.')
                });
              }
            })
            .finally(function() {
              $scope.refresh();
            });
        }

        /**
         * Scope handler for takeTask button
         * @return {Object} promise of updated task
         */
        $scope.takeTasks = function(tasks) {
          /* jshint camelcase: false */
          return assignTasks(tasks.filter(ctrl.isUnAssigned), $scope.user.user_id);
        };

        /**
         * Scope handler for releaseTask button
         * @return {Object} promise of updated task
         */
        $scope.releaseTasks = function(tasks) {
          return assignTasks(tasks.filter(ctrl.isAssigned), '');
        };

        /**
         * Scope handler for goTo button (use on mobile size layout)
         * performs a scrollTo TaskDetail component
         */
        $scope.goToDetail = function(id) {
          // the element you wish to scroll to.
          $location.hash(id);
          $anchorScroll();
        };

        /**
         * toggling action button when mouseover a tr
         * @param  {Object} task
         */
        $scope.showTaskButtons = function(task) {
          task.btnVisible = true;
        };
        $scope.hideTaskButtons = function(task) {
          task.btnVisible = false;
        };


        /**
         * checkbox change handler for handling multi selection using key lib
         * @param  {MouseEvent} event
         * @param  {int}        taskIndex
         */
        $scope.onCheckBoxChange = function(event, taskIndex) {
          event.stopPropagation();

          $timeout(function() {
            if (key.shift && lastSelectedIndex !== -1) {

              var value = event.target.checked;

              if (lastSelectedIndex > taskIndex) {
                lastSelectedIndex += 1;
              }
              var cb = $elem[0].querySelectorAll('tbody input[type=checkbox]');
              [].slice.call(cb, Math.min(lastSelectedIndex, taskIndex), Math.max(lastSelectedIndex, taskIndex))
                .filter(function(item) {
                  return item.checked !== value;
                })
                .forEach(function(item) {
                  item.click();
                });
            }

            lastSelectedIndex = taskIndex;
          });

        };
      }
    };
  }


})();
