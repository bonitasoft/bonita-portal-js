/* jshint sub:true*/
(function () {
  'use strict';

  angular.module('org.bonita.services.topurl', [])
    .service('manageTopUrl', ['$window', function ($window) {
      var manageTopUrlService = {};
      manageTopUrlService.getCurrentPageToken = function() {
        var pageTokenRegExp = /(^|[&\?])_p=([^&]*)(&|$)/;
        var pageTokenMatches = pageTokenRegExp.exec($window.top.location.hash);
        if (pageTokenMatches && pageTokenMatches.length) {
          return pageTokenMatches[2];
        }
        return '';
      };
      manageTopUrlService.replaceTab = function (tab) {
        if (tab !== undefined && $window.self !== $window.top) {
          var pageToken = manageTopUrlService.getCurrentPageToken();
          if (!!$window.top.location.hash) {
            var tabRegExp = new RegExp('(^|[&\\?])'+pageToken+'_tab=[^&]*(&|$)');
            var tabMatches = $window.top.location.hash.match(tabRegExp);
            if (!tabMatches || !tabMatches.length) {
              var currentHash = $window.top.location.hash;
              $window.top.location.hash += ((currentHash.indexOf('&', currentHash.length - 2) >= 0) ? '' : '&') + pageToken+'_tab=' + tab;
            } else {
              $window.top.location.hash = $window.top.location.hash.replace(tabRegExp, '$1'+pageToken+'_tab=' + tab + '$2');
            }
          } else {
            $window.top.location.hash = '#'+pageToken+'_tab=' + tab;
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
