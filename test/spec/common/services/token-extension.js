(function () {
  'use strict';
  describe('manage token extension', function () {
    beforeEach(module('org.bonitasoft.service.token'));
    describe('tokenExtensionValue', function(){
      it('should keep token the same when imported multiple times', inject(function ($injector) {
        var tokenExtensionService = $injector.get('TokenExtensionService');
        tokenExtensionService.tokenExtensionValue = 'pm';
        tokenExtensionService = $injector.get('TokenExtensionService');
        expect(tokenExtensionService.tokenExtensionValue).toEqual('pm');
      }));
    });
  });
})();
