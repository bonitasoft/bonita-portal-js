describe('Utils module', function() {

  'use strict';

  var filter;

  beforeEach(module('com.bonita.common.utils.filters'));

  beforeEach(inject(function($filter) {
    filter = $filter;
  }));

  describe('Filter ucFirst', function() {

    it('should transform the first letter of a string to uppercase', function() {
      expect(filter('ucfirst')('string')).toEqual('String');
    });

    it('should not change anything if an uppercase already exist', function() {
      expect(filter('ucfirst')('String')).toEqual('String');
    });

    it('should not throw an error if it is not a String at char1', function() {
      expect(filter('ucfirst')('2string')).toEqual('2string');
    });

    it('should be empty if it is an empty string', function() {
      expect(filter('ucfirst')('')).toEqual('');
    });

    it('should be empty if no string', function() {
      expect(filter('ucfirst')()).toEqual('');
    });

  });

});
