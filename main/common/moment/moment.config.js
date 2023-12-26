(function() {

  'use strict';

  angular
      .module('org.bonitasoft.common.moment')
      .run(configMomentLocale);

  function configMomentLocale(moment, locale) {
    moment.locale(locale.get());
  }

})();
