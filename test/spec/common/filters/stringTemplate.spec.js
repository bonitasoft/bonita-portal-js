(function(){
  'use strict';
  describe('stringTemplater', function() {

    var stringTemplater;

    beforeEach(module('org.bonitasoft.common.filters.stringTemplater'));

    beforeEach(inject(function($filter) {
      stringTemplater = $filter('stringTemplater');
    }));

    it('should leave string untouch if no {} present', function () {
      expect(stringTemplater('foo bar')).toBe('foo bar');
    });
    it('should change {} to given input string', function () {
      expect(stringTemplater('foo {}', 'bar')).toBe('foo bar');
    });
    it('should change {} to given input date', function () {
      var date = new Date();
      expect(stringTemplater('foo {}', date)).toBe('foo '+date);
    });
    it('should change {} to given input number', function () {
      expect(stringTemplater('foo {}', 10)).toBe('foo 10');
    });
    it('should change {} to given input string array', function () {
      expect(stringTemplater('{} {}', ['bar', 'foo'])).toBe('bar foo');
    });
    it('should change {} to given input object array', function () {
      var date = new Date();
      expect(stringTemplater('{} {}', [10, date])).toBe('10 '+date);
    });
    it('should change {} to given input ', function () {
      expect(stringTemplater('{}', ['bar', 'foo'])).toBe('bar');
    });
    it('should change first {} to given limited input', function () {
      expect(stringTemplater('{} {}', ['foo'])).toBe('foo ');
    });
  });
})();