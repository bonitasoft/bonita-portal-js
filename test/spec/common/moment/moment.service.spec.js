(function() {

  'use strict';

  describe('moment service', function() {

    var moment;

    beforeEach(module('org.bonitasoft.common.moment'));

    beforeEach(inject(function(_moment_) {
      moment = _moment_;
    }));

    it('should wrap moment.js in an angular service', () => {
      expect(moment).toEqual(window.moment);
    });
  });


})();
