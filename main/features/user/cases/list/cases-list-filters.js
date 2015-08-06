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
  angular.module('org.bonitasoft.features.user.cases.list.filters', [
    'org.bonitasoft.common.resources',
    'org.bonitasoft.features.user.cases.list.values',
    'gettext',
    'ui.bootstrap',
    'ui.router',
    'org.bonitasoft.common.resources.store'
  ])
  .controller('ActiveCaseUserFilterController', ['$scope', 'store', 'processAPI', 'defaultUserFilters', 'caseStatesUserValues', '$stateParams', CaseFilterController])
  .directive('activeCaseUserFilters', function () {
    return {
      restrict: 'E',
      require: '^ActiveCaseListUserCtrl',
      templateUrl: 'features/user/cases/list/cases-list-filters.html',
      controller: 'ActiveCaseUserFilterController',
      controllerAs : 'filterUserCtrl'
    };
  })
  .controller('ArchivedCaseUserFilterController', ['$scope', 'store', 'processAPI', 'defaultUserFilters', 'caseStatesUserValues', '$stateParams', CaseFilterController])
  .directive('archivedCaseUserFilters', function() {
    return {
      restrict: 'E',
      require: '^ArchivedCaseListUserCtrl',
      templateUrl: 'features/user/cases/list/archived-cases-list-filters.html',
      controller: 'ArchivedCaseUserFilterController',
      controllerAs : 'filterUserCtrl'
    };
  });
  /**
   * @ngdoc object
   * @name o.b.f.user.cases.list.CaseFilterController
   * @description
   * This is a controller that manages the case search filters
   *
   * @requires $scope
   * @requires store
   * @requires processAPI
   * @requires defaultUserFilters
   * @requires caseStatesUserValues
   */
  /* jshint -W003 */
  function CaseFilterController($scope, store, processAPI, defaultUserFilters, caseStatesUserValues, $stateParams) {
    $scope.selectedFilters.selectedApp = defaultUserFilters.appName;
    $scope.selectedFilters.selectedVersion = defaultUserFilters.appVersion;
    $scope.selectedFilters.selectedStartedBy = defaultUserFilters.startedBy;
    $scope.defaultUserFilters = defaultUserFilters;
    $scope.caseStatesUserValues = caseStatesUserValues;
    if(angular.isDefined($stateParams.caseStateFilter) && !!$stateParams.caseStateFilter && angular.isDefined($scope.caseStatesUserValues[$stateParams.caseStateFilter])){
      $scope.selectedFilters.selectedStartedBy = $stateParams.caseStateFilter;
    }
    $scope.caseStatesUserValues[defaultUserFilters.startedBy] = defaultUserFilters.startedBy;
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
          $scope.selectedFilters.selectedApp = process.name;
          vm.filterVersion($scope.selectedFilters.selectedApp);
          $scope.selectedFilters.selectedVersion = process.version;
        }
        return process.name;
      });
      appNamesArray.forEach(function(processName) {
        if (processName && $.inArray(processName, $scope.appNames) < 0) {
          $scope.appNames.push(processName);
        }
      });
    };

    store.load(processAPI, {
      f: processFilter
    }).then(vm.initFilters);

    vm.selectApp = function(selectedAppName) {
      if (selectedAppName) {
        if (selectedAppName !== $scope.selectedFilters.selectedApp) {
          $scope.selectedFilters.selectedApp = selectedAppName;
        }
        //selected App is the same than before, do nothing
      } else {
        $scope.selectedFilters.selectedApp = defaultUserFilters.appName;
      }
    };

    vm.selectVersion = function(selectedAppVersion) {
      if (selectedAppVersion && selectedAppVersion !== defaultUserFilters.appVersion) {
        $scope.selectedFilters.selectedVersion = selectedAppVersion;
      } else {
        $scope.selectedFilters.selectedVersion = defaultUserFilters.appVersion;
      }
    };

    vm.selectCaseStartedBy = function(selectCaseStartedBy) {
      if (selectCaseStartedBy && selectCaseStartedBy !== defaultUserFilters.startedBy) {
        //Add filter on currently logged user
        $scope.selectedFilters.selectedStartedBy = 'Me';
      } else {
        $scope.selectedFilters.selectedStartedBy = defaultUserFilters.startedBy;
      }
    };

    vm.filterVersion = function(appName) {
      $scope.versions = [];
      $scope.selectedFilters.selectedVersion = defaultUserFilters.appVersion;
      if ($scope.apps && $scope.apps.filter) {
        $scope.versions = $scope.apps.filter(function(app) {
          return app && app.name === appName && app.version;
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
          return app && app.name === $scope.selectedFilters.selectedApp && selectedAppVersion === app.version;
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
        vm.filterVersion($scope.selectedFilters.selectedApp);
        delete $scope.selectedFilters.selectedProcessDefinition;
      } else if ($scope.selectedFilters.selectedApp !== defaultUserFilters.appName) {
        delete $scope.selectedFilters.processId;
      }
    });
    $scope.$watch('selectedFilters.selectedVersion', function() {
      vm.filterProcessDefinition($scope.selectedFilters.selectedVersion);
    });
  }
})();
