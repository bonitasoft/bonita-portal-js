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

  angular.module('org.bonitasoft.portal', [
    'ngCookies',
    'gettext',
    'ui.router',
    'org.bonitasoft.service.features',
    'org.bonitasoft.services.i18n',
    'org.bonitasoft.common.resources',
    'org.bonitasoft.features.admin',
    'org.bonitasoft.features.user'
  ]).provider('bonita', function() {
    this.stateResolve = {
      translations: ['i18nService', function(i18nService){
        return i18nService.translationsLoadPromise;
      }],
      csrfToken: ['$http',
        function($http) {
          return $http({
              method: 'GET',
              url: '../API/system/session/unusedId'
            })
            .success(function(data, status, headers) {
              $http.defaults.headers.common['X-Bonita-API-Token'] = headers('X-Bonita-API-Token');
            });
        }
      ]
    };
    this.$get = function() {
      return this.stateResolve;
    };
  })
  //parent state to use for every state in order to have the translations loaded correctly...
  .config(function($stateProvider, bonitaProvider) {
    $stateProvider.state('bonita', {
      template: '<ui-view/>',
      resolve: bonitaProvider.stateResolve
    });
  });
})();
