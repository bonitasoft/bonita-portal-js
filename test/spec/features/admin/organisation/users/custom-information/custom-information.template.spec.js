(function () {
  'use strict';

  describe('general section', () => {

    let scope, elm;

    beforeEach(module(
      'org.bonitasoft.features.admin.organisation.users',
      'org.bonitasoft.templates'
    ));

    beforeEach(inject(function ($templateCache, $compile, $rootScope) {
      var template = $templateCache.get('features/admin/organisation/users/details/custom-information/index.html');
      scope = $rootScope.$new();
      scope.vm = {
        hasCustomInfo: () => scope.vm.customInformation && scope.vm.customInformation.length > 0,
        saveCustomInfo: jasmine.createSpy('saveCustomInfo')
      };
      elm = $compile(template)(scope);
      scope.$apply();
    }));

    it('should display nothing when there are no custom information', () => {
      scope.vm.customInformation = [];
      scope.$apply();

      expect(elm.find('button').length).toBe(0);
      expect(elm.find('input').length).toBe(0);
      expect(elm.text()).toContain('No custom information defined.');
    });

    it('should display user custom information', () => {
      scope.vm.customInformation = [
        {definitionId: {id: 42, name: 'skype', description: 'skype account'}, userId: 5, value: 'newValue'},
        {definitionId: {id: 41, name: 'tinder'}, userId: 5, value: 'otherValue'}
      ];
      scope.$apply();

      expect(angular.element(elm.find('label')[0]).text()).toBe('skype');
      expect(angular.element(elm.find('input')[0]).val()).toBe('newValue');
      expect(angular.element(elm.find('.help-block')[0]).text().trim()).toBe('skype account');

      expect(angular.element(elm.find('label')[1]).text()).toBe('tinder');
      expect(angular.element(elm.find('input')[1]).val()).toBe('otherValue');
      expect(elm.find('.help-block')[1]).toBeUndefined(); // no description for tinder
    });

    it('should save custom information', () => {
      scope.vm.customInformation = [
        {definitionId: {id: 42, name: 'skype', description: 'skype account'}, userId: 5, value: 'newValue'},
        {definitionId: {id: 41, name: 'tinder'}, userId: 5, value: 'otherValue'}
      ];
      scope.$apply();

      elm.find('button.btn-primary').click();

      expect(scope.vm.saveCustomInfo).toHaveBeenCalledWith(scope.vm.customInformation);
    });

  });

})();
