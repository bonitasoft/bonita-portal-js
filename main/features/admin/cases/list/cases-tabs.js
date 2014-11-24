/* jshint sub:true */
(function() {
  'use strict';

  angular.module('org.bonita.features.admin.cases.list', ['ui.router', 'org.bonita.features.admin.cases.list.table', 'ui.bootstrap', 'gettext', 'org.bonita.services.topurl'])
    .config(['$stateProvider', '$urlRouterProvider',
      function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('/pm/cases/list?processId&supervisor_id', '/admin/cases/list?processId&supervisor_id');
        $urlRouterProvider.when('/pm/cases/list/archived?processId&supervisor_id', '/admin/cases/list/archived?processId&supervisor_id');
        $stateProvider.state('bonita.cases', {
          url: '/admin/cases/list?processId&supervisor_id',
          templateUrl: 'features/admin/cases/list/cases.html',
          abstract: true,
          controller: 'CaseCtrl'
        }).state('bonita.cases.active', {
          url: '',
          views: {
            'case-list': {
              templateUrl: 'features/admin/cases/list/cases-list.html',
              controller: 'ActiveCaseListCtrl'
            }
          },
          resolve: {
            supervisorId: ['$stateParams',
              function($stateParams) {
                return $stateParams['supervisor_id'];
              }
            ],
            processId: ['$stateParams',
              function($stateParams){
                return $stateParams.processId;
              }
            ]
          }
        }).state('bonita.cases.archived', {
          url: '/archived',
          views: {
            'case-list': {
              templateUrl: 'features/admin/cases/list/cases-list.html',
              controller: 'ArchivedCaseListCtrl'
            }
          },
          resolve: {
            supervisorId: ['$stateParams',
              function($stateParams) {
                return $stateParams['supervisor_id'];
              }
            ],
            processId: ['$stateParams',
              function($stateParams){
                return $stateParams.processId;
              }
            ]
          }
        });
      }
    ])
    .controller('CaseCtrl', ['$scope',
      function($scope) {
        $scope.casesStates = [];
        $scope.casesStates.push({
          state: 'bonita.cases.active',
          title: 'Active',
          htmlAttributeId: 'TabActiveCases'
        });
        $scope.casesStates.push({
          state: 'bonita.cases.archived',
          title: 'Archived',
          htmlAttributeId: 'TabArchivedCases'
        });
      }
    ]);
})();
