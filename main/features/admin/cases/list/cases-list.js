(function() {
  'use strict';
  angular.module('org.bonita.features.admin.cases.list.table', [
    'org.bonita.common.resources',
    'org.bonita.common.table.resizable',
    'org.bonita.services.topurl',
    'org.bonita.sortable',
    'org.bonita.features.admin.cases.list.values',
    'org.bonita.features.admin.cases.list.filters',
    'org.bonita.features.admin.cases.list.delete',
    'org.bonita.features.admin.cases.list.formatContent',
    'gettext',
    'ui.bootstrap',
    'ui.router',
    'lrDragNDrop',
    'org.bonita.common.directives.selectAll',
    'angular-growl',
    'ngAnimate'
  ])
  .config(['growlProvider',function (growlProvider) {
      growlProvider.globalPosition('top-center');
    }])
  .controller('ActiveCaseListCtrl', ['$scope', 'caseAPI', 'casesColumns', 'defaultPageSize', 'defaultSort',
    'defaultDeployedFields', 'defaultActiveCounterFields', '$location', 'pageSizes', 'defaultFilters', '$filter',
    '$anchorScroll', 'growl', '$window', 'moreDetailToken', 'activedTabName', 'manageTopUrl',
    'processId', 'supervisorId', CaseListCtrl])


  .controller('ArchivedCaseListCtrl', ['$scope', 'archivedCaseAPI', 'archivedCasesColumns', 'defaultPageSize',
    'defaultSort', 'defaultDeployedFields', 'defaultArchivedCounterFields', '$location', 'pageSizes', 'defaultFilters', '$filter',
    '$anchorScroll', 'growl', '$window', 'archivedMoreDetailToken', 'archivedTabName', 'manageTopUrl',
    'processId', 'supervisorId', CaseListCtrl]);

  /**
   * @ngdoc object
   * @name o.b.f.admin.cases.list.CaseListCtrl
   * @description
   * This is a controller that manages the case list table
   *
   * @requires $scope
   * @requires caseAPI
   * @requires casesColumns
   * @requires defaultPageSize
   * @requires defaultSort
   * @requires defaultDeployedFields
   * @requires $location
   * @requires $window
   * @requires pageSizes
   * @requires defaultFilters
   * @requires $filter
   * @requires $anchorScroll
   * @requires growl
   */
  /* jshint -W003 */
  function CaseListCtrl($scope, caseAPI, casesColumns, defaultPageSize, defaultSort, defaultDeployedFields, defaultCounterFields, $location, pageSizes, defaultFilters, $filter, $anchorScroll, growl, $window, moreDetailToken, tabName, manageTopUrl, processId, supervisorId) {
    /**
     * @ngdoc property
     * @name o.b.f.admin.cases.list.CaseListCtrl#columns
     * @propertyOf o.b.f.admin.cases.list.CaseListCtrl
     * @description
     * an array of columns to display in the case table and the way
     * to display and retrieve the content
     */
    $scope.columns = casesColumns;
    /**
     * @ngdoc property
     * @name o.b.f.admin.cases.list.CaseListCtrl#pagination
     * @propertyOf o.b.f.admin.cases.list.CaseListCtrl
     * @description
     * an object containing the pagination state
     */
    $scope.pagination = {
      itemsPerPage: defaultPageSize,
      currentPage: 1,
      total: 0
    };
    $scope.selectedFilters = {};
    $scope.pageSizes = pageSizes;
    /**
     * @ngdoc property
     * @name o.b.f.admin.cases.list.CaseListCtrl#cases
     * @propertyOf o.b.f.admin.cases.list.CaseListCtrl
     * @description
     * the array of cases to display
     */
    $scope.cases = undefined;
    $scope.filters = [];
    $scope.moreDetailToken = moreDetailToken;
    $scope.loading = true;

    var defaultFiltersArray = [];
    if (supervisorId) {
      defaultFiltersArray.push('supervisor_id=' + supervisorId);
      $scope.moreDetailToken = moreDetailToken.replace('admin', 'pm');
    }
    $scope.processManager = +!!supervisorId;
    $scope.filters = angular.copy(defaultFiltersArray);
    $scope.supervisorId = supervisorId;

    $scope.selectedFilters.processId = processId;
    $scope.archivedTabName = !!tabName;

    manageTopUrl.addOrReplaceParam('_tab', tabName);

    manageTopUrl.addOrReplaceParam('_processId', processId || '');

    $scope.reinitCases = function() {
      delete $scope.searchSort;
      $scope.pagination.currentPage = 1;
      $scope.searchForCases();
    };
    $scope.addAlert = function(msg) {
      var options = {
        ttl: 3000,
        disableCountDown: true,
        disableIcons: true
      };
      var content = ((msg.status || '') + ' ' + (msg.statusText || '') + ' ' + (msg.errorMsg || '')).trim();
      switch (msg.type) {
        case 'success':
          growl.success(content, options);
          break;
        case 'danger':
          growl.error(content, options);
          break;
        default:
          growl.info(content, options);
      }
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.$watch('filters', function() {
      $scope.pagination.currentPage = 1;
      //if processId is still set it means filters have not been process and need to
      //wait for them to update
      if(!$scope.selectedFilters.processId){
        $scope.searchForCases();
      }
    }, true);

    $scope.buildFilters = function() {
      var filters = angular.copy(defaultFiltersArray);
      if ($scope.selectedFilters.selectedProcessDefinition) {
        filters.push('processDefinitionId=' + $scope.selectedFilters.selectedProcessDefinition);
      } else if ($scope.selectedFilters.selectedApp && $scope.selectedFilters.selectedApp !== defaultFilters.appName) {
        filters.push('name=' + $scope.selectedFilters.selectedApp);
      }
      if ($scope.selectedFilters.selectedStatus && $scope.selectedFilters.selectedStatus !== defaultFilters.caseStatus) {
        filters.push('state=' + $scope.selectedFilters.selectedStatus);
      }
      $scope.filters = filters;
    };
    //never used it but initialized in this scope in order to keep track of sortOptions on table reload
    $scope.sortOptions = {
      property: 'defaultSort'
    };

    $scope.searchForCases = function casesSearch(sortOptions) {
      if (!$scope.searchSort || sortOptions) {
        $scope.searchSort = ((sortOptions && sortOptions.property) ?
          sortOptions.property : defaultSort) + ' ' + ((sortOptions && !sortOptions.ascendant) ? 'DESC' : 'ASC');
        $scope.pagination.currentPage = 1;
      }
      $scope.loading = true;
      $scope.cases = [];
      caseAPI.search({
        p: $scope.pagination.currentPage - 1,
        c: $scope.pagination.itemsPerPage,
        d: defaultDeployedFields,
        o: $scope.searchSort,
        f: $scope.filters,
        n: defaultCounterFields,
        s: $scope.selectedFilters.currentSearch
      }).$promise.then(function mapCases(fullCases) {
        $scope.pagination.total = fullCases && fullCases.resource && fullCases.resource.pagination && fullCases.resource.pagination.total;
        $scope.currentFirstResultIndex = (($scope.pagination.currentPage - 1) * $scope.pagination.itemsPerPage) + 1;
        $scope.currentLastResultIndex = Math.min($scope.currentFirstResultIndex + $scope.pagination.itemsPerPage - 1, $scope.pagination.total);
        if(fullCases && fullCases.resource){
          fullCases.resource.map(function selectOnlyInterestingFields(fullCase) {
            var simpleCase = {};
            for (var i = 0; i < $scope.columns.length; i++) {
              var currentCase = fullCase;
              for (var j = 0; j < $scope.columns[i].path.length; j++) {
                currentCase = currentCase && currentCase[$scope.columns[i].path[j]];
              }
              simpleCase[$scope.columns[i].name] = currentCase;
            }
            simpleCase.id = fullCase.id;
            simpleCase.processDefinitionId = fullCase.processDefinitionId;
            return simpleCase;
          }).forEach(function(caseItem){
            $scope.cases.push(caseItem);
          });
        }
      }, function(error) {
        $scope.pagination.total = 0;
        $scope.currentFirstResultIndex = 0;
        $scope.currentLastResultIndex = 0;
        $scope.cases = [];
        $scope.displayError(error);
      }).finally(function() {
        $scope.loading = false;
        $anchorScroll();
      });
    };

    $scope.displayError = function(error) {
      if (error) {
        if (error.status === 401) {
          $location.url('/');
        } else {
          var message = {
            status: error.status,
            statusText: error.statusText,
            type: 'danger'
          };
          if (error.data) {
            message.errorMsg = error.data.message;
            message.resource = error.data.api + '/' + error.data.resource;
          }
          $scope.addAlert(message);
        }
      }
    };

    $scope.getCaseDetailUrl = function(caseItemId) {
      if (caseItemId) {
        return manageTopUrl.getUrlToTokenAndId(caseItemId, $scope.moreDetailToken);
      }
    };

    $scope.selectColumn = function(column) {
      if (column) {
        column.selected = !column.selected;
      }
    };

    $scope.filterColumn = function(column) {
      return column && column.selected;
    };

    $scope.changeItemPerPage = function(pageSize) {
      if (pageSize) {
        $scope.pagination.itemsPerPage = pageSize;
        $scope.pagination.currentPage = 1;
        $scope.searchForCases();
      }
    };
  }
})();
