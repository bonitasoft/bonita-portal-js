(function() {
  'use strict';
  describe('Name of the group', function() {
    var stateProvider, http, i18nService, q, scope, bProvider, httpBackend;
    beforeEach(function() {
      angular.module('ui.router.dummy', ['ui.router'])
        .config(function($stateProvider) {
          stateProvider = $stateProvider;
          var stateFunction = jasmine.createSpy('state');
          $stateProvider.state = stateFunction;
          stateFunction.and.returnValue($stateProvider);
        });
      module('ui.router.dummy');
      angular.module('org.bonitasoft.portal').config(function(bonitaProvider) {
        bProvider = bonitaProvider;
      });
      module('org.bonitasoft.portal', function($provide) {
        i18nService = {
          translationsLoadPromise: {}
        };
        http = jasmine.createSpyObj('http', ['search']);

        $provide.value('i18nService', i18nService);
        $provide.value('http', http);
      });
      inject(function($rootScope, _i18nService_, $http, $q, $httpBackend) {
        httpBackend = $httpBackend;
        i18nService = _i18nService_;
        http = $http;
        q = $q;
        scope = $rootScope.$new();
      });
    });
    it('should add one main state', function() {
      expect(stateProvider.state).toHaveBeenCalledWith('bonita', {
        template: '<ui-view/>',
        resolve: bProvider.stateResolve
      });
    });
    describe('bonitaProvider', function() {
      it('should wait for translations promise', function() {
        expect(bProvider.stateResolve.translations[1](i18nService)).toEqual(i18nService.translationsLoadPromise);
      });
      it('should set csrf token on default http requests', function() {
        var token = '32136546';
        httpBackend.expectGET('../API/system/session/unusedId').respond('', {
          'X-Bonita-API-Token': token
        });
        expect(bProvider.stateResolve.csrfToken[1](http)).toBeDefined();
        httpBackend.flush();
        expect(http.defaults.headers.common['X-Bonita-API-Token']).toEqual(token);
      });
    });
  });
})();
