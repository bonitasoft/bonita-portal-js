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
    'org.bonitasoft.features.admin.cases.list.values',
    'gettext',
    'ui.bootstrap',
    'ui.router',
    'org.bonitasoft.common.resources.store'
  ])
  .controller('ActiveCaseFilterController', ['$scope', 'store', 'processAPI', 'defaultFilters', 'caseStatesValues', '$stateParams', CaseFilterController])
  .directive('activeCaseFilters', function () {
    return {
      restrict: 'E',
      require: '^ActiveCaseListCtrl',
      templateUrl: 'features/admin/cases/list/cases-list-filters.html',
      controller: 'ActiveCaseFilterController',
      controllerAs : 'filterCtrl'
    };
  })
  .controller('ArchivedCaseFilterController', ['$scope', 'store', 'processAPI', 'defaultFilters', 'caseStatesValues', '$stateParams', CaseFilterController])
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
   * @requires store
   * @requires processAPI
   * @requires defaultFilters
   * @requires caseStatesValues
   */
  /* jshint -W003 */
  function CaseFilterController($scope, store, processAPI, defaultFilters, caseStatesValues, $stateParams) {
    $scope.selectedFilters.selectedApp = [defaultFilters.appName, defaultFilters.appName];
    $scope.selectedFilters.selectedVersion = defaultFilters.appVersion;
    $scope.selectedFilters.selectedStatus = defaultFilters.caseStatus;
    $scope.defaultFilters = defaultFilters;
    $scope.caseStatesValues = caseStatesValues;
    if(angular.isDefined($stateParams.caseStateFilter) && !!$stateParams.caseStateFilter && angular.isDefined($scope.caseStatesValues[$stateParams.caseStateFilter])){
      $scope.selectedFilters.selectedStatus = $stateParams.caseStateFilter;
    }
    $scope.caseStatesValues[defaultFilters.caseStatus] = defaultFilters.caseStatus;
    $scope.apps = [];
    $scope.versions = [];
    $scope.appNames = [];
    $scope.allCasesSelected = false;
    $scope.selectedFilters.currentSearch = '';
    var vm = this;

    var processFilter = [];
    if ($scope.supervisorId) {
      processFilter.push('supervisor_id=' + $scope.supervisorId);
    }

    vm.initFilters = function(processes) {
      $scope.apps = processes;
      var appNamesArray = processes.map(function(process) {
        if ($scope.selectedFilters.processId && $scope.selectedFilters.processId === process.id) {
          $scope.selectedFilters.selectedApp = [process.name, process.displayName];
          vm.filterVersion($scope.selectedFilters.selectedApp[0], $scope.selectedFilters.selectedApp[1]);
          $scope.selectedFilters.selectedVersion = process.version;
        }
        return [process.name, process.displayName];
      });
      appNamesArray.forEach(function(process) {
        if (process && process[0] && process[1] && !isAppInArray(process, $scope.appNames)) {
          $scope.appNames.push(process);
        }
      });
    };

    function isAppInArray(app, array) {
      for (var i = 0; i < array.length; i++) {
        if(array[i][0] === app[0] && array[i][1] === app[1]) {
          return true;
        }
      }
      return false;
    }

    store.load(processAPI, {
      f: processFilter
    }).then(vm.initFilters);

    vm.selectApp = function(selectedAppName, selectedAppDisplayName) {
      if (selectedAppName && selectedAppDisplayName) {
        if (selectedAppName !== $scope.selectedFilters.selectedApp[0] || selectedAppDisplayName !== $scope.selectedFilters.selectedApp[1]) {
          $scope.selectedFilters.selectedApp = [selectedAppName, selectedAppDisplayName];
        }
        //selected App is the same than before, do nothing
      } else {
        $scope.selectedFilters.selectedApp = [defaultFilters.appName, defaultFilters.appName];
      }
    };

    vm.selectVersion = function(selectedAppVersion) {
      if (selectedAppVersion && selectedAppVersion !== defaultFilters.appVersion) {
        $scope.selectedFilters.selectedVersion = selectedAppVersion;
      } else {
        $scope.selectedFilters.selectedVersion = defaultFilters.appVersion;
      }
    };

    vm.selectCaseStatus = function(selectCaseStatus) {
      if (selectCaseStatus && selectCaseStatus !== defaultFilters.caseStatus) {
        $scope.selectedFilters.selectedStatus = selectCaseStatus;
      } else {
        $scope.selectedFilters.selectedStatus = defaultFilters.caseStatus;
      }
    };

    vm.filterVersion = function(appName, appDisplayName) {
      $scope.versions = [];
      $scope.selectedFilters.selectedVersion = defaultFilters.appVersion;
      if ($scope.apps && $scope.apps.filter) {
        $scope.versions = $scope.apps.filter(function(app) {
          return app && app.name === appName && app.displayName === appDisplayName && app.version;
        }).map(function(app) {
          return app.version;
        });
      }
      if ($scope && $scope.versions && $scope.versions.length === 1) {
        $scope.selectedFilters.selectedVersion = $scope.versions[0];
      }
    };

    vm.filterProcessDefinition = function(selectedAppVersion) {
      if (selectedAppVersion && $scope.selectedFilters.selectedApp && $scope.apps) {
        var matchingProcessDefs = $scope.apps.filter(function(app) {
          return app && app.name === $scope.selectedFilters.selectedApp[0] && app.displayName === $scope.selectedFilters.selectedApp[1] && selectedAppVersion === app.version;
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

    vm.submitSearch = function(){
      $scope.pagination.currentPage = 1;
      $scope.$emit('caselist:search');
    };
    //we cannot watch the updateFilter function directly otherwise
    //it will not be mockable
    $scope.$watch('selectedFilters.selectedApp', function() {
      if (!$scope.selectedFilters.processId) {
        vm.filterVersion($scope.selectedFilters.selectedApp[0], $scope.selectedFilters.selectedApp[1]);
        delete $scope.selectedFilters.selectedProcessDefinition;
      } else if ($scope.selectedFilters.selectedApp[0] !== defaultFilters.appName) {
        delete $scope.selectedFilters.processId;
      }
    });
    $scope.$watch('selectedFilters.selectedVersion', function() {
      vm.filterProcessDefinition($scope.selectedFilters.selectedVersion);
    });
  }
})();
