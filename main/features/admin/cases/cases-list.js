(function caseListModuleDefinition() {
  'use strict';

  angular.module('org.bonita.features.admin.cases.list', ['org.bonita.common.resources', 'gettext', 'smart-table', 'ui.bootstrap', 'lrDragNDrop', 'org.bonita.common.resources.store', 'gettext'])
    .value('casesColumns', [
      {name: 'App name', sortName: 'name', path: ['processDefinitionId', 'name'], selected: true},
      {name: 'Version', sortName: 'version', path: ['processDefinitionId', 'version'], selected: true},
      {name: 'ID', sortName: 'id', path: ['id'], selected: true, align: 'right'},
      {name: 'Start date', sortName: 'startDate', path: ['start'], selected: true, date: true},
      {name: 'Started by', sortName: 'username', path: ['started_by', 'userName'], selected: true},
      {name: 'State', sortName: 'stateId', path: ['state'], selected: true}
    ])
    .value('pageSizes', [25, 50, 100, 200])
    .value('defaultPageSize', 25)
    .value('defaultSort', 'id')
    .value('defaultSelectedVersion', 'All versions')
    .value('defaultSelectedApp', 'All apps')
    .value('defaultDeployedFields', ['processDefinitionId', 'started_by', 'startedBySubstitute'])
    .controller('casesListCtrl', ['$scope', 'store', 'caseAPI', 'processAPI', 'casesColumns', 'defaultPageSize', 'defaultSort', 'defaultDeployedFields', '$location', 'pageSizes', 'defaultSelectedApp', 'defaultSelectedVersion', '$filter', '$modal',
      function casesListCtrlDefinition($scope, store, caseAPI, processAPI, casesColumns, defaultPageSize, defaultSort, defaultDeployedFields, $location, pageSizes, defaultSelectedApp, defaultSelectedVersion, $filter, $modal) {
        $scope.columns = casesColumns;
        $scope.pagination = {
          itemsPerPage : defaultPageSize,
          currentPage : 1,
          total : 0
        };
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
        $scope.reinitCases = function () {
          delete $scope.searchSort;
          $scope.pagination.currentPage = 1;
          $scope.searchForCases();
        };
        $scope.alerts = [];
        $scope.addAlert = function (msg) {
          $scope.alerts.push(msg);
        };

        $scope.closeAlert = function (index) {
          $scope.alerts.splice(index, 1);
        };
        //we cannot watch the updateFilter function directly otherwise
        //it will not be mockable
        $scope.$watch('selectedApp', function () {
          $scope.filterVersion($scope.selectedApp);
          delete $scope.selectedProcessDefinition;
          $scope.filters = $scope.buildFilters();
        });
        $scope.$watch('selectedVersion', function () {
          $scope.filterProcessDefinition($scope.selectedVersion);
          $scope.filters = $scope.buildFilters();
        });
        $scope.$watch('filters', function () {
          $scope.searchForCases();
        }, true);

        $scope.buildFilters = function () {
          var filters = [];
          if ($scope.selectedProcessDefinition) {
            filters.push('processDefinitionId=' + $scope.selectedProcessDefinition);
          } else if ($scope.selectedApp && $scope.selectedApp !== $scope.defaultSelectedApp) {
            filters.push('name=' + $scope.selectedApp);
          }
          return filters;
        };

        $scope.searchForCases = function casesSearch(tableState) {
          if (!$scope.searchSort || tableState) {
            $scope.searchSort = ((tableState && tableState.sort && tableState.sort.predicate) ?
              tableState.sort.predicate : defaultSort) + ' ' + ((tableState && tableState.sort && tableState.sort.reverse) ? 'DESC' : 'ASC');
            $scope.pagination.currentPage = 1;
          }

          var caseSearch = caseAPI.search({
            p: $scope.pagination.currentPage - 1,
            c: $scope.pagination.itemsPerPage,
            d: defaultDeployedFields,
            o: $scope.searchSort,
            f: $scope.filters
          });

          caseSearch.$promise.then(function mapCases(fullCases) {
            $scope.pagination.total = fullCases && fullCases.resource && fullCases.resource.pagination && fullCases.resource.pagination.total;
            $scope.currentFirstResultIndex = (($scope.pagination.currentPage - 1) * $scope.pagination.itemsPerPage) + 1;
            $scope.currentLastResultIndex = Math.min($scope.currentFirstResultIndex + $scope.pagination.itemsPerPage - 1, $scope.pagination.total);
            $scope.cases = fullCases && fullCases.resource && fullCases.resource.map(function selectOnlyInterestingFields(fullCase) {
              var simpleCase = {};
              for (var i = 0; i < $scope.columns.length; i++) {
                var currentName = fullCase;
                for (var j = 0; j < $scope.columns[i].path.length; j++) {
                  currentName = currentName && currentName[$scope.columns[i].path[j]];
                }
                simpleCase[$scope.columns[i].name] = currentName;
              }
              simpleCase.id = fullCase.id;
              return simpleCase;
            });
          }, function (error) {
            $scope.pagination.total = 0;
            $scope.currentFirstResultIndex = 0;
            $scope.currentLastResultIndex = 0;
            $scope.cases = [];
            displayError(error);
          });
        };

        function displayError(error) {
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
        }

        $scope.searchForCases();

        $scope.selectCase = function (caseItem) {
          if (caseItem) {
            caseItem.selected = caseItem && !caseItem.selected;
          }
        };

        $scope.selectApp = function (selectedAppName) {
          if (selectedAppName) {
            if (selectedAppName !== $scope.selectedApp) {
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
          if ($scope && $scope.versions && $scope.versions.length === 1) {
            $scope.selectedVersion = $scope.versions[0];
          }
        };

        $scope.filterProcessDefinition = function (selectedAppVersion) {
          if (selectedAppVersion && $scope.selectedApp && $scope.apps) {
            var matchingProcessDefs = $scope.apps.filter(function (app) {
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
            $scope.pagination.itemsPerPage = pageSize;
            $scope.pagination.currentPage = 1;
            $scope.searchForCases();
          }
        };
        $scope.formatContent = function (column, data) {
          if (column && column.date && data && typeof data === 'string') {
            //received date is in a non-standard format...
            // convert 2014-10-17 16:05:42.626 to ISO-8601 Format 2014-10-17T16:05:42.626Z
            return $filter('date')(data.replace(/ /, 'T'), 'yyyy-MM-dd HH:mm');
          }
          return data;
        };

        $scope.confirmDeleteSelectedCases = function () {
          if ($scope.cases) {
            var caseItems = $scope.cases.filter(function filterSelectedOnly(caseItem) {
              return caseItem && caseItem.selected;
            });
            $modal.open({
              templateUrl: 'features/admin/cases/cases-list-deletion-modal.html',
              controller: 'DeleteCaseModalCtrl',
              resolve: {
                caseItems: function () {
                  return caseItems;
                }
              },
              size: 'sm'
            }).result.then($scope.deleteSelectedCases);
          }
        };

        $scope.deleteSelectedCases = function () {
          if ($scope.cases) {
            var caseIds = $scope.cases.filter(function (caseItem) {
              return caseItem && caseItem.selected && caseItem.id;
            }).map(function (caseItem) {
              return caseItem.id;
            });
            var suppressedCase = 0;
            if (caseIds && caseIds.length) {
              //this function chains the case deletion
              var deletePromise = function (id) {
                var currentPromise = caseAPI.delete({id: id}).$promise.then(function() {
                  suppressedCase++;
                  /*for (var i = 0; i < $scope.cases.length; i++) {
                    if ($scope.cases[i] && $scope.cases[i].id === id) {
                      $scope.cases.splice(i, 1);
                    }
                  }*/
                }, displayError);
                if (caseIds && caseIds.length) {
                  var deleteNextId = function deleteNextId() {
                    deletePromise(caseIds.pop());
                  };
                  currentPromise.then(deleteNextId, deleteNextId);
                } else {
                  var relaunchSearch = function(){
                    $scope.searchForCases();
                  };
                  currentPromise.then(function () {
                    $scope.addAlert({type: 'success', status: suppressedCase + ' case(s) deleted successfully'});
                  }).then(relaunchSearch, relaunchSearch);
                }
              };
              deletePromise(caseIds.pop());
            }
          }
        };
        $scope.checkCaseIsNotSelected = function () {
          return $scope.cases && $scope.cases.reduce(function (previousResult, caseItem) {
              return previousResult && !caseItem.selected;
            }, true);
        };
      }])
    .controller('DeleteCaseModalCtrl', function ($scope, $modalInstance, caseItems) {

      $scope.caseItems = caseItems;

      $scope.ok = function () {
        $modalInstance.close();
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    })
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
