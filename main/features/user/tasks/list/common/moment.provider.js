(function() {

  'use strict';

  angular
    .module('org.bonitasoft.features.user.tasks.common')
    .provider('moment', momentProvider);

  function momentProvider() {
    return {
      $get: $get
    };

    function $get($window) {
      if (!$window.moment) {
        throw new Error('moment.js is needed');
      }
      return $window.moment;
    }
  }

})();
