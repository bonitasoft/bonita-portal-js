/* jshint sub:true*/
/** Copyright (C) 2015 Bonitasoft S.A.
 * BonitaSoft, 31 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

(function () {
  'use strict';
  angular.module('org.bonitasoft.features.admin.cases.list.table', [
    'org.bonitasoft.common.resources',
    'org.bonitasoft.common.table.resizable',
    'org.bonitasoft.common.filters.stringTemplater',
    'org.bonitasoft.services.topurl',
    'org.bonitasoft.features.admin.cases.list.values',
    'org.bonitasoft.features.admin.cases.list.filters',
    'org.bonitasoft.features.admin.cases.list.delete',
    'gettext',
    'ui.bootstrap',
    'ui.router',
    'angular-growl',
    'ngAnimate',
    'org.bonitasoft.bonitable',
    'org.bonitasoft.bonitable.selectable',
    'org.bonitasoft.bonitable.repeatable',
    'org.bonitasoft.bonitable.sortable',
    'org.bonitasoft.bonitable.storable',
    'org.bonitasoft.bonitable.settings',
    'org.bonitasoft.templates',
    'as.sortable',
    'org.bonitasoft.common.filters.date.parser',
    'org.bonitasoft.service.features'
  ])
    .config(['growlProvider', function (growlProvider) {
      growlProvider.globalPosition('top-center');
    }])
    .controller('ActiveCaseListCtrl', ['$scope', 'caseAPI', 'casesColumns', 'defaultPageSize', 'defaultSort',
      'defaultDeployedFields', 'defaultActiveCounterFields', '$location', 'pageSizes', 'defaultFilters', 'dateParser',
      '$anchorScroll', 'growl', 'moreDetailToken', 'tabName', 'manageTopUrl',
      'processId', 'supervisorId', 'caseStateFilter', 'FeatureManager', CaseListCtrl])


    .controller('ArchivedCaseListCtrl', ['$scope', 'archivedCaseAPI', 'archivedCasesColumns', 'defaultPageSize',
      'archivedDefaultSort', 'defaultDeployedFields', 'defaultArchivedCounterFields', '$location', 'pageSizes', 'defaultFilters', 'dateParser',
      '$anchorScroll', 'growl', 'archivedMoreDetailToken', 'tabName', 'manageTopUrl',
      'processId', 'supervisorId', 'caseStateFilter', 'FeatureManager', CaseListCtrl]);

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
  function CaseListCtrl($scope, caseAPI, casesColumns, defaultPageSize, defaultSort, defaultDeployedFields, defaultCounterFields, $location, pageSizes, defaultFilters, dateParser, $anchorScroll, growl, moreDetailToken, tabName, manageTopUrl, processId, supervisorId, caseStateFilter, FeatureManager) {
    var vm = this;
    var modeDetailProcessToken = 'processmoredetailsadmin';

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
    $scope.selectedFilters = {
      processId: processId
    };
    $scope.pageSizes = pageSizes;
    /**
     * @ngdoc property
     * @name o.b.f.admin.cases.list.CaseListCtrl#cases
     * @propertyOf o.b.f.admin.cases.list.CaseListCtrl
     * @description
     * the array of cases to display
     */
    $scope.cases = undefined;
    $scope.loading = true;

    var defaultFiltersArray = [];
    if (supervisorId) {
      defaultFiltersArray.push('supervisor_id=' + supervisorId);
      moreDetailToken = moreDetailToken.replace('admin', 'pm');
      modeDetailProcessToken = modeDetailProcessToken.replace('admin', 'pm');
    }
    if(angular.isDefined(caseStateFilter) && !!caseStateFilter){
      defaultFiltersArray.push('state=' + caseStateFilter);
    }
    $scope.processManager = +!!supervisorId;
    $scope.supervisorId = supervisorId;

    $scope.archivedTabName = !!tabName;
    $scope.searchOptions = {filters: [], searchSort: defaultSort + ' ' + 'ASC'};
    $scope.searchOptions.filters = angular.copy(defaultFiltersArray);
    //never used it but initialized in this scope in order to keep track of sortOptions on table reload
    $scope.sortOptions = {
      property: defaultSort,
      direction: true
    };

    vm.reinitCases = function () {
      delete $scope.searchOptions.searchSort;
      $scope.pagination.currentPage = 1;
      vm.searchForCases();
    };

    $scope.$on('caselist:http-error', handleHttpErrorEvent);
    $scope.$on('caselist:notify', addAlertEventHandler);
    $scope.$on('caselist:search', searchForCases);

    vm.loadContent = function() {
      $scope.$watch('selectedFilters', buildFilters, true);
      $scope.$watch('searchOptions', function () {
        $scope.pagination.currentPage = 1;
        //if processId is still set it means filters have not been process and need to
        //wait for them to update
        if (!$scope.selectedFilters.processId) {
          vm.searchForCases();
        }
      }, true);
    };

    vm.parseAndFormat = dateParser.parseAndFormat;

    vm.updateSortField = function updateSortField(sortOptions) {
      if (!$scope.searchOptions.searchSort || sortOptions) {
        $scope.searchOptions.searchSort = ((sortOptions && sortOptions.property) ?
          sortOptions.property : defaultSort) + ' ' + ((sortOptions && sortOptions.direction === false) ? 'DESC' : 'ASC');
        $scope.pagination.currentPage = 1;
      }
    };

    vm.onDropComplete = function ($index, $data) {
      if ($scope.columns && $scope.columns && $data) {
        var formerIndex = $scope.columns.indexOf($data);
        if (formerIndex !== $index - 1 && formerIndex > -1) {
          var i;
          if (formerIndex > $index) {
            for (i = formerIndex - 1; i >= $index; i--) {
              $scope.columns[i + 1] = $scope.columns[i];
            }
            $scope.columns[$index] = $data;
          } else {
            for (i = formerIndex + 1; i < $index; i++) {
              $scope.columns[i - 1] = $scope.columns[i];
            }
            $scope.columns[$index - 1] = $data;
          }
        }
      }
    };

    vm.filterColumn = function (column) {
      return column && column.selected;
    };

    vm.changeItemPerPage = function (pageSize) {
      if (pageSize) {
        $scope.pagination.itemsPerPage = pageSize;
        $scope.pagination.currentPage = 1;
        vm.searchForCases();
      }
    };

    vm.getLinkToCase = function (caseItem) {
      if (caseItem) {
        return manageTopUrl.getPath() + manageTopUrl.getSearch() + '#?id=' + caseItem.id + '&_p=' + (moreDetailToken || '') + '&' + manageTopUrl.getCurrentProfile();
      }
    };

    vm.getLinkToProcess = function (caseItem) {
      if (caseItem && caseItem.processDefinitionId) {
        return manageTopUrl.getPath() + manageTopUrl.getSearch() + '#?id=' + caseItem.processDefinitionId.id + '&_p=' + (modeDetailProcessToken || '') + '&' + manageTopUrl.getCurrentProfile();
      }
    };

    vm.getLinkToCaseOverview = function (caseItem) {
      if (caseItem) {
        return manageTopUrl.getPath() + manageTopUrl.getSearch() + '#?name=' + caseItem.processDefinitionId.name + '&version=' + caseItem.processDefinitionId.version + '&processDefinitionId=' + caseItem.processDefinitionId.id + '&id=' + caseItem.id + '&token=DisplayCaseForm&_p=DisplayCaseForm' + '&_pf=' + manageTopUrl.getCurrentProfile();
      }
    };

    vm.getLinkToArchivedCaseOverview = function(archivedCaseItem) {
      if (archivedCaseItem) {
        return manageTopUrl.getPath() + manageTopUrl.getSearch() + '#?name=' + archivedCaseItem.processDefinitionId.name + '&version=' + archivedCaseItem.processDefinitionId.version + '&processDefinitionId=' + archivedCaseItem.processDefinitionId.id + '&id=' + archivedCaseItem.id + '&sourceObjectId=' + archivedCaseItem.sourceObjectId + '&token=DisplayCaseForm&_p=DisplayCaseForm' + '&_pf=' + manageTopUrl.getCurrentProfile();
      }
    };

    vm.addAlertEventHandler = addAlertEventHandler;
    function addAlertEventHandler(event, msg) {
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
    }

    vm.buildFilters = buildFilters;
    function buildFilters() {
      var filters = angular.copy(defaultFiltersArray);
      if ($scope.selectedFilters.selectedProcessDefinition) {
        filters.push('processDefinitionId=' + $scope.selectedFilters.selectedProcessDefinition);
      } else if ($scope.selectedFilters.selectedApp && $scope.selectedFilters.selectedApp !== defaultFilters.appName) {
        filters.push('name=' + $scope.selectedFilters.selectedApp);
      }
      if ($scope.selectedFilters.selectedStatus && $scope.selectedFilters.selectedStatus !== defaultFilters.caseStatus) {
        filters.push('state=' + $scope.selectedFilters.selectedStatus);
      }
      $scope.searchOptions.filters = filters;
    }

    vm.handleHttpErrorEvent = handleHttpErrorEvent;
    function handleHttpErrorEvent(event, error) {
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
          $scope.$emit('caselist:notify', message);
        }
      }
    }


    vm.searchForCases = searchForCases;
    vm.displayKeys = displayKeys;

    function displayKeys() {
      return FeatureManager.isSearchIndexedFeatureActivated();
    }

    function searchForCases() {
      $scope.loading = true;
      //these tmp variables are here to store currentSearch results
      //and not store them directly in scope in case another search is called before
      //the first one finishes. See cases-list-controller.spec.js#'page changes'
      var casesForCurrentSearch = $scope.cases = [];
      var paginationForCurrentSearch = $scope.pagination = angular.copy($scope.pagination);
      caseAPI.search({
        p: paginationForCurrentSearch.currentPage - 1,
        c: paginationForCurrentSearch.itemsPerPage,
        d: defaultDeployedFields,
        o: $scope.searchOptions.searchSort,
        f: $scope.searchOptions.filters,
        n: defaultCounterFields,
        s: $scope.selectedFilters.currentSearch
      }).$promise.then(function mapCases(fullCases) {
          paginationForCurrentSearch.total = fullCases && fullCases.resource && fullCases.resource.pagination && fullCases.resource.pagination.total;
          $scope.currentFirstResultIndex = ((paginationForCurrentSearch.currentPage - 1) * paginationForCurrentSearch.itemsPerPage) + 1;
          $scope.currentLastResultIndex = Math.min($scope.currentFirstResultIndex + paginationForCurrentSearch.itemsPerPage - 1, paginationForCurrentSearch.total);
          if (fullCases && fullCases.resource) {
            fullCases.resource.map(function selectOnlyInterestingFields(fullCase) {
              var simpleCase = {};
              $scope.columns.forEach(function (column) {
                var currentCase = fullCase;
                for (var j = 0; j < column.path.length; j++) {
                  currentCase = currentCase && currentCase[column.path[j]];
                }
                simpleCase[column.name] = currentCase;
              });

              if(fullCase['started_by'].firstname && fullCase['started_by'].lastname) {
                simpleCase['Started by fullname'] = fullCase['started_by'].firstname + ' ' + fullCase['started_by'].lastname;
              }
              simpleCase.id = fullCase.id;
              simpleCase.processDefinitionId = fullCase.processDefinitionId;
              simpleCase.fullCase = fullCase;
              simpleCase.sourceObjectId = fullCase.sourceObjectId;
              return simpleCase;
            }).forEach(function (caseItem) {
              casesForCurrentSearch.push(caseItem);
            });
          }
        }, function (error) {
          paginationForCurrentSearch.total = 0;
          $scope.currentFirstResultIndex = 0;
          $scope.currentLastResultIndex = 0;
          $scope.$emit('caselist:http-error', error);
        }).finally(function () {
          $scope.loading = false;
          $anchorScroll();
        });
    }
  }
})();
