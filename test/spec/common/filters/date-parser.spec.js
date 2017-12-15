describe('date-parser', function() {
  'use strict';

  var dateParser;

  beforeEach(module('org.bonitasoft.common.filters.date.parser'));

  beforeEach(inject(function(_dateParser_) {
    dateParser = _dateParser_;
  }));

  it('should return empty when no date is returned', function() {
    expect(dateParser.parseAndFormat()).toBeUndefined();
    expect(dateParser.parseAndFormat(null)).toBeFalsy();
    expect(dateParser.parseAndFormat(false)).toBeFalsy();
    expect(dateParser.parseAndFormat(0)).toBeFalsy();
  });

  it('should return UTC date', function() {
    expect(dateParser.parseAndFormat('2016-12-23 21:45:09.000')).toEqual('12/23/2016 9:45 PM');
  });
});
