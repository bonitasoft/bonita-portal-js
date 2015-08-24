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

/* global describe  */
(function() {
  'use strict';
  describe('user cases list features', function() {

    var scope, state;

    describe('state provider for cases', function() {
      beforeEach(module('org.bonitasoft.features.user.cases.list', function($stateProvider) {
        $stateProvider.state('bonita', {});
      }));

      beforeEach(inject(function($state) {
        state = $state;
      }));
      it('should add a new state matching the case main entry point', inject(function() {
        var caseListStateConfig = state.get('bonita.userCases');
        expect(caseListStateConfig.url).toBe('/user/cases/list?processId&caseStateFilter');
        expect(caseListStateConfig.abstract).toBeTruthy();
        expect(caseListStateConfig.templateUrl).toBe('features/user/cases/list/cases.html');
      }));
      it('should add a new state matching the active cases', inject(function() {
        var caseListStateConfig = state.get('bonita.userCases.active');
        expect(caseListStateConfig.url).toBe('');
        expect(caseListStateConfig.abstract).toBeFalsy();
        expect(caseListStateConfig.views).toEqual({
          'case-list': {
            templateUrl: 'features/user/cases/list/cases-list.html',
            controller: 'ActiveCaseListUserCtrl',
            controllerAs: 'caseUserCtrl'
          }
        });
      }));
      it('should add a new state matching the archive cases', inject(function() {
        var caseListStateConfig = state.get('bonita.userCases.archived');
        expect(caseListStateConfig.url).toBe('/archived');
        expect(caseListStateConfig.abstract).toBeFalsy();
        expect(caseListStateConfig.views).toEqual({
          'case-list': {
            templateUrl: 'features/user/cases/list/cases-list.html',
            controller: 'ArchivedCaseListUserCtrl',
            controllerAs: 'caseUserCtrl'
          }
        });
      }));
    });
    describe('bonita.cases controller', function()  {
      beforeEach(module('org.bonitasoft.features.user.cases'));
      beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        $controller('CaseUserCtrl',
        {
          '$scope' : scope
        });
      }));
      it('should init scope with state and cases tabs', function() {
        expect(scope.casesStates).toEqual([{
          state: 'bonita.userCases.active',
          title: 'Open cases',
          htmlAttributeId: 'TabActiveCases'
        }, {
          state: 'bonita.userCases.archived',
          title: 'Archived cases',
          tabName : 'archived',
          htmlAttributeId: 'TabArchivedCases'
        }]);
        expect(scope.state.is).toBeDefined();
      });
    });
  });
})();
