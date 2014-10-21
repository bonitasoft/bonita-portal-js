(function caseListModuleDefinition() {
  'use strict';

  angular.module('org.bonita.features.admin.cases.list', ['org.bonita.common.resources', 'gettext', 'smart-table', 'ui.bootstrap', 'lrDragNDrop', 'org.bonita.common.resources.store'])
    .value('casesColumns', [
      {name: 'AppName', sortName: 'name', path: ['processDefinitionId', 'name'], selected: true },
      {name: 'Version', sortName: 'version', path: ['processDefinitionId', 'version'], selected: true},
      {name: 'CaseId', sortName: 'id', path: ['id'], selected: true},
      {name: 'StartDate', sortName: 'startDate', path: ['start'], selected: true},
      {name: 'StartedByFirstname', sortName: 'firstname', path: ['started_by', 'firstname'], selected: true},
      {name: 'StartedByLastname', sortName: 'lastname', path: ['started_by', 'lastname'], selected: true},
      {name: 'CurrentState', sortName: 'state', path: ['state'], selected: true}
    ])
    .value('pageSizes', [2, 10, 25, 50])
    .value('defaultPageSize', 2)
    .value('defaultSort', 'id')
    .value('defaultSelectedVersion', 'All Versions')
    .value('defaultSelectedApp', 'All Apps')
    .value('defaultDeployedFields', ['processDefinitionId', 'started_by', 'startedBySubstitute'])
    .controller('casesListCtrl', ['$scope', 'store', 'caseAPI', 'processAPI', 'casesColumns', 'defaultPageSize', 'defaultSort', 'defaultDeployedFields', '$location', 'pageSizes', 'defaultSelectedApp', 'defaultSelectedVersion',
      function casesListCtrlDefinition($scope, store, caseAPI, processAPI, casesColumns, defaultPageSize, defaultSort, defaultDeployedFields, $location, pageSizes, defaultSelectedApp, defaultSelectedVersion) {
        $scope.columns = casesColumns;
        $scope.itemsPerPage = defaultPageSize;
        $scope.currentPage = 1;
        $scope.total = 0;
        $scope.pageSizes = pageSizes;
        $scope.selectedApp = defaultSelectedApp;
        $scope.selectedVersion = defaultSelectedVersion;
        $scope.defaultSelectedApp = defaultSelectedApp;
        $scope.defaultSelectedVersion = defaultSelectedVersion;
        $scope.apps = [];
        $scope.versions = [];
        $scope.appNames = [];
        $scope.filters = [];

        store.load(processAPI, {}).then(function (processes) {
          $scope.apps = processes;
          var appNamesArray = processes.map(function (process) {
            return process.name;
          });
          appNamesArray.forEach(function (processName) {
            if (processName && $.inArray(processName, $scope.appNames) <= 0) {
              $scope.appNames.push(processName);
            }
          });
        });

        $scope.alerts = [];
        $scope.addAlert = function (msg) {
          $scope.alerts.push(msg);
        };

        $scope.closeAlert = function (index) {
          $scope.alerts.splice(index, 1);
        };

        $scope.getSortNameByPredicate = function getSortNameByPredicate(predicate) {
          if ($scope.columns) {
            var sortColumns = $scope.columns.filter(function findColumn(column) {
              return column && column.name === predicate;
            });
            return (sortColumns && sortColumns.length) ? sortColumns[0].sortName : undefined;
          }
        };

        //we cannot watch the updateFilter function directly otherwise
        //it will not be mockable
        $scope.$watch('selectedApp', function(){
          $scope.filterVersion($scope.selectedApp);
          delete $scope.selectedProcessDefinition;
          $scope.filters = $scope.buildFilters();
        });
        $scope.$watch('selectedVersion', function(){
          $scope.filterProcessDefinition($scope.selectedVersion);
          $scope.filters = $scope.buildFilters();
        });
        $scope.$watch('filters', function(){
          $scope.searchForCases();
        }, true);

        $scope.buildFilters = function(){
          var filters = [];
          if($scope.selectedProcessDefinition){
            filters.push('processDefinitionId=' + $scope.selectedProcessDefinition);
          }else if ($scope.selectedApp && $scope.selectedApp !== $scope.defaultSelectedApp) {
            filters.push('name=' + $scope.selectedApp);
          }
          return filters;
        };

        $scope.searchForCases = function casesSearch(tableState) {
          if (!$scope.searchSort || tableState) {
            $scope.searchSort = ((tableState && tableState.sort && tableState.sort.predicate) ?
              $scope.getSortNameByPredicate(tableState.sort.predicate) : defaultSort) + ' ' + ((tableState && tableState.sort && tableState.sort.reverse) ? 'DESC' : 'ASC');
            $scope.currentPage = 1;
          }

          var caseSearch = caseAPI.search({
            p: $scope.currentPage - 1,
            c: $scope.itemsPerPage,
            d: defaultDeployedFields,
            o: $scope.searchSort,
            f: $scope.filters
          });

          caseSearch.$promise.then(function mapCases(fullCases) {
            $scope.total = fullCases && fullCases.resource && fullCases.resource.pagination && fullCases.resource.pagination.total;
            $scope.currentFirstResultIndex = (($scope.currentPage - 1) * $scope.itemsPerPage) + 1;
            $scope.currentLastResultIndex = Math.min($scope.currentFirstResultIndex + $scope.itemsPerPage - 1, $scope.total);
            $scope.cases = fullCases && fullCases.resource && fullCases.resource.map(function selectOnlyInterestingFields(fullCase) {
              var simpleCase = {};
              for (var i = 0; i < $scope.columns.length; i++) {
                var currentName = fullCase;
                for (var j = 0; j < $scope.columns[i].path.length; j++) {
                  currentName = currentName && currentName[$scope.columns[i].path[j]];
                }
                simpleCase[$scope.columns[i].name] = currentName;
              }
              return simpleCase;
            });
          }, function displayError(error) {
            $scope.total = 0;
            $scope.currentFirstResultIndex = 0;
            $scope.currentLastResultIndex = 0;
            $scope.cases = [];
            if (error) {
              if (error.status === 401) {
                $location.url('/');
              } else {
                var message = {status: error.status, statusText: error.statusText, type: 'danger'};
                if (error.data) {
                  message.errorMsg = error.data.message;
                  message.resource = error.data.api + '/' + error.data.resource;
                }
                $scope.addAlert(message);
              }
            }
          });
        };
        $scope.searchForCases();

        $scope.selectCase = function (caseItem) {
          if (caseItem) {
            caseItem.selected = caseItem && !caseItem.selected;
          }
        };

        $scope.selectApp = function (selectedAppName) {
          if (selectedAppName) {
            if(selectedAppName !== $scope.selectedApp){
              $scope.selectedApp = selectedAppName;
            }
            //selected App is the same than before, do nothing
          } else {
            $scope.selectedApp = $scope.defaultSelectedApp;
          }
        };

        $scope.selectVersion = function (selectedAppVersion) {
          if (selectedAppVersion && selectedAppVersion !== $scope.defaultSelectedVersion) {
            $scope.selectedVersion = selectedAppVersion;
          } else {
            $scope.selectedVersion = $scope.defaultSelectedVersion;
          }
        };

        $scope.filterVersion = function (appName) {
          $scope.versions = [];
          $scope.selectedVersion = $scope.defaultSelectedVersion;
          if ($scope.apps && $scope.apps.filter) {
            $scope.versions = $scope.apps.filter(function (app) {
              return app && app.name === appName && app.version;
            }).map(function (app) {
              return app.version;
            });
          }
          if($scope && $scope.versions && $scope.versions.length === 1){
            $scope.selectedVersion = $scope.versions[0];
          }
        };

        $scope.filterProcessDefinition = function(selectedAppVersion){
          if(selectedAppVersion && $scope.selectedApp && $scope.apps){
            var matchingProcessDefs = $scope.apps.filter(function(app){
              return app && app.name === $scope.selectedApp && selectedAppVersion === app.version;
            });
            if(matchingProcessDefs && matchingProcessDefs.length){
              $scope.selectedProcessDefinition = matchingProcessDefs[0] && matchingProcessDefs[0].id;
            }else{
              delete $scope.selectedProcessDefinition;
            }
          } else {
            delete $scope.selectedProcessDefinition;
          }
        };

        $scope.selectColumn = function (column) {
          if (column) {
            column.selected = !column.selected;
          }
        };

        $scope.filterColumn = function (column) {
          return column && column.selected;
        };

        $scope.changeItemPerPage = function (pageSize) {
          if (pageSize) {
            $scope.itemsPerPage = pageSize;
            $scope.currentPage = 1;
            $scope.searchForCases();
          }
        };
      }])
    .directive('resizableColumn', ['$timeout', '$interval', function ($timeout) {
      return {
        restrict: 'A',
        link: function (scope, $el) {
          var resizeColumn = function () {
            $timeout(function () {
              var data = $el.data('resizableColumns');
              if (data) {
                data.destroy();
              }
              $el.resizableColumns({selector: 'tr th'});
            }, 0);
          };
          scope.$watch('columns', resizeColumn, true);
        }
      };
    }]);
})();
