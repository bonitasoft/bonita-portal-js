(function() {
  'use strict';

  /**
   * TaskList application Store
   *
   * the store handles application state.
   * store makes request to bonita API and stores the result.
   */
  angular
    .module('org.bonitasoft.features.user.tasks.app.store', [
      'api.request',
      'org.bonitasoft.features.user.tasks.app.config',
      'gettext'
    ])
    .service('taskListStore', [
      'archivedFlowNodeAPI',
      'caseAPI',
      'archivedCaseAPI',
      'commentAPI',
      'processAPI',
      'processSupervisorAPI',
      'professionalDataAPI',
      '$q',
      'TASK_FILTERS',
      'taskRequest',
      'gettextCatalog',
      function(archivedFlowNodeAPI, caseAPI, archivedCaseAPI, commentAPI, processAPI, processSupervisorAPI, professionalDataAPI, $q, TASK_FILTERS, taskRequest, gettextCatalog) {
        var store = this;

        this.processes = [];
        this.tasks = [];
        this.user = null;
        this.currentCase = null;
        this.currentTask = null;
        this.count = {};
        this.request = taskRequest;

        /**
         * retrieve a process list from the API
         * @name  getProcessList
         * @return {object} a promise of an array of processes
         */
        this.getProcessList = function() {
          var req = {
            c: 0,
            p: 0,
            /* jshint camelcase: false */
            f: ['user_id=' + this.user.user_id, 'forPendingOrAssignedTask=true']
          };

          var promise = processAPI.search(req).$promise
            .then(function(response) {
              req.c = response.resource.pagination.total;
              return processAPI.search(req).$promise;
            })
            .then(function(response) {
              store.processes = [{
                name: gettextCatalog.getString('All'),
                id: false
              }].concat(response.resource);
              store.request.process = store.processes[0];
            });

          return promise;
        };

        /**
         * getTasks call bonita API to request task list depending on taskRequest
         * @return {Object} promise of a search result
         */
        this.getTasks = function() {

          var req = this.request.getRequest();

          // Update %id with user_id in filters.
          req.params.f = req.params.f.map(function(filter) {
            /* jshint camelcase: false */
            return filter.replace(/%userId/, store.user.user_id);
          });

          var index = this.tasks.indexOf(this.currentTask);


          return req.resource.search(req.params).$promise
            .then(function(response) {
              store.tasks = response.resource;
              taskRequest.pagination = response.resource.pagination;

              if (store.tasks.length > 0) {
                // Clamp index value between 0 and last item
                index = Math.max(0, Math.min(index, store.tasks.length - 1));
                store.currentTask = store.tasks[index];
              }
            });
        };

        /**
         * retrieve case with caseID from the API
         * @param  {int} caseId the case id
         * @return {object}        a promise of a case
         * @throws {Error} If caseId is not provided
         */
        this.getCaseInfo = function(caseId) {
          if (!caseId) {
            throw new Error('Missing parameter when requesting getCaseInfo caseId');
          }

          var promise = caseAPI.get({
            id: caseId,
            d: ['started_by', 'processDefinitionId']
          }).$promise;

          return promise.then(function(resource) {
            store.currentCase = resource;
          }, function(response){
            if(response.status === 404) {
              var archivedCasePromise = archivedCaseAPI.search({
                p: 0,
                c: 1,
                f: ['sourceObjectId=' + caseId],
                d: ['started_by', 'processDefinitionId']
              }).$promise;
              return archivedCasePromise.then(function (results) {
                if (results.resource.pagination.total > 0) {
                  store.currentCase = results.resource[0];
                }
              });
            }
          });
        };

        /**
         * retrieve process Supervisors from a given processId
         * @param  {int} caseId the case id
         * @return {object}        a promise of a case
         * @throws {Error} If caseId is not provided
         */
        this.getProcessSupervisors = function(processId) {
          /* jshint camelcase: false */
          if (!processId) {
            throw new Error('Missing parameter when requesting getProcessSupervisor processId');
          }

          var promise = processSupervisorAPI.search({
            f: ['process_id=' + processId],
            c: 10,
            p: 0,
            d: 'user_id'
          }).$promise;

          return promise.then(function(response) {
            store.currentCase.supervisors = response.resource;
            // for each Supervisors, we retrieve its professional info (mail)
            var all = response.resource.map(function(supervisor) {
              return professionalDataAPI
                .get({
                  id: supervisor.user_id.id
                })
                .$promise
                .then(function(contact) {
                  supervisor.user_id.email = contact.email;
                });
            });

            return $q.all(all);
          });
        };

        /**
         * retrieve archived flowNode from a given caseId
         * @param  {int} caseId the case id
         * @return {object}        a promise of a case
         * @throws {Error} If caseId is not provided
         */
        this.getArchivedFlowNode = function(caseId) {
          /* jshint camelcase: false */
          if (!caseId) {
            throw new Error('Missing parameter when requesting getArchivedFlowNode caseId');
          }

          var promise = archivedFlowNodeAPI.search({
            f: ['caseId=' + caseId, 'isTerminal=true'],
            c: 100,
            p: 0,
            d: ['executedBySubstitute', 'executedBy']
          }).$promise;

          return promise.then(function(response) {
            return response.resource;
          });
        };


        /**
         * @internal replace user_id token in a predefined list of filters
         * @param  {int}   userId   the user id to replace
         * @param  {Array} filters  an array of filters for API request
         * @return {Array}          an array with current user id
         */
        function getCountRequest(userId, filters) {
          return {
            c: 0,
            p: 0,
            f: filters.map(function(filter) {
              return filter.replace(/%userId/, userId);
            })
          };
        }

        /**
         * retrieve the number of task that match POOL_TASK filter
         * @param  {int} userId  the use id
         * @return {Object}      a promise of a search result
         */
        this.countPoolTasks = function(userId) {
          return countTasks(userId, 'POOL_TASK');
        };

        /**
         * retrieve the number of task that match MY_TASK filter
         * @param  {int} userId  the use id
         * @return {Object}      a promise of a search result
         */
        this.countMyTasks = function(userId) {
          return countTasks(userId, 'MY_TASK');
        };

        /**
         * retrieve the number of task that match TODO filter
         * @param  {int} userId  the use id
         * @return {Object}      a promise of a search result
         */
        this.countTodoTasks = function(userId) {
          return countTasks(userId, 'TODO');
        };

        /**
         * retrieve the number of tasks for all kind of filters
         * @return {Object}      a promise of a multiple search result
         */
        this.countAll = function() {
          /*jshint camelcase: false */
          var fnCountTask = countTasks.bind(null, store.user.user_id);

          var promises = ['TODO', 'MY_TASK', 'POOL_TASK'].map(fnCountTask);

          return $q.all(promises);
        };

        /**
         * @internal retrieve the number of tasks depending on parameter
         * @param  {int}    userId  the use id
         * @param  {object} key     a TASK_FILTERS element
         * @return {Object}         a promise of a search result
         */
        function countTasks(userId, key) {
          var obj = TASK_FILTERS[key];
          var req = getCountRequest(userId, obj.filters);

          var promise = obj.resource.search(req).$promise;

          return promise.then(function(response) {
            store.count[key] = response.resource.pagination.total;
          });
        }
      }
    ]);
})();
