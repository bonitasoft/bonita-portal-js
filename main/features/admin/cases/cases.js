(function () {
  'use strict';

  angular.module('org.bonita.features.admin.cases', ['ui.router', 'org.bonita.features.admin.cases.list', 'ui.bootstrap', 'gettext'])
    .config([ '$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.when('/admin/cases/list/', '/admin/cases/list');
      $stateProvider.state('bonita.cases', {
        url: '/admin/cases/list',
        templateUrl: 'features/admin/cases/cases.html',
        abstract : true,
        controller: 'CaseCtrl'
      }).state('bonita.cases.active', {
        url: '',
        views : {
          'case-list' : {
            templateUrl: 'features/admin/cases/cases-list.html',
            controller: 'ActiveCaseListCtrl'
          }
        }
      }).state('bonita.cases.archived', {
        url: '/archived',
        views : {
          'case-list' : {
            templateUrl: 'features/admin/cases/archived-cases-list.html',
            controller: 'ArchivedCaseListCtrl'
          }
        }
      });
    }])
    .controller('CaseCtrl', ['$scope', '$state', function($scope, $state){
      $scope.casesStates = [];
      $scope.casesStates.push({state : 'bonita.cases.active', title: 'Active Cases', htmlAttributeId:'TabActiveCases'});
      $scope.casesStates.push({state : 'bonita.cases.archived', title: 'Archived Cases', htmlAttributeId:'TabArchivedCases'});
      $scope.state = $state;
    }]);
})();
