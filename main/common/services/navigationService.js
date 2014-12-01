(function () {
  'use strict';

  angular.module('org.bonita.services.navigation', [])

    .service('topLocation', function ($window) {

      var isUndefined = angular.isUndefined;

      function isTopLocationUndefined() {
        return isUndefined($window && $window.top && $window.top.location);
      }

      return Object.create({}, {
        _pf: function () {
          if (isTopLocationUndefined() || isUndefined($window.top.location.hash)) {
            return '';
          }
          var matches = $window.top.location.hash.match(/_pf=([1-9]*)/);
          return matches && matches[1] || '';
        },
        tenant: function () {
          if (isTopLocationUndefined() || isUndefined($window.top.location.search)) {
            return '';
          }
          var matches = $window.top.location.search.match(/tenant=([1-9]*)/);
          return matches && matches[1] || '';
        }
      });
    })

    .service('navigation', function(topLocation) {
      return Object.create({
        resolve: function(context) {
          if(!context._p) {
            throw new Error('_p should be defined in the context');
          }

          var url = '../portal/homepage';
          if(topLocation.tenant) {
            url += '?tenant=' + topLocation.tenant;
          }
          url += '#_p=' + context._p;
          if(context.id) {
            url += '&' + context._p + '_id=' + context.id;
          }
          if(topLocation._pf) {
            url += '&_pf' + topLocation._pf;
          }
          return url;
        }
      });
    });
})();
