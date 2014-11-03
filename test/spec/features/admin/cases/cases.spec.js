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
    it('should add a new state matching for the case list', inject(function(){
      var caseListStateConfig = state.get('bonita.casesList');
      expect(caseListStateConfig.url).toBe('/admin/cases/list');
      expect(caseListStateConfig.templateUrl).toBe('features/admin/cases/cases-list.html');
      expect(caseListStateConfig.controller).toBe('CaseListCtrl');
    }));
  });
})();
