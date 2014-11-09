(function () {
  'use strict';

  angular.module('org.bonita.features.admin.cases', ['ui.router', 'org.bonita.features.admin.cases.list', 'ui.bootstrap', 'gettext'])
    .config([ '$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.when('/pm/cases/list?processId&supervisor_id', '/admin/cases/list?processId&supervisor_id');
      $stateProvider.state('bonita.cases', {
        url: '/admin/cases/list?processId&supervisor_id',
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
        },
        resolve:{
          supervisorId: ['$stateParams', function($stateParams){
              return $stateParams.supervisor_id;
          }],
          processId: ['$stateParams', function($stateParams){
              return $stateParams.processId;
          }]
        }
      }).state('bonita.cases.archived', {
        url: '/archived',
        views : {
          'case-list' : {
            templateUrl: 'features/admin/cases/archived-cases-list.html',
            controller: 'ArchivedCaseListCtrl'
          }
        },
        resolve:{
          supervisorId: ['$stateParams', function($stateParams){
              return $stateParams.supervisor_id;
          }],
          processId: ['$stateParams', function($stateParams){
              return $stateParams.processId;
          }]
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
