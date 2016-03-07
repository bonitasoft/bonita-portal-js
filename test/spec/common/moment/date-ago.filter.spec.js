(function() {

  'use strict';

  describe('dateAgo filter', function () {

    var comparator = angular.noop, filter, gettextCatalog;

    beforeEach(module('org.bonitasoft.common.moment'));

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

    describe('Change the locale', function () {

      var gettextCatalog, testDate;

      beforeEach(inject(function ($injector) {
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


})();
