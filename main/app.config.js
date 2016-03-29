/* jshint sub:true*/
(function() {
  'use strict';

  /**
   * Polyfill for IE
   */
  if (!window.console) {
    window.console = {
      log: angular.noop,
      error: angular.noop,
      debug: angular.noop,
      warn: angular.noop
    };
  }

  if (!window.console.debug) {
    window.console.debug = window.console.log;
  }

  // Detect if the browser is IE... (we cannot detect IE10/11 with Paul Irish hack)
  if (window.navigator.userAgent.indexOf('IE') > -1) {
    document.body.className += ' isBrowser-ie'; // IE9 does not have classList API
  }

  angular
    .module('org.bonitasoft.portal')
    .provider('bonita', function() {
      this.stateResolve = {
        /* @ngInject */
        translations: function(i18nService) {
          return i18nService.translationsLoadPromise;
        }
      };
      this.$get = function() {
        return this.stateResolve;
      };
    })

    .config(function($httpProvider) {
      // configure bonita xsrf token cookie and header names
      $httpProvider.defaults.xsrfHeaderName = $httpProvider.defaults.xsrfCookieName = 'X-Bonita-API-Token';
    })

    //parent state to use for every state in order to have the translations loaded correctly...
    .config(function($stateProvider, bonitaProvider) {
      $stateProvider.state('bonita', {
        template: '<ui-view/>',
        resolve: bonitaProvider.stateResolve
      });
    });
})();
