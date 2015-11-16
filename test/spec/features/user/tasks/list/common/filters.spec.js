'use strict';

describe('common.filters: ', function() {

  beforeEach(module('common.filters'));

  describe('moment', function(){
    var dateFilter;
    var momentFilter;
    var apiDate = '2014-09-04 15:04:15.871';
    var format = 'DD MMM YYYY';

    beforeEach(inject(function($injector) {
      dateFilter = $injector.get('$filter')('date');
      momentFilter = $injector.get('$filter')('moment');
    }));

    it('should return a formated Date if header type is date', function() {
      expect(momentFilter(apiDate, format)).toBe('04 Sep 2014');
    });

  });

  describe('encodeURI', function(){
    var filter;

    beforeEach(inject(function($injector) {
      filter = $injector.get('$filter')('encodeURI');
    }));

    it('should equals to window.encodeURI function', function() {
      expect(filter).toEqual(window.encodeURI);
    });
  });


});
