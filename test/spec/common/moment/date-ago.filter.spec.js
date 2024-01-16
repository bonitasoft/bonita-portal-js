(function() {

  'use strict';

  describe('dateAgo filter', function () {

    var comparator, dateAgoFilter, moment;

    beforeEach(module('org.bonitasoft.common.moment'));

    beforeEach(inject(function (_dateAgoFilter_, _moment_) {
      dateAgoFilter = _dateAgoFilter_;
      moment = _moment_;
      comparator = function (date) {
        date = date || Date.now();
        return moment(date).from(Date.now());
      };
    }));

    it('sould convert a date to ago format', function () {
      expect(dateAgoFilter(Date.now())).toEqual(comparator());
    });

    it('sould convert a date to ago format for one hour', function () {
      var oneHourAgo = new Date((new Date()).getTime() - (1000 * 60 * 60 * 24 * 7));
      expect(dateAgoFilter(oneHourAgo)).toEqual(comparator(oneHourAgo));
    });

    it('sould convert a date to ago format for one day', function () {
      var oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      expect(dateAgoFilter(oneDayAgo)).toEqual(comparator(oneDayAgo));
    });

    it('sould convert a date to ago format for one week', function () {
      var oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      expect(dateAgoFilter(oneWeekAgo)).toEqual(comparator(oneWeekAgo));
    });

    it('sould convert a date to ago format for one month', function () {
      var oneMonthAgo = new Date();
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 31);
      expect(dateAgoFilter(oneMonthAgo)).toEqual(comparator(oneMonthAgo));
    });

    it('should be date.now if no input', function () {
      expect(dateAgoFilter()).toEqual(comparator(Date.now()));
    });

    it('should be localized', function() {
      var oneHourAgo = new Date((new Date().getTime() - (1 * 60 * 60 * 1000)));
      moment.locale('fr');

      expect(dateAgoFilter(oneHourAgo)).toBe('il y a une heure');
    });

  });
})();
