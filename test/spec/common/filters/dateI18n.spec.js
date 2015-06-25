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

describe('Modules filters', function () {

  'use strict';

  var momentBack;

  beforeEach(module('gettext', function ($provide) {
    $provide.decorator('gettextCatalog', function ($delegate) {
      $delegate.currentLanguage = 'en';
      $delegate.baseLanguage = 'en';
      $delegate.locale = function (lang) {
        this.currentLanguage = lang;
      };
      return $delegate;
    });
  }));
  beforeEach(module('org.bonitasoft.common.i18n.filters'));


  describe('Filter dateI18n', function () {

    var window, filter;

    beforeEach(inject(function ($filter, _$window_) {
      filter = $filter('dateI18n');
      window = _$window_;
    }));

    it('should return an empty string if no input', function () {
      expect(filter()).toBe('');
    });

    it('should throw an error if no output filter is set', function () {
      expect(function () {
        filter(Date.now());
      }).toThrowError('[com.bonitasoft.common.i18n.filters@dateI18nFilter] You cannot use the date filter without a format');
    });

    it('should throw an error if moment does not exist', function() {
      var moment = window.moment;
      delete window.moment;
      expect(function () {
        filter(Date.now(), 'YYYY');
      }).toThrowError('[com.bonitasoft.common.i18n.filters@dateI18nFilter] We need moment.js to translate our dates');
      window.moment = moment;
    });

    it('should convert a date to a specific format', function () {
      // January 07 2015
      expect(filter(1420621013493, 'YYYY')).toBe('2015');
    });

    it('should convert a string representation of epoc time to a specific format', function () {
      // January 07 2015
      expect(filter('1420621013493', 'YYYY')).toBe('2015');
    });

    describe('Change the locale', function () {

      var gettextCatalog;

      beforeEach(inject(function ($injector) {
        gettextCatalog = $injector.get('gettextCatalog');
      }));

      it('should be english per default', function () {
        expect(filter(1415281485491, 'MMMM')).toBe('November');
      });

      it('should be translted to french if we specify it', function () {
        gettextCatalog.currentLanguage = 'fr';
        expect(filter(1415281485491, 'MMMM')).toBe('novembre');
      });

      it('should use baseLanguage per default if no currentLanguage', function () {
        gettextCatalog.baseLanguage = 'en';
        gettextCatalog.currentLanguage = 'en';
        expect(filter(1415281485491, 'MMMM')).toBe('November');
      });
    });
  });

  describe('Filter dateAgo', function () {

    var comparator = angular.noop, filter, gettextCatalog;

    beforeEach(inject(function ($filter, $injector) {
      gettextCatalog = $injector.get('gettextCatalog');
      filter = $filter('dateAgo');
      console.warn = angular.noop;
      comparator = function (date) {
        date = date || Date.now();
        return window.moment(date).from(Date.now());
      };
    }));

    it('sould convert a date to ago format', function () {
      expect(filter(Date.now())).toEqual(comparator());
    });

    it('sould convert a date to ago format for one hour', function () {
      var oneHourAgo = new Date((new Date()).getTime() - (1000 * 60 * 60 * 24 * 7));
      expect(filter(oneHourAgo)).toEqual(comparator(oneHourAgo));
    });

    it('sould convert a date to ago format for one day', function () {
      var oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      expect(filter(oneDayAgo)).toEqual(comparator(oneDayAgo));
    });

    it('sould convert a date to ago format for one week', function () {
      var oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      expect(filter(oneWeekAgo)).toEqual(comparator(oneWeekAgo));
    });

    it('sould convert a date to ago format for one month', function () {
      var oneMonthAgo = new Date();
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 31);
      expect(filter(oneMonthAgo)).toEqual(comparator(oneMonthAgo));
    });

    it('should be date.now if no input', function () {
      expect(filter()).toEqual(comparator(Date.now()));
    });

    it('should throw an error if moment does not exist', function () {

      momentBack = window.moment;
      delete window.moment;
      expect(function () {
        filter(Date.now());
      }).toThrow();
      expect(function () {
        filter(Date.now());
      }).toThrowError('[com.bonitasoft.common.i18n.filters@dateAgoFilter] We need moment.js to translate our dates');
    });

    describe('Change the locale', function () {

      var gettextCatalog, testDate;

      beforeEach(inject(function ($injector) {

        // re-bind moment
        window.moment = momentBack;
        // 1h ago
        testDate = new Date((new Date().getTime() - (1 * 60 * 60 * 1000)));
        gettextCatalog = $injector.get('gettextCatalog');
      }));

      it('should be english per default', function () {

        expect(filter(testDate)).toBe('an hour ago');
      });

      it('should be translted to french if we specify it', function () {
        gettextCatalog.currentLanguage = 'fr';
        expect(filter(testDate)).toBe('il y a une heure');
      });

      it('should use baseLanguage per default if no currentLanguage', function () {
        gettextCatalog.baseLanguage = 'en';
        gettextCatalog.currentLanguage = 'en';
        expect(filter(testDate)).toBe('an hour ago');
      });
    });

  });


});
