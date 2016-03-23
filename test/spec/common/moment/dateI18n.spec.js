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

describe('dateI18n filter', function() {

  'use strict';

  var window, filter;

  beforeEach(module('gettext', function($provide) {
    $provide.decorator('gettextCatalog', function($delegate) {
      $delegate.currentLanguage = 'en';
      $delegate.baseLanguage = 'en';
      $delegate.locale = function(lang) {
        this.currentLanguage = lang;
      };
      return $delegate;
    });
  }));

  beforeEach(module('org.bonitasoft.common.moment'));

  beforeEach(inject(function(dateI18nFilter, _$window_) {
    filter = dateI18nFilter;
    window = _$window_;
  }));

  it('should return an empty string if no input', function() {
    expect(filter()).toBe('');
  });

  it('should throw an error if no output filter is set', function() {
    expect(function() {
      filter(Date.now());
    }).toThrowError('[com.bonitasoft.common.i18n.filters@dateI18nFilter] You cannot use the date filter without a format');
  });

  it('should convert a date to a specific format', function() {
    // January 07 2015
    expect(filter(1420621013493, 'YYYY')).toBe('2015');
  });

  it('should convert a string representation of epoc time to a specific format', function() {
    // January 07 2015
    expect(filter('1420621013493', 'YYYY')).toBe('2015');
  });

  describe('Change the locale', function() {

    var gettextCatalog;

    beforeEach(inject(function($injector) {
      gettextCatalog = $injector.get('gettextCatalog');
    }));

    it('should be english per default', function() {
      expect(filter(1415281485491, 'MMMM')).toBe('November');
    });

    it('should be translted to french if we specify it', function() {
      gettextCatalog.currentLanguage = 'fr';
      expect(filter(1415281485491, 'MMMM')).toBe('novembre');
    });

    it('should use baseLanguage per default if no currentLanguage', function() {
      gettextCatalog.baseLanguage = 'en';
      gettextCatalog.currentLanguage = 'en';
      expect(filter(1415281485491, 'MMMM')).toBe('November');
    });
  });
});
