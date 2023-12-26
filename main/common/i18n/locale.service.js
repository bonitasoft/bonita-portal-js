(function() {

  'use strict';

  angular
    .module('org.bonitasoft.common.i18n')
    .service('locale', localeService);

  function localeService($cookies) {
    return {
      get: get
    };

    function get() {
      return $cookies.get('BOS_Locale') || 'en';
    }
  }

})();
