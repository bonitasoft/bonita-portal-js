(function() {
  'use strict';

  /**
   * The tasklist directive displays  a task list
   * tasklist parameters :
   * {Array}    tasks          an array of tasks
   * {Object}   current-task   the selected tasks
   * {Object}   request        a TaskRequest instance
   * {Object}   user           the connected user
   * {String}   mode           the current layout mode (min / mid / max)
   * {Array}    page-sizes     an array of the page sizes (@see api.request.TaskRequest)
   * {function} refreshTasks   handler for updating tasks list
   * {function} refreshCounts  handler for updating task count (@see task.filters.TaskFilters )
   * {function} selectTask     handler for selecting a task
   * {function} doTask         handler for displaying a popup form task (used in full list layout)
   * {function} viewTask       handler for displaying a popup context task (used in full list layout)
   */

  angular
    .module('org.bonitasoft.features.user.tasks.list.table', [
      'ui.router',
      'org.bonitasoft.features.user.tasks.app.config',
      'org.bonitasoft.features.user.tasks.app.pref',
      'org.bonitasoft.features.user.tasks.app.store',
      'org.bonitasoft.features.user.tasks.app.priorities',
      'org.bonitasoft.bonitable',
      'org.bonitasoft.bonitable.selectable',
      'org.bonitasoft.bonitable.sortable',
      'org.bonitasoft.bonitable.repeatable',
      'org.bonitasoft.bonitable.settings',
      'ui.focus',
      'common.filters',
      'ui.bootstrap.pagination',
      'ui.bootstrap.dropdown',
      'keymaster',
      'org.bonitasoft.services.topurl',
      'org.bonitasoft.common.directives.bonitaHref',
      'gettext'
    ])
    .controller('TaskUserListCtrl', [
      '$scope',
      '$q',
      'taskListStore',
      'preference',
      'TASK_FILTERS',
      function($scope, $q, taskListStore, preference, TASK_FILTERS) {
        $scope.TASK_FILTERS = TASK_FILTERS;
        /**
         * Group Actions
         * selecting multiple tasks and manage assignation
         */
        function checkTask(selected, task) {
          task.selected = selected;
        }
        this.checkTask = checkTask;

        function isAssigned(task) {
          /* jshint camelcase: false */
          return task.assigned_id === $scope.user.user_id;
        }
        this.isAssigned = isAssigned;

        function isUnAssigned(task) {
          /* jshint camelcase: false */
          return task.assigned_id !== $scope.user.user_id;
        }
        this.isUnAssigned = isUnAssigned;

        /**
         *  button state control
         */
        $scope.canDoGroupAction = function() {
          return $scope.request.taskFilter !== TASK_FILTERS.DONE;
        };

        /**
         * calculate colspan value
         */
        $scope.colspan = function(cols) {
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
        };

        /**
         * Return a boolean reflecting if selected tasks are not assigned to user
         * @return {Boolean}
         */
        $scope.canTake = function(tasks) {
          if (!tasks) {
            return;
          }
          return $scope.canDoGroupAction() &&
            $scope.request.taskFilter !== TASK_FILTERS.MY_TASKS &&
            tasks.some(isUnAssigned);
        };

        /**
         * Return a boolean reflecting if selected tasks are assigned to user
         * @return {Boolean}
         */
        $scope.canRelease = function(tasks) {
          if (!tasks) {
            return;
          }
          return $scope.canDoGroupAction() &&
            $scope.request.taskFilter !== TASK_FILTERS.MY_TASKS &&
            tasks.some(isAssigned);
        };


        /**
         * disable processFilter is TaskFilter different of TASK_FILTER.TODO
         * @return {[type]} [description]
         */
        $scope.disableProcessFilter = function() {
          return TASK_FILTERS.TODO !== $scope.request.taskFilter;
        };

        $scope.getPaginationStatus = function() {
          var pagination = $scope.request.pagination;
          var pageSize = Math.min(pagination.total, pagination.numberPerPage);

          return (((pagination.currentPage - 1) * pageSize) + 1) +
            ' - ' +
            Math.min(pagination.currentPage * pageSize, pagination.total) +
            ' / ' +
            pagination.total;
        };
      }
    ])
    .directive('taskList', [
      '$q',
      'key',
      'humanTaskAPI',
      'taskListStore',
      'preference',
      '$location',
      '$anchorScroll',
      '$timeout',
      'COLUMNS_SETTINGS',
      'priorities',
      function($q, key, humanTaskAPI, taskListStore, preference, $location, $anchorScroll, $timeout, COLUMNS_SETTINGS, priorities) {
        // Runs during compile
        return {
          // name: '',
          // priority: 1,
          // terminal: true,
          // scope: {}, // {} = isolate, true = child, false/undefined = no change
          controller: 'TaskUserListCtrl',
          restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
          // template: '',
          templateUrl: 'portalTemplates/user/tasks/list/tasks-table.html',
          // transclude: true,
          // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
          scope: {
            tasks: '=',
            currentTask: '=',
            request: '=',
            user: '=',
            mode: '=',
            pageSizes: '=',
            refreshTasks: '&',
            refreshCount: '&',
            selectTask: '&',
            doTask: '&',
            viewTask: '&'
          },
          link: function($scope, $elem, attr, ctrl) {

            /**
             * Initializing keymaster
             */
            var lastSelectedIndex = -1;

            $scope.getPriority = priorities.get;

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
              $scope.refreshTasks();
            };

            /**
             * clickTask handler
             */
            $scope.onClickTask = function(task) {
              $scope.selectTask({
                task: task
              });
            };

            /**
             * refresh tasklist and taskcount
             */
            $scope.refreshAll = function() {
              $scope.refreshCount();
              $scope.refreshTasks();
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
            function assignTasks(tasks, fnFilter, assignee) {
              if (!tasks) {
                return;
              }
              var promises = tasks
                .filter(fnFilter)
                .map(function(task) {
                  /* jshint camelcase: false */
                  return humanTaskAPI.update({
                    id: task.id,
                    assigned_id: assignee
                  }).$promise;
                });

              $q.all(promises).then(function() {
                // unselect tasks
                var fnSelectTask = ctrl.checkTask.bind(null, false);
                $scope.tasks.forEach(fnSelectTask);
                $scope.refreshAll();
              });
            }

            /**
             * Scope handler for takeTask button
             * @return {Object} promise of updated task
             */
            $scope.takeTasks = function(tasks) {
              /* jshint camelcase: false */
              return assignTasks(tasks, ctrl.isUnAssigned, $scope.user.user_id);
            };

            /**
             * Scope handler for releaseTask button
             * @return {Object} promise of updated task
             */
            $scope.releaseTasks = function(tasks) {
              return assignTasks(tasks, ctrl.isAssigned, '');
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
             * call doTask handler
             * @param  {Object} task
             */
            $scope.onDoTask = function(task) {
              $scope.doTask({
                task: task
              });
            };

            /**
             * call viewTask handler
             * @param  {Object} task
             */
            $scope.onViewTask = function(task) {
              $scope.viewTask({
                task: task
              });
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
    ]);

})();
