'use strict';

describe('inputFocus directive', function(){
  var element;
  var scope;
  var $timeout;

  beforeEach(module('ui.focus'));

  beforeEach(inject(function($rootScope, $compile, $injector, $document) {
    scope = $rootScope.$new();
    $timeout = $injector.get('$timeout');
    element = $compile('<input type="text" input-focus />')(scope);
    // element.appendTo(document.body);
    $document.find('body').append(element);
  }));

  describe('Input', function() {
    it('should have focus', function(){
      $timeout.flush();
      expect(document.activeElement).toBe(element[0]);
    });
  });

});
