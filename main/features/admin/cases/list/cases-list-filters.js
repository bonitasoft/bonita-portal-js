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
      controller: 'ActiveCaseFilterController'
    };
  })
  .controller('ArchivedCaseFilterController', ['$scope', 'store', 'processAPI', 'defaultFilters', 'caseStatesValues', CaseFilterController])
  .directive('archivedCaseFilters', function() {
    return {
      restrict: 'E',
      require: '^ArchivedCaseListCtrl',
      templateUrl: 'features/admin/cases/list/archived-cases-list-filters.html',
      controller: 'ArchivedCaseFilterController'
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
    $scope.selectedApp = defaultFilters.appName;
    $scope.selectedVersion = defaultFilters.appVersion;
    $scope.selectedStatus = defaultFilters.caseStatus;
    $scope.defaultFilters = defaultFilters;
    $scope.caseStatesValues = caseStatesValues;
    $scope.caseStatesValues[defaultFilters.caseStatus] = defaultFilters.caseStatus;
    $scope.apps = [];
    $scope.versions = [];
    $scope.appNames = [];
    $scope.allCasesSelected = false;

    var processFilter = [];
    if ($scope.supervisorId) {
      processFilter.push('supervisor_id=' + $scope.supervisorId);
    }
    store.load(processAPI, {
      f: processFilter
    }).then(function(processes) {
      $scope.apps = processes;
      var appNamesArray = processes.map(function(process) {
        if ($scope.processId && $scope.processId === process.id) {
          $scope.selectedApp = process.name;
          $scope.selectedVersion = process.version;
        }
        return process.name;
      });
      appNamesArray.forEach(function(processName) {
        if (processName && $.inArray(processName, $scope.appNames) <= 0) {
          $scope.appNames.push(processName);
        }
      });
    });

    $scope.selectApp = function(selectedAppName) {
      if (selectedAppName) {
        if (selectedAppName !== $scope.selectedApp) {
          $scope.selectedApp = selectedAppName;
        }
        //selected App is the same than before, do nothing
      } else {
        $scope.selectedApp = defaultFilters.appName;
      }
    };

    $scope.selectVersion = function(selectedAppVersion) {
      if (selectedAppVersion && selectedAppVersion !== defaultFilters.appVersion) {
        $scope.selectedVersion = selectedAppVersion;
      } else {
        $scope.selectedVersion = defaultFilters.appVersion;
      }
    };

    $scope.selectCaseStatus = function(selectCaseStatus) {
      if (selectCaseStatus && selectCaseStatus !== defaultFilters.caseStatus) {
        $scope.selectedStatus = selectCaseStatus;
      } else {
        $scope.selectedStatus = defaultFilters.caseStatus;
      }
    };

    $scope.filterVersion = function(appName) {
      $scope.versions = [];
      $scope.selectedVersion = defaultFilters.appVersion;
      if ($scope.apps && $scope.apps.filter) {
        $scope.versions = $scope.apps.filter(function(app) {
          return app && app.name === appName && app.version;
        }).map(function(app) {
          return app.version;
        });
      }
      if ($scope && $scope.versions && $scope.versions.length === 1) {
        $scope.selectedVersion = $scope.versions[0];
      }
    };

    $scope.filterProcessDefinition = function(selectedAppVersion) {
      if (selectedAppVersion && $scope.selectedApp && $scope.apps) {
        var matchingProcessDefs = $scope.apps.filter(function(app) {
          return app && app.name === $scope.selectedApp && selectedAppVersion === app.version;
        });
        if (matchingProcessDefs && matchingProcessDefs.length) {
          $scope.selectedProcessDefinition = matchingProcessDefs[0] && matchingProcessDefs[0].id;
        } else {
          delete $scope.selectedProcessDefinition;
        }
      } else {
        delete $scope.selectedProcessDefinition;
      }
    };
    //we cannot watch the updateFilter function directly otherwise
    //it will not be mockable
    $scope.$watch('selectedApp', function() {
      if (!$scope.processId) {
        $scope.filterVersion($scope.selectedApp);
        delete $scope.selectedProcessDefinition;
        $scope.buildFilters();
      } else if ($scope.selectedApp !== defaultFilters.appName) {
        delete $scope.processId;
      }
    });
    $scope.$watch('selectedVersion', function() {
      $scope.filterProcessDefinition($scope.selectedVersion);
      $scope.buildFilters();
    });
    $scope.$watch('selectedStatus', function() {
      $scope.buildFilters();
    });
  }
})();
