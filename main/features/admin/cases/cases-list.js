(function caseListModuleDefinition() {
  'use strict';

  angular.module('org.bonita.features.admin.cases.list', ['org.bonita.common.resources', 'gettext', 'smart-table'])
    .value('casesColumns', [
      {name: 'AppName', sortName: 'name', path: ['processDefinitionId', 'name'] },
      {name: 'Version', sortName: 'version', path: ['processDefinitionId', 'version']},
      {name: 'CaseId', sortName: 'id', path: ['id']},
      {name: 'StartDate', sortName: 'startDate', path: ['start']},
      {name: 'StartedByFirstname', sortName: 'firstname', path: ['started_by', 'firstname']},
      {name: 'StartedByLastname', sortName: 'lastname', path: ['started_by', 'lastname']},
      {name: 'CurrentState', sortName: 'state', path: ['state']}
    ])
    .value('defaultPageSize', 50)
    .value('defaultSort', 'id')
    .value('defaultDeployedFields', ['processDefinitionId', 'started_by', 'startedBySubstitute'])
    .controller('casesListCtrl', ['$scope', 'caseAPI', 'casesColumns', 'defaultPageSize', 'defaultSort', 'defaultDeployedFields',
      function casesListCtrlDefinition($scope, caseAPI, casesColumns, defaultPageSize, defaultSort, defaultDeployedFields) {
        $scope.columns = casesColumns;

        $scope.getSortNameByPredicate = function getSortNameByPredicate(predicate) {
          if ($scope.columns) {
            var sortColumns = $scope.columns.filter(function findColumn(column) {
              return column && column.name === predicate;
            });
            return (sortColumns && sortColumns.length) ? sortColumns[0].sortName : undefined;
          }
        };
        $scope.searchForCases = function casesSearch(tableState) {
          caseAPI.search({
            p: 0,
            c: defaultPageSize,
            d: defaultDeployedFields,
            o: ((tableState && tableState.sort && tableState.sort.predicate) ? $scope.getSortNameByPredicate(tableState.sort.predicate) : defaultSort) + ' ' + ((tableState && tableState.sort && tableState.sort.reverse) ? 'DESC' : 'ASC')
          }).$promise.then(function mapCases(fullCases) {
              $scope.cases = fullCases && fullCases.data && fullCases.data.map(function selectOnlyInterestingFields(fullCase) {
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
              //$scope.cases = $filter('orderBy')($scope.cases, tableState.sort.predicate, tableState.sort.reverse);
            });
        };
        $scope.searchForCases();
      }]);
})();
