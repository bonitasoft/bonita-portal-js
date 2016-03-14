(function() {
  'use strict';

  describe('moment config', () => {
    var moment, locale;

    beforeEach(() => {
      module('org.bonitasoft.common.moment', ($provide) => {

        // mock locale to `de`
        $provide.value('locale', {
          get: () => 'de'
        });
      });

      inject((_moment_) => moment = _moment_);
    });

    it('should configure moment locale', function() {
      expect(moment.locale()).toBe('de');
    });

  })

})();
