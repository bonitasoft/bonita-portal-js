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

(function() {
  'use strict';
  describe('Name of the group', function() {
    var stateProvider, http, i18nService, q, scope, bProvider, httpBackend, bonita, $cookie;
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
      inject(function($rootScope, _i18nService_, $http, $q, $httpBackend, _bonita_, _$cookies_) {
        httpBackend = $httpBackend;
        i18nService = _i18nService_;
        http = $http;
        q = $q;
        scope = $rootScope.$new();
        bonita = _bonita_;
        $cookie = _$cookies_;
      });
    });
    it('should add one main state', function() {
      expect(stateProvider.state).toHaveBeenCalledWith('bonita', {
        template: '<ui-view/>',
        resolve: bProvider.stateResolve
      });
    });

    it('should set proper xsrf token in http request headers if specified in cookie', function() {
      var xsrfToken = '32136546';
      $cookie.put('X-Bonita-API-Token', xsrfToken);

      httpBackend.expectGET('some/uri/xsrf/protected', function (headers) {
        return headers['X-Bonita-API-Token'] === xsrfToken;
      }).respond(201, '');

      http.get('some/uri/xsrf/protected');
      httpBackend.flush();
    });

    describe('bonitaProvider', function() {
      it('should wait for translations promise', function() {
        expect(bProvider.stateResolve.translations[1](i18nService)).toEqual(i18nService.translationsLoadPromise);
      });
      it('should have a $get function that return the state Resolver', function() {
        expect(bProvider.$get()).toEqual(bProvider.stateResolve);
        expect(bonita).toEqual(bProvider.stateResolve);
      });
    });
  });
})();
