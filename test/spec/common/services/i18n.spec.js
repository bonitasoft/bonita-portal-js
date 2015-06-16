/** Copyright (C) 2015 Bonitasoft S.A.
 * Bonitasoft, 32 rue Gustave Eiffel - 38000 Grenoble
 * This library is free software; you can redistribute it and/or modify it under the terms
 * of the GNU Lesser General Public License as published by the Free Software Foundation
 * version 2.1 of the License.
 * This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public License along with this
 * program; if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth
 * Floor, Boston, MA 02110-1301, USA.
 */

describe('i18nService', function () {
  'use strict';


  var i18nAPI, $cookies, gettextCatalog, deferred, rootScope, I18N_KEYS;

  beforeEach(module('org.bonitasoft.services.i18n'));

  beforeEach(function() {
    module(function($provide){
      I18N_KEYS = {'test.key': 'bonita'};
      $provide.value('I18N_KEYS', I18N_KEYS);
    });
  });

  beforeEach(inject(function (_i18nAPI_, _$cookies_, _gettextCatalog_, $q, $rootScope) {
    rootScope = $rootScope;
    i18nAPI = _i18nAPI_;
    $cookies = _$cookies_;
    gettextCatalog = _gettextCatalog_;
    deferred = $q.defer();

    spyOn(i18nAPI, 'query').and.callFake(function () {
      return { $promise: deferred.promise };
    });
  }));

  it('should get english as default local if none found', inject(function ($injector) {
    /* jshint camelcase: false */
    $cookies.BOS_Locale = undefined;
    $injector.get('i18nService');
    deferred.resolve([]);
    rootScope.$apply();
    expect(i18nAPI.query).toHaveBeenCalledWith({
      f: 'locale=en'
    });
  }));

  it('should get the local found in the cookie', inject(function ($injector) {
    /* jshint camelcase: false */
    $cookies.BOS_Locale = 'fr';
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
      $cookies.BOS_Locale = 'fr';

      $injector.get('i18nService');
      deferred.resolve([]);
      $rootScope.$apply();

      expect(gettextCatalog.currentLanguage).toBe('fr');
    }));

    it('should update catalog', inject(function ($injector) {
      /* jshint camelcase: false */
      $cookies.BOS_Locale = 'fr';

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
