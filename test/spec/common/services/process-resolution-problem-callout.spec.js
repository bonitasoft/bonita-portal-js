(function() {
  'use strict';
  describe('ProcessProblemResolutionService', function() {
    var processProblemResolutionService;

    beforeEach(module('org.bonitasoft.service.process.errorMessage'));

    beforeEach(function() {

      inject(function($injector) {
        processProblemResolutionService = $injector.get('ProcessProblemResolutionService');
      });
    });
    describe('isActorResolutionFailing', function() {

      it('should return true when value state target type is not present', function() {
        expect(processProblemResolutionService.isActorResolutionFailing()).toBe(false);
        expect(processProblemResolutionService.isActorResolutionFailing({})).toBe(false);
        expect(processProblemResolutionService.isActorResolutionFailing([])).toBe(false);
        expect(processProblemResolutionService.isActorResolutionFailing(['actor', 'connector', 'bdm'])).toBe(false);
      });
    });
  });
})();
