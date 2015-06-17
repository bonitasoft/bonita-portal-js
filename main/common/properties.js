(function() {
  'use strict';
  /**
  * org.bonitasoft.common.properties Module
  *
  * defines global properties shared between module
  */
  angular.module('org.bonitasoft.common.properties', []).
    value('growlOptions', {
      ttl: 3000,
      disableCountDown: true,
      disableIcons: true
    });
})();
