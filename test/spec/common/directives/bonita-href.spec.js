(function () {
  'use strict';
  describe('location', function () {
    var $window, scope;

    beforeEach(module('org.bonita.common.directives.bntHref'));

    // You can copy/past this beforeEach
    beforeEach(module(function ($provide) {

      $window = {
        // now, $window.location.path will update that empty object
        top: {
          location : {}
        },
        document: window.document
      };

      // We register our new $window instead of the old
      $provide.constant('$window', $window);
    }));

    beforeEach(inject(function($rootScope){
      scope = $rootScope.$new();
    }));

    // whatever you want to test
    it('should be redirected', inject(function ($compile) {

      $compile('<a bnt-href="/to/infinity/and/beyond">Let&quot;sGo Buzz!!</a>')(scope);
      // action which reload the page


      // we can test if the new path is correct.
      expect($window.top.location.href).toBe('/to/infinity/and/beyond');

    }));
  });
})();
