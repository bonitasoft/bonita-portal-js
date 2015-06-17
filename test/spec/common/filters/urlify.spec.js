describe('urlify', function() {
  'use strict';

  var urlify;

  beforeEach(module('org.bonitasoft.common.filters.urlify'));

  beforeEach(inject(function($filter) {
    urlify = $filter('urlify');
  }));

  it('should replace spaces by dash in input', function () {
    expect(urlify('foo bar')).toBe('foo-bar');
  });

  it('should only leave url friendly characters in input', function () {
    expect(urlify('foo !@#$%^&*()_+=-[]{}|\'~.bar')).toBe('foo-_-~.bar');
  });

  it('should not throw an error when input is undefined', function () {
    expect(urlify(undefined)).toBe(undefined);
  });
});
