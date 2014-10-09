(function caseListModuleDefinition() {
    'use strict';

    angular.module('org.bonita.features.admin.cases.list', ['org.bonita.common.resources', 'gettext'])
    .controller('casesListCtrl',['$scope', 'caseAPI',  function casesListCtrlDefinition($scope, caseAPI){
        $scope.columns = ['App Name', 'Version', 'Case Id', 'Start Date', 'Started By', 'Current State'];
        $scope.cases = [];
        caseAPI.search({
            p: 0,
            c: 50,
            d:['processDefinitionId', 'started_by','startedBySubstitute']
          }).$promise.then(function mapCases(fullCases){
            $scope.cases = fullCases && fullCases.data && fullCases.data.map(function selectOnlyInterestingFields (fullCase){
              var simpleCase = {};
              simpleCase[$scope.columns[0]] = fullCase && fullCase.processDefinitionId && fullCase.processDefinitionId.name;
              simpleCase[$scope.columns[1]] = fullCase && fullCase.processDefinitionId && fullCase.processDefinitionId.version;
              simpleCase[$scope.columns[2]] = fullCase && fullCase.id;
              simpleCase[$scope.columns[3]] = fullCase && fullCase.start;
              simpleCase[$scope.columns[4]] = fullCase && fullCase.started_by && ( fullCase.started_by.firstname + ' ' + fullCase.started_by.lastname );
              simpleCase[$scope.columns[5]] = fullCase && fullCase.state;
              return simpleCase;
            });
          });
      }]);
  })();