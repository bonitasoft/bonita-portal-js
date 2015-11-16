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
     * @constant default sort value in tasks list
     * @type {Object}
     */
    .constant('DEFAULT_SORT', {
      property: 'displayName',
      direction: false
    })

    /**
     * @constant Array of page sizes for paginating tasks list
     * @type {Array}
     */
    .constant('PAGE_SIZES', [25,50,100])

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
      'DEFAULT_SORT',
      'DEFAULT_PAGE_SIZE',
      function(TASK_FILTERS, DEFAULT_SORT, DEFAULT_PAGE_SIZE){

        /**
         * If provided, a process filter toke is added to the request
         * @type {Object}
         */
        this.process = null;

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
         * the current sorting option (direction / property)
         * @type {Object}
         */
        this.sortOption = angular.copy(DEFAULT_SORT);

        /**
         * current pagination config
         * @type {Object}
         */
        this.pagination = {
          numberPerPage: DEFAULT_PAGE_SIZE
        };

        /**
         * Reset search request values
         */
        this.resetFilters = function(options) {
          this.search = options && options.search || '' ;
          this.sortOption = options && options.sortOption || angular.copy(DEFAULT_SORT);
          this.process = options && options.process || false;
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
          params.o = this.sortOption.property+' '+(this.sortOption.direction ? 'DESC' : 'ASC');
          params.f = this.taskFilter.filters.slice();

          if (this.process && this.process.id) {
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
