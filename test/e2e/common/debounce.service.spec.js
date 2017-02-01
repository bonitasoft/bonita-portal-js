(() => {
  'use strict';

  describe('debounce service', function () {

    var debounce, $timeout;

    beforeEach(module('org.bonitasoft.service.debounce'));

    beforeEach(inject(function (_debounce_, _$timeout_) {
      debounce = _debounce_;
      $timeout = _$timeout_;
    }));

    it('should execute a function only once when delay is not achieved', function () {
      var fn = jasmine.createSpy('aFunction');

      debounce(fn, 300);
      debounce(fn, 300);

      $timeout.flush();
      expect(fn.calls.count()).toBe(1);
    });
  });

})();
