(function(){
  'use strict';

  /**
   * TaskRequest is an object representation of the different paremeters
   * used in bonita API#search method. a TaskRequest handle
   * - search
   * - filter
   * - pagination
   * - order
   *
   */

  angular
    .module('api.request', ['org.bonitasoft.features.user.tasks.app.config'])

    /**
     * @constant Array of page sizes for paginating tasks list
     * @type {Array}
     */
    .constant('PAGE_SIZES', [25,50])

    /**
     * @constant default page size in tasks list
     * @type {Array}
     */
    .constant('DEFAULT_PAGE_SIZE', 50)

    /**
     * taskRequest service
     * taskRequest handle search API paremeters for tasks
     * @see  app.store
     */
    .service('taskRequest', [
      'TASK_FILTERS',
      'DEFAULT_PAGE_SIZE',
      function(TASK_FILTERS, DEFAULT_PAGE_SIZE) {

        /**
         * If provided, a process filter token is added to the request
         * @type {Object}
         */
        this.process = null;

        /**
         * If provided, a case id filter token is added to the request
         * @type {Number}
         */
        this.caseId = null;

        /**
         * current Task Filter
         * Task filter contains
         *  - the resource to use for search
         *  - a list of predefined filters and
         *
         * @type {Object}
         * @see  resources.config.TASK_FILTERS
         */
        this.taskFilter = TASK_FILTERS.TODO;

        this.searchOption = {
          d:['rootContainerId']
        };

        /**
         * the text filter value
         * @type {String}
         */
        this.search = '';

        /**
         * current pagination config
         * @type {Object}
         */
        this.pagination = {
          numberPerPage: DEFAULT_PAGE_SIZE
        };

        /**
         * return an object containing the resource to use and a request object parameters
         * @return {Object}
         */
        this.getRequest = function(){
          var params = angular.extend({}, this.searchOption);

          if (this.search) {
            params.s = this.search || '';
          }

          params.c = this.pagination.numberPerPage;
          params.p = this.pagination.currentPage-1 || 0;
          params.o = this.taskFilter.sortOption.property + ' ' + (this.taskFilter.sortOption.direction ? 'DESC' : 'ASC');
          params.f = this.taskFilter.filters.slice();

          if (this.caseId) {
            if (this.taskFilter === TASK_FILTERS.DONE) {
              params.f.push('rootCaseId='+this.caseId);
            } else {
              params.f.push('caseId='+this.caseId);
            }
          }

          if (this.process && this.process.id && this.taskFilter !== TASK_FILTERS.DONE) {
            params.f.push('processId='+this.process.id);
          }

          return {
            resource: this.taskFilter.resource,
            params: params
          };
        };
      }
    ]);
})();
