(function() {
  'use strict';
  angular.module('org.bonita.features.admin.cases.list.filters', [
    'org.bonita.common.resources',
    'org.bonita.features.admin.cases.list.values',
    'gettext',
    'ui.bootstrap',
    'ui.router',
    'org.bonita.common.resources.store'
  ])
  .controller('ActiveCaseFilterController', ['$scope', 'store', 'processAPI', 'defaultFilters', 'caseStatesValues', 'activedTabName', CaseFilterController])
  .directive('activeCaseFilters', function () {
    return {
      restrict: 'E',
      require: '^ActiveCaseListCtrl',
      templateUrl: 'features/admin/cases/list/cases-list-filters.html',
      controller: 'ActiveCaseFilterController',
      controllerAs : 'filterCtrl'
    };
  })
  .controller('ArchivedCaseFilterController', ['$scope', 'store', 'processAPI', 'defaultFilters', 'caseStatesValues', CaseFilterController])
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
  function CaseFilterController($scope, store, processAPI, defaultFilters, caseStatesValues) {
    $scope.selectedFilters.selectedApp = defaultFilters.appName;
    $scope.selectedFilters.selectedVersion = defaultFilters.appVersion;
    $scope.selectedFilters.selectedStatus = defaultFilters.caseStatus;
    $scope.defaultFilters = defaultFilters;
    $scope.caseStatesValues = caseStatesValues;
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
        $scope.selectedFilters.selectedApp = defaultFilters.appName;
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

    vm.filterVersion = function(appName) {
      $scope.versions = [];
      $scope.selectedFilters.selectedVersion = defaultFilters.appVersion;
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
      } else if ($scope.selectedFilters.selectedApp !== defaultFilters.appName) {
        delete $scope.selectedFilters.processId;
      }
    });
    $scope.$watch('selectedFilters.selectedVersion', function() {
      vm.filterProcessDefinition($scope.selectedFilters.selectedVersion);
    });
  }
})();
