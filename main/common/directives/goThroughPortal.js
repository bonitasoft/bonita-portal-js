(function () {
  'use strict';

  function Url(base) {
    this.base = base;
    this.query = {};
    this.hash = {};
  }

  Url.prototype.toString = function () {
    var url = this.base;

    function append(prefix, parameters) {
      url += prefix;
      angular.forEach(parameters, function (value, key) {
        if (value) {
          url += key + '=' + value + '&';
        }
      });
      // remove unnecessary prefix or & from the end of the url
      url = url.slice(0, -1);
    }

    append('?', this.query);
    append('#', this.hash);
    return url;
  };

  angular.module('org.bonita.common.directives.goThroughPortal', ['org.bonita.services.navigation'])

    .directive('goThroughPortal', function (topLocation) {
      return {
        restrict: 'A',
        scope: {
          location: '=goThroughPortal'
        },
        link: function (scope, element, attrs) {
          if (!scope.location._p) {
            throw new Error('_p should be defined');
          }

          var url = new Url('../portal/homepage');
          url.query.tenant = topLocation.tenant;
          url.hash._pf = topLocation._pf;

          url.hash._p = scope.location._p;
          url.hash[scope.location._p + '_id'] = scope.location.id;
          url.hash[scope.location._p + '_tab'] = scope.location.tab;

          attrs.$set('href', url.toString());
          attrs.$set('target', '_top');
        }
      };
    });
})();
