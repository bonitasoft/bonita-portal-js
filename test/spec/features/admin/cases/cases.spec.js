/* global describe  */
(function () {
  'use strict';
  describe('admin cases list features', function () {

    var scope, state ;//= jasmine.createSpyObj('$stateProvider',['state']);

    describe('state provider for cases', function() {
      beforeEach(module('org.bonita.features.admin.cases', function($stateProvider) {
        $stateProvider.state('bonita', {});
      }));

      beforeEach(inject(function($state) {
        state = $state;
      }));
      it('should add a new state matching for the case main entry point', inject(function () {
        var caseListStateConfig = state.get('bonita.cases');
        expect(caseListStateConfig.url).toBe('/admin/cases/list?processId&supervisor_id');
        expect(caseListStateConfig.abstract).toBeTruthy();
        expect(caseListStateConfig.templateUrl).toBe('features/admin/cases/cases.html');
      }));
      it('should add a new state matching for the active case', inject(function () {
        var caseListStateConfig = state.get('bonita.cases.active');
        expect(caseListStateConfig.url).toBe('');
        expect(caseListStateConfig.abstract).toBeFalsy();
        expect(caseListStateConfig.views).toEqual({
          'case-list': {
            templateUrl: 'features/admin/cases/cases-list.html',
            controller: 'ActiveCaseListCtrl'
          }
        });
      }));
      it('should add a new state matching for the case main entry point', inject(function () {
        var caseListStateConfig = state.get('bonita.cases.archived');
        expect(caseListStateConfig.url).toBe('/archived');
        expect(caseListStateConfig.abstract).toBeFalsy();
        expect(caseListStateConfig.views).toEqual({
          'case-list': {
            templateUrl: 'features/admin/cases/archived-cases-list.html',
            controller: 'ArchivedCaseListCtrl'
          }
        });
      }));
    });
    describe('bonita.cases Controller', function() {
      var mockedState;
      beforeEach(module('org.bonita.features.admin.cases'));

      beforeEach(inject(function($rootScope, $controller){
        mockedState = jasmine.createSpyObj('$state', ['get', 'includes']);
        scope = $rootScope.$new();
        $controller('CaseCtrl', {
          '$scope' : scope,
          '$state' : mockedState
        });
      }));
      it('should init scope with state and cases tabs', function(){
        expect(scope.state).toBe(mockedState);
        expect(scope.casesStates ).toEqual([{state : 'bonita.cases.active', title: 'Active Cases', htmlAttributeId:'TabActiveCases'}, {state : 'bonita.cases.archived', title: 'Archived Cases', htmlAttributeId:'TabArchivedCases'}]);
      });
    });
  });
})();
