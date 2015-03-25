/* jshint sub:true */
(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.cases.list', [
    'ui.router',
    'org.bonitasoft.features.admin.cases.list.table',
    'ui.bootstrap',
    'gettext',
    'org.bonitasoft.services.topurl',
    'org.bonitasoft.features.admin.cases.list.values',
    'org.bonitasoft.common.directives.bonitaHref'
  ])
    .config(function($stateProvider) {
        $stateProvider.state('bonita.cases', {
          url: '/admin/cases/list?processId&supervisor_id',
          templateUrl: 'features/admin/cases/list/cases.html',
          abstract: true,
          controller: 'CaseCtrl',
          controllerAs: 'caseCtrl'
        }).state('bonita.cases.active', {
          url: '',
          views: {
            'case-list': {
              templateUrl: 'features/admin/cases/list/cases-list.html',
              controller: 'ActiveCaseListCtrl',
              controllerAs : 'caseCtrl'
            }
          },
          resolve: {
            tabName : ['activedTabName',
              function(tabName){
                return tabName;
              }
            ],
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
              controller: 'ArchivedCaseListCtrl',
              controllerAs : 'caseCtrl'
            }
          },
          resolve: {
            tabName : ['archivedTabName',
              function(tabName){
                return tabName;
              }
            ],
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
    )
    .controller('CaseCtrl', ['$scope', '$state', 'manageTopUrl',
      function($scope, $state, manageTopUrl) {
        //ui-sref-active seems to bug when the processId is passed
        //need to implement it ourselves...
        $scope.state = $state;
        $scope.currentToken = manageTopUrl.getCurrentPageToken();
        $scope.casesStates = [];
        $scope.casesStates.push({
          state: 'bonita.cases.active',
          title: 'Open cases',
          htmlAttributeId: 'TabActiveCases'
        });
        $scope.casesStates.push({
          state: 'bonita.cases.archived',
          title: 'Archived cases',
          tabName : 'archived',
          htmlAttributeId: 'TabArchivedCases'
        });
      }
    ]);
})();
