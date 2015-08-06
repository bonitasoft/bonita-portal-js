/** Copyright (C) 2015 Bonitasoft S.A.
 * BonitaSoft, 31 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/* jshint sub:true */
(function() {
  'use strict';

  angular.module('org.bonitasoft.features.user.cases.list', [
    'ui.router',
    'org.bonitasoft.features.user.cases.list.table',
    'ui.bootstrap',
    'gettext',
    'org.bonitasoft.services.topurl',
    'org.bonitasoft.features.user.cases.list.values',
    'org.bonitasoft.common.directives.bonitaHref'
  ])
    .config(function($stateProvider) {
        $stateProvider.state('bonita.userCases', {
          url: '/user/cases/list?processId&caseStateFilter',
          templateUrl: 'features/user/cases/list/cases.html',
          abstract: true,
          controller: 'CaseUserCtrl',
          controllerAs: 'caseUserCtrl'
        }).state('bonita.userCases.active', {
          url: '',
          views: {
            'case-list': {
              templateUrl: 'features/user/cases/list/cases-list.html',
              controller: 'ActiveCaseListUserCtrl',
              controllerAs : 'caseUserCtrl'
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
            ],
            caseStateFilter: ['$stateParams',
              function($stateParams){
                return $stateParams.caseStateFilter;
              }
            ]
          }
        }).state('bonita.userCases.archived', {
          url: '/archived',
          views: {
            'case-list': {
              templateUrl: 'features/user/cases/list/cases-list.html',
              controller: 'ArchivedCaseListUserCtrl',
              controllerAs : 'caseUserCtrl'
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
            ],
            caseStateFilter: ['$stateParams',
              function($stateParams){
                return $stateParams.caseStateFilter;
              }
            ]
          }
        });
      }
    )
    .controller('CaseUserCtrl', ['$scope', '$state', 'manageTopUrl',
      function($scope, $state, manageTopUrl) {
        //ui-sref-active seems to bug when the processId is passed
        //need to implement it ourselves...
        $scope.state = $state;
        $scope.currentToken = manageTopUrl.getCurrentPageToken();
        $scope.casesStates = [];
        $scope.casesStates.push({
          state: 'bonita.userCases.active',
          title: 'Open cases',
          htmlAttributeId: 'TabActiveCases'
        });
        $scope.casesStates.push({
          state: 'bonita.userCases.archived',
          title: 'Archived cases',
          tabName : 'archived',
          htmlAttributeId: 'TabArchivedCases'
        });
      }
    ]);
})();
