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

describe('i18nService', function () {
  'use strict';


  var i18nAPI, gettextCatalog, deferred, rootScope, I18N_KEYS, locale;

  beforeEach(module('org.bonitasoft.common.i18n'));

  beforeEach(function() {
    module(function($provide){
      I18N_KEYS = {'test.key': 'bonita'};
      $provide.value('I18N_KEYS', I18N_KEYS);
    });
  });

  beforeEach(inject(function (_i18nAPI_, _gettextCatalog_, $q, $rootScope, _locale_) {
    rootScope = $rootScope;
    i18nAPI = _i18nAPI_;
    gettextCatalog = _gettextCatalog_;
    deferred = $q.defer();
    locale = _locale_;

    spyOn(i18nAPI, 'query').and.callFake(function () {
      return { $promise: deferred.promise };
    });
  }));

  it('should load translation for current locale', inject(function ($injector) {
    spyOn(locale, 'get').and.returnValue('fr');
    $injector.get('i18nService');
    deferred.resolve([]);
    rootScope.$apply();
    expect(i18nAPI.query).toHaveBeenCalledWith({
      f: 'locale=fr'
    });
  }));

  describe('resolution', function () {

    var $rootScope;

    beforeEach(inject(function (_$rootScope_, $httpBackend) {
      $rootScope = _$rootScope_;

      $httpBackend.expectGET().respond(function () {
        return {};
      });

    }));

    it('should set gettextCatalog local', inject(function ($injector) {
      /* jshint camelcase: false */
      spyOn(locale, 'get').and.returnValue('fr');

      $injector.get('i18nService');
      deferred.resolve([]);
      $rootScope.$apply();

      expect(gettextCatalog.currentLanguage).toBe('fr');
    }));

    it('should update catalog', inject(function ($injector) {
      /* jshint camelcase: false */
      spyOn(locale, 'get').and.returnValue('fr');

      $injector.get('i18nService');
      deferred.resolve([
        { key: 'Hello', value: 'Bonjour' }
      ]);
      $rootScope.$apply();

      expect(gettextCatalog.getString('Hello')).toBe('Bonjour');
    }));
  });
  describe('getKey', function() {
    var i18nService;
    beforeEach(inject(function ($injector) {
      i18nService = $injector.get('i18nService');
    }));
    it('should not translate from not found key but return key itself', function() {
      expect(i18nService.getKey('')).toEqual('');
      expect(i18nService.getKey('doing some tests')).toEqual('doing some tests');
    });
    it('should not translate from not found key but return key itself', function() {
      expect(i18nService.getKey('test.key')).toEqual('bonita');
    });
  });
});
