(() => {
  'use strict';

  describe('manager field', () => {

    let element, scope, modelCtrl, $timeout;

    beforeEach(module('org.bonitasoft.features.admin.organisation.users', 'org.bonitasoft.templates'));

    beforeEach(inject(function ($compile, $rootScope, _$timeout_) {
      scope = $rootScope.$new();
      $timeout = _$timeout_;

      scope.selected = {};
      scope.search = function(value) {
        return [
          {firstname: 'Walter', lastname: 'Bates', userName: 'walter.bates'},
          {firstname: 'William', lastname: 'Jobs', userName: 'william.jobs'},
          {firstname: 'Hellen', lastname: 'Kelly', userName: 'hellen.kelly'}
        ].filter(manager => manager.firstname.indexOf(value) !== -1);
      };
      let template = '<div><bo-manager-field selected="selected" on-type="search"> </bo-manager-field></div>';
      element = $compile(template)(scope);
      scope.$apply();
      modelCtrl = element.find('input').controller('ngModel');
    }));

    it('should display an empty field when selected manager is not defined', () => {
      scope.selected = undefined;
      scope.$apply();

      expect(element.find('input').val()).toEqual('');
    });

    it('should format the manager\'s name', () => {
      scope.selected = {firstname: 'Walter', lastname: 'Bates', userName: 'walter.bates'};
      scope.$apply();

      expect(element.find('input').val()).toEqual('Walter Bates (walter.bates)');
    });

    it('should propose managers depending on what we type in', () => {
      modelCtrl.$setViewValue('W');
      $timeout.flush(); // flushing timeout to trigger the debounce

      let lis = element.find('li');
      expect(lis.length).toEqual(2);
      expect(angular.element(lis[0]).text()).toContain('Walter Bates (walter.bates)');
      expect(angular.element(lis[1]).text()).toContain('William Jobs (william.jobs)');

      modelCtrl.$setViewValue('Wi');
      $timeout.flush(); // flushing timeout to trigger the debounce

      lis = element.find('li');
      expect(lis.length).toEqual(1);
      expect(angular.element(lis[0]).text()).toContain('William Jobs (william.jobs)');
    });

    it('should debounce the onType function', () => {
      // whenever we type 2 characters in one debounce cycle, onType method should be called once
      scope.search = jasmine.createSpy('search');
      scope.$apply();
      modelCtrl.$setViewValue('W');
      modelCtrl.$setViewValue('Wi');

      $timeout.flush(); // flushing timeout to trigger the debounce

      expect(scope.search.calls.count()).toBe(1);
    });

    it('should format manager\'s name when selecting from list', () => {
      modelCtrl.$setViewValue('W');
      $timeout.flush(); // flushing timeout to trigger the debounce

      let lis = element.find('li');
      angular.element(lis[0]).click();

      expect(element.find('input').val()).toEqual('Walter Bates (walter.bates)');
    });

    it('should update the selected manager when selecting from list', () => {
      modelCtrl.$setViewValue('W');
      $timeout.flush(); // flushing timeout to trigger the debounce

      let lis = element.find('li');
      angular.element(lis[0]).click();

      expect(scope.selected).toEqual({firstname: 'Walter', lastname: 'Bates', userName: 'walter.bates'});
    });

  });

})();
