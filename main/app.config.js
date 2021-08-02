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

    .run(function($rootScope, $modalStack) {
      var getQueryParamValue = function(param, searchParams) {
        var searchParamsList = searchParams.replace('?', '').split('&');
        for (var i = 0; i < searchParamsList.length; i++) {
          if (searchParamsList[i].indexOf(param) === 0) {
            return searchParamsList[i].split('=')[1];
          }
        }
        return undefined;
      }

      $rootScope.$on('$locationChangeStart', function() {
        // Close modals on location changes
        $modalStack.dismissAll();

        // Get app theme
        var appValue = getQueryParamValue('app', window.location.search);
        if (appValue) {
          var themeUrl = window.top.location.origin + window.top.location.pathname + '../theme/theme.css';
          var themeLink = window.document.createElement('link');
          themeLink.setAttribute('rel', 'stylesheet');
          themeLink.setAttribute('href', themeUrl);
          window.document.head.appendChild(themeLink);
        }
      });
    })

    .config(function($httpProvider) {
      // configure bonita xsrf token cookie and header names
      $httpProvider.defaults.xsrfHeaderName = $httpProvider.defaults.xsrfCookieName = 'X-Bonita-API-Token';
    })

    .config(function(growlProvider) {
      growlProvider.globalTimeToLive(3000);
      growlProvider.globalDisableCountDown(true);
      growlProvider.globalDisableIcons(true);
    })

    //parent state to use for every state in order to have the translations loaded correctly...
    .config(function($stateProvider, bonitaProvider) {
      $stateProvider.state('bonita', {
        template: '<ui-view/>',
        resolve: bonitaProvider.stateResolve
      });
    });
})();
