/* global describe  */
(function () {
  'use strict';
  describe('admin cases list features', function () {

    var scope, state ;//= jasmine.createSpyObj('$stateProvider',['state']);

    describe('state provider for cases', function() {
      beforeEach(module('org.bonita.features.admin.cases.list', function($stateProvider) {
        $stateProvider.state('bonita', {});
      }));

      beforeEach(inject(function($state) {
        state = $state;
      }));
      it('should add a new state matching the case main entry point', inject(function () {
        var caseListStateConfig = state.get('bonita.cases');
        expect(caseListStateConfig.url).toBe('/admin/cases/list?processId&supervisor_id');
        expect(caseListStateConfig.abstract).toBeTruthy();
        expect(caseListStateConfig.templateUrl).toBe('features/admin/cases/list/cases.html');
      }));
      it('should add a new state matching the active cases', inject(function () {
        var caseListStateConfig = state.get('bonita.cases.active');
        expect(caseListStateConfig.url).toBe('');
        expect(caseListStateConfig.abstract).toBeFalsy();
        expect(caseListStateConfig.views).toEqual({
          'case-list': {
            templateUrl: 'features/admin/cases/list/cases-list.html',
            controller: 'ActiveCaseListCtrl',
            controllerAs : 'caseCtrl'
          }
        });
      }));
      it('should add a new state matching the archive cases', inject(function () {
        var caseListStateConfig = state.get('bonita.cases.archived');
        expect(caseListStateConfig.url).toBe('/archived');
        expect(caseListStateConfig.abstract).toBeFalsy();
        expect(caseListStateConfig.views).toEqual({
          'case-list': {
            templateUrl: 'features/admin/cases/list/cases-list.html',
            controller: 'ArchivedCaseListCtrl',
            controllerAs : 'caseCtrl'
          }
        });
      }));
    });
    describe('bonita.cases Controller', function() {
      beforeEach(module('org.bonita.features.admin.cases'));
      var caseCtrl, mockedManageTopUrl;
      beforeEach(inject(function($rootScope, $controller){
        scope = $rootScope.$new();
        mockedManageTopUrl = jasmine.createSpyObj('manageTopUrl', ['goTo', 'getCurrentPageToken']);
        caseCtrl = $controller('CaseCtrl', {
          '$scope' : scope,
          'manageTopUrl' : mockedManageTopUrl
        });
        mockedManageTopUrl.getCurrentPageToken.and.returnValue('caselistingadmin');
      }));
      it('should init scope with state and cases tabs', function(){
        expect(scope.casesStates ).toEqual([{state : 'bonita.cases.active', title: 'Open cases', htmlAttributeId:'TabActiveCases'}, {state : 'bonita.cases.archived', title: 'Archived cases', htmlAttributeId:'TabArchivedCases'}]);
      });
      it('should call manageTopUrl goTo method when tab is clicked', function(){
        caseCtrl.goTo();
        expect(mockedManageTopUrl.goTo.calls.allArgs()).toEqual([['caselistingadmin', []]]);
      });
      it('should call manageTopUrl goTo method when archived tab is clicked', function(){
        mockedManageTopUrl.getCurrentPageToken.and.returnValue('caselistingpm');
        var tab = 'archived';
        caseCtrl.goTo(tab);
        expect(mockedManageTopUrl.goTo.calls.allArgs()).toEqual([['caselistingpm', [{'name': '_tab', 'value':tab}]]]);
      });
    });
  });
})();
