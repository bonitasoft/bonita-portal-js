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

(function() {
  'use strict';
  angular.module('org.bonitasoft.features.admin.cases.list.filters', [
    'org.bonitasoft.common.resources',
    'org.bonitasoft.common.i18n',
    'org.bonitasoft.features.admin.cases.list.values',
    'angular.filter',
    'gettext',
    'ui.bootstrap',
    'ui.router',
    'org.bonitasoft.service.debounce'
  ])
  .constant('CASES_FILTERS_CONSTANTS', {
    notFound : 'not found'
  })
  .controller('ActiveCaseFilterController', ['$scope', 'processAPI', 'defaultFilters', 'caseStatesValues', '$stateParams', '$q', 'debounce', 'i18nService', 'CASES_FILTERS_CONSTANTS',CaseFilterController])
  .directive('activeCaseFilters', function () {
    return {
      restrict: 'E',
      require: '^ActiveCaseListCtrl',
      templateUrl: 'features/admin/cases/list/cases-list-filters.html',
      controller: 'ActiveCaseFilterController',
      controllerAs : 'filterCtrl'
    };
  })
  .controller('ArchivedCaseFilterController', ['$scope', 'processAPI', 'defaultFilters', 'caseStatesValues', '$stateParams', '$q', 'debounce', 'i18nService', 'CASES_FILTERS_CONSTANTS',CaseFilterController])
  .directive('archivedCaseFilters', function() {
    return {
      restrict: 'E',
      require: '^ArchivedCaseListCtrl',
      templateUrl: 'features/admin/cases/list/archived-cases-list-filters.html',
      controller: 'ArchivedCaseFilterController',
      controllerAs : 'filterCtrl'
    };
  });
  /**
   * @ngdoc object
   * @name o.b.f.admin.cases.list.CaseFilterController
   * @description
   * This is a controller that manages the case search filters
   *
   * @requires $scope
   * @requires processAPI
   * @requires defaultFilters
   * @requires caseStatesValues
   * @requires $q
   * @requires debounce
   */
  /* jshint -W003 */
  /* jshint sub:true */
  function CaseFilterController($scope, processAPI, defaultFilters, caseStatesValues, $stateParams, $q, debounce, i18nService, CASES_FILTERS_CONSTANTS) {
    $scope.selectedFilters.selectedProcessName = defaultFilters.processName;
    $scope.selectedFilters.selectedProcessVersion = defaultFilters.processVersion;
    $scope.selectedFilters.selectedStatus = defaultFilters.caseStatus;
    $scope.defaultFilters = defaultFilters;
    $scope.caseStatesValues = caseStatesValues;
    if(angular.isDefined($stateParams.caseStateFilter) && !!$stateParams.caseStateFilter && angular.isDefined($scope.caseStatesValues[$stateParams.caseStateFilter])){
      $scope.selectedFilters.selectedStatus = $stateParams.caseStateFilter;
    }
    $scope.caseStatesValues[defaultFilters.caseStatus] = defaultFilters.caseStatus;
    $scope.allCasesSelected = false;
    $scope.selectedFilters.currentSearch = '';
    $scope.displayProcessSearch = false;
    $scope.selectedFilters.processSearch = '';
    $scope.displayVersionSearch = false;
    $scope.selectedFilters.versionSearch = '';
    $scope.processFilterList = [];
    $scope.versionFilterListProcesses = [];

    var vm = this;

    var supervisorId = $stateParams['supervisor_id'];

    vm.selectProcess = function(processName) {
      $scope.selectedFilters.selectedProcessVersion = undefined;
      if (processName) {
        $scope.selectedFilters.selectedProcessName = processName;
      } else {
        $scope.selectedFilters.selectedProcessName = defaultFilters.processName;
      }
    };

    vm.selectVersion = function(selectedProcessVersion) {
      if (selectedProcessVersion) {
        $scope.selectedFilters.selectedProcessVersion = selectedProcessVersion;
      } else {
        $scope.selectedFilters.selectedProcessVersion = defaultFilters.processVersion;
      }
    };

    vm.selectCaseStatus = function(selectCaseStatus) {
      if (selectCaseStatus && selectCaseStatus !== defaultFilters.caseStatus) {
        $scope.selectedFilters.selectedStatus = selectCaseStatus;
      } else {
        $scope.selectedFilters.selectedStatus = defaultFilters.caseStatus;
      }
    };

    vm.getLabelProcessFiltered = function() {
      if ($scope.selectedFilters.selectedProcessName === undefined) {
        return i18nService.getKey('caselist.filters.all');
      } else if ($scope.selectedFilters.selectedProcessName === CASES_FILTERS_CONSTANTS.notFound) {
        return i18nService.getKey('caselist.filters.processNotFound');
      } else {
        return $scope.selectedFilters.selectedProcessName;
      }
    };

    vm.getLabelVersionFiltered = function() {
      if ($scope.selectedFilters.selectedProcessVersion === undefined) {
        return 'All';
      } else {
        return $scope.selectedFilters.selectedProcessVersion;
      }
    };

    vm.filterProcessDefinition = function(selectedProcessVersion) {
      if (selectedProcessVersion && $scope.selectedFilters.selectedProcessName && $scope.versionFilterListProcesses) {
        var matchingProcessDefs = $scope.versionFilterListProcesses.filter(function(process) {
          return process && process.name === $scope.selectedFilters.selectedProcessName && selectedProcessVersion === process.version;
        });
        if (matchingProcessDefs && matchingProcessDefs.length) {
          $scope.selectedFilters.selectedProcessDefinition = matchingProcessDefs[0] && matchingProcessDefs[0].id;
        } else {
          delete $scope.selectedFilters.selectedProcessDefinition;
        }
      } else {
        delete $scope.selectedFilters.selectedProcessDefinition;
      }
    };

    vm.updateProcessFilterList = function() {
      var filters = {supervisorId: supervisorId};
      vm.getProcessFilterList(filters, $scope.selectedFilters.processSearch, 'last_update_date DESC').then(
        function (result) {
          result.forEach(function (process) {
            if (process && process.name && process.displayName) {
              process.nameUniqueIdentifier = process.name + '-' + process.displayName;
            }
          });
          $scope.processFilterList = result;
        });
    };

    vm.updateProcessFilterListDebounced = function() {
      debounce(vm.updateProcessFilterList, 300);
    };

    vm.updateVersionFilterList = function(selectVersionIfUnique) {
      $scope.versionFilterListProcesses = [];
      $scope.versions = [];
      if($scope.selectedFilters.selectedProcessName) {
        var filters = {name: $scope.selectedFilters.selectedProcessName, supervisorId: supervisorId};
        vm.getProcessFilterList(filters, $scope.selectedFilters.versionSearch, 'version DESC').then(
          function (result) {
            $scope.versionFilterListProcesses = result;
            if (result && result.filter) {
              $scope.versions = result.filter(function(process) {
                return process && process.version;
              }).map(function(process) {
                return process.version;
              });
            }
            if (selectVersionIfUnique) {
              if ($scope && $scope.versions && $scope.versions.length === 1) {
                $scope.selectedFilters.selectedProcessVersion = $scope.versions[0];
              }
            }
          }
        );
      }
    };

    vm.updateVersionFilterListDebounced = function() {
      debounce(vm.updateVersionFilterList, 300);
    };

    vm.processListToggled = function(open) {
      if(!open && $scope.selectedFilters.processSearch){
        $scope.selectedFilters.processSearch = '';
        vm.updateProcessFilterList();
      }
    };

    vm.versionListToggled = function(open) {
      if(!open && $scope.selectedFilters.versionSearch){
        $scope.selectedFilters.versionSearch = '';
        vm.updateVersionFilterList();
      }
    };

    vm.submitSearch = function(){
      $scope.pagination.currentPage = 1;
      $scope.$emit('caselist:search');
    };

    vm.getProcessFilterList = function(filters, searchTerm, order) {
      var filterArray = [];
      if (filters){
        if(filters.supervisorId) {
          filterArray.push('supervisor_id=' + filters.supervisorId);
        }
        if(filters.name) {
          filterArray.push('name=' + filters.name);
        }
      }
      var deferred = $q.defer();
      processAPI.search({
        p: 0,
        c: 9,
        f: filterArray,
        s: searchTerm,
        o: order
      }).$promise.then(function (response) {
        if (response.resource && response.resource.pagination.total > 0) {
          $scope.displayProcessSearch = true;
        }
        deferred.resolve(response.data);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    vm.selectProcessIfDefined = function() {
      if ($scope.selectedFilters.processId) {
        processAPI.get({
          id: $scope.selectedFilters.processId
        }).$promise.then(function(process) {
            $scope.selectedFilters.selectedProcessName = process.name;
            vm.updateVersionFilterList(true);
            $scope.selectedFilters.selectedProcessVersion = process.version;
            return process;
        }, function() {
          $scope.selectedFilters.selectedProcessName = CASES_FILTERS_CONSTANTS.notFound;
        });
      }
    };

    //we cannot watch the updateFilter function directly otherwise
    //it will not be mockable
    $scope.$watch('selectedFilters.selectedProcessName', function() {
      if (!$scope.selectedFilters.processId) {
        delete $scope.selectedFilters.selectedProcessDefinition;
        vm.updateVersionFilterList(true);
      } else if ($scope.selectedFilters.selectedProcessName !== CASES_FILTERS_CONSTANTS.notFound) {
        delete $scope.selectedFilters.processId;
      }
    });
    $scope.$watch('selectedFilters.selectedProcessVersion', function() {
      vm.filterProcessDefinition($scope.selectedFilters.selectedProcessVersion);
    });

    vm.updateProcessFilterList();
    vm.selectProcessIfDefined();
  }
})();
