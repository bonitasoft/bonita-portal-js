(function() {
  'use strict';
  /**
  * org.bonitasoft.service.token Module
  *
  * manage gwt token
  */
  angular.module('org.bonitasoft.service.token', []).service('TokenExtensionService', function(){
      var tokenExtension = {
        value : 'admin'
      };
      var tokenExtensionService  = {
        get tokenExtensionValue() {
          return tokenExtension.value;
        },
        set tokenExtensionValue(newValue) {
          tokenExtension.value = newValue;
        }
      };
      return tokenExtensionService;
    });
})();