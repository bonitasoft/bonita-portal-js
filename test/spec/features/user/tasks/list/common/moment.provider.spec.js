(function() {

  'use strict';

  describe('moment service', function() {

    var $window, provider;

    beforeEach(module('org.bonitasoft.features.user.tasks.common'));

    beforeEach(function() {
      module(function(momentProvider) {
        provider = momentProvider;
      });
      inject();
    });

    beforeEach(inject(function(_$window_) {
      $window = _$window_;
    }));

    it('should throw error when moment.js is not available', () => {
      expect(function() {
        provider.$get({moment: undefined});
      }).toThrowError('moment.js is needed');
    });

    it('should wrap moment.js in an angular service', () => {
      expect(provider.$get($window)).toEqual(window.moment);
    });
  });


})();
