'use strict';

describe('screen', function() {
  var $timeout;
  var $document;
  var $rootScope;
  var screen;

  beforeEach(module(function($provide) {
    $document = [{
      body:{
        offsetWidth: 800
      }
    }];
    $provide.value('$document', $document);

  }));

  beforeEach(module('common.screen'));

  beforeEach(inject( function($injector){
    $rootScope = $injector.get('$rootScope');
    $timeout = $injector.get('$timeout');

    screen = $injector.get('screen');
  }));

  it('should have a default value depending on the viewport', function(){
    //800px == bootstrap sm breakpoint
    expect(screen.size.name).toBe('sm');
  });

  it('should broadcast an update event after being instantiate', function(){
    var handler = jasmine.createSpy('handler');
    $rootScope.$on('responsive:update', handler);
    $timeout.flush();
    expect(handler).toHaveBeenCalled();
  });

  describe('getWidth', function(){
    it('should return body width', function(){
      var w = screen.getWidth();
      expect(w).toBe($document[0].body.offsetWidth);
    });
  });

  describe('update', function(){
    var handler;

    beforeEach(function(){
      //flush the initial update $timeout
      $timeout.flush();
      handler = jasmine.createSpy('handler');
      $rootScope.$on('responsive:update', handler);
    });

    it('should not broadcast event if size not change', function(){
      screen.update();
      expect($timeout.flush).toThrow();
      expect(handler).not.toHaveBeenCalled();
    });

    it('should broadcast event if size change', function(){
      screen.size={name:'lg'};
      screen.update();
      $timeout.flush();
      expect(handler).toHaveBeenCalled();
    });
  });

});
