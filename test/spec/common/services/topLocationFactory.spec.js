describe('topLocationFactory', function () {
  'use strict';

  var topLocation, $window;

  beforeEach(module('org.bonita.services.navigation'));

  beforeEach(function () {
    $window = {top: {location: {}}};

    module(function ($provide) {
      $provide.value('$window', $window);
    });

    inject(function (_topLocation_) {
      topLocation = _topLocation_;
    });
  });

  it('should retrieve profile from top window hash', function () {
    $window.top.location.hash = '_pf=2';
    expect(topLocation._pf).toBe('2');
  });

  it('should return undefined when there is no profile defined in the top window hash', function () {
    expect(topLocation._pf).toBeUndefined();
  });

  it('should retrieve tenant from top window query string', function () {
    $window.top.location.query = 'tenant=4';
    expect(topLocation.tenant).toBe('4');
  });

  it('should return undefined when there is no tenant defined in the top window query string', function () {
    expect(topLocation.tenant).toBeUndefined();
  });
});
