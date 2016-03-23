'use strict';

describe('encodeURI filter', function() {

  beforeEach(module('common.filters'));

  var filter;

  beforeEach(inject(function($injector) {
    filter = $injector.get('$filter')('encodeURI');
  }));

  it('should equals to window.encodeURI function', function() {
    expect(filter).toEqual(window.encodeURI);
  });

});
