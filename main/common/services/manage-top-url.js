/* jshint sub:true*/
(function () {
  'use strict';

  angular.module('org.bonita.services.topurl', [])
    .service('manageTopUrl', ['$window', function ($window) {
      var manageTopUrlService = {};
      manageTopUrlService.replaceTab = function (tab) {
        if (tab && $window.self !== $window.top) {
          if (!!$window.top.location.hash) {
            var tabMatches = $window.top.location.hash.match(/(^|&)_tab=[^&]*(&|$)/);
            if (!tabMatches || !tabMatches.length) {
              var currentHash = $window.top.location.hash;
              $window.top.location.hash += ((currentHash.indexOf('&', currentHash.length - 2) >= 0) ? '' : '&') + '_tab=' + tab;
            } else {
              $window.top.location.hash = $window.top.location.hash.replace(/(^|&)_tab=[^&]*(&|$)/, '$1_tab=' + tab + '$2');
            }
          } else {
            $window.top.location.hash = '#_tab=' + tab;
          }
        }
      };

      manageTopUrlService.getCurrentProfile = function () {
        if ($window && $window.top && $window.top.location && $window.top.location.hash) {
          var currentProfileMatcher = $window.top.location.hash.match(/\b_pf=\d+\b/);
          return (currentProfileMatcher && currentProfileMatcher.length) ? currentProfileMatcher[0] : '';
        }
      };

      manageTopUrlService.getPath = function () {
        return $window.top.location.pathname;
      };

      manageTopUrlService.getSearch = function () {
        return $window.top.location.search || '';
      };

      manageTopUrlService.getUrlToTokenAndId = function (id, token) {
        return manageTopUrlService.getPath() + manageTopUrlService.getSearch() + '#?id=' + (id || '') + '&_p=' + (token || '') + '&' + manageTopUrlService.getCurrentProfile();
      };
      //cannot use module pattern or reveling since we would want to mock methods on test
      return manageTopUrlService;
    }]);
})();
