/* global describe  */
(function () {
  'use strict';
  describe('admin cases list features', function () {

    var state ;//= jasmine.createSpyObj('$stateProvider',['state']);

    beforeEach(module('org.bonita.features.admin.cases', function($stateProvider) {
      $stateProvider.state('bonita', {});
    }));

    beforeEach(inject(function($state) {
      state = $state;
    }));
    it('should add a new state matching for the case main entry point', inject(function(){
      var caseListStateConfig = state.get('bonita.cases');
      expect(caseListStateConfig.url).toBe('/admin/cases/list');
      expect(caseListStateConfig.abstract).toBeTruthy();
      expect(caseListStateConfig.templateUrl).toBe('features/admin/cases/cases.html');
      expect(caseListStateConfig.controller).toBeUndefined();
    }));
    it('should add a new state matching for the active case', inject(function(){
      var caseListStateConfig = state.get('bonita.cases.active');
      expect(caseListStateConfig.url).toBe('/active');
      expect(caseListStateConfig.abstract).toBeFalsy();
      expect(caseListStateConfig.views).toEqual({'case-list': {templateUrl : 'features/admin/cases/cases-list.html', controller: 'ActiveCaseListCtrl'}});
    }));
    it('should add a new state matching for the case main entry point', inject(function(){
      var caseListStateConfig = state.get('bonita.cases.archived');
      expect(caseListStateConfig.url).toBe('/archived');
      expect(caseListStateConfig.abstract).toBeFalsy();
      expect(caseListStateConfig.views).toEqual({ 'case-list' : {templateUrl : 'features/admin/cases/archived-cases-list.html', controller: 'ArchivedCaseListCtrl'}});
    }));
  });
})();
