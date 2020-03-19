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

  angular.module('org.bonitasoft.features.admin.cases.list', [
    'ui.router',
    'org.bonitasoft.features.admin.cases.list.table',
    'ui.bootstrap',
    'gettext',
    'org.bonitasoft.common.i18n',
    'org.bonitasoft.services.topurl',
    'org.bonitasoft.features.admin.cases.list.values',
    'org.bonitasoft.common.directives.bonitaHref',
    'org.bonitasoft.service.applicationLink'
  ])
    .config(function($stateProvider) {
        $stateProvider.state('bonita.cases', {
          url: '/admin/cases/list?processId&supervisor_id&caseStateFilter',
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
            ],
            caseStateFilter: ['$stateParams',
              function($stateParams){
                return $stateParams.caseStateFilter;
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
    .controller('CaseCtrl', ['$scope', '$state', 'manageTopUrl', 'i18nService', 'ApplicationLink',
      function($scope, $state, manageTopUrl, i18nService, ApplicationLink) {
        //ui-sref-active seems to bug when the processId is passed
        //need to implement it ourselves...
        $scope.state = $state;
        $scope.currentToken = manageTopUrl.getCurrentPageToken();
        $scope.casesStates = [];
        $scope.casesStates.push({
          state: 'bonita.cases.active',
          title: i18nService.getKey('caselist.casesStates.active.title'),
          htmlAttributeId: 'TabActiveCases'
        });
        $scope.casesStates.push({
          state: 'bonita.cases.archived',
          title: i18nService.getKey('caselist.casesStates.archived.title'),
          tabName : 'archived',
          htmlAttributeId: 'TabArchivedCases'
        });
        $scope.isInApps = isInApps;
        $scope.getLinkToOtherState = getLinkToOtherState;

        function isInApps() {
          return ApplicationLink.isInApps;
        }

        function getLinkToOtherState(currentState) {
          if (currentState.tabName && currentState.tabName === 'archived') {
            return '#/admin/cases/list/archived';
          }
          return '#/admin/cases/list';
        }
      }
    ]);
})();
