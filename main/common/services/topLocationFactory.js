(function () {
  'use strict';

  function grab(regexp) {
    return {
      from: function (context) {
        context = context || '';
        var matches = context.match(regexp);
        return matches && matches[1] || undefined;
      }
    };
  }

  angular.module('org.bonita.services.navigation', [])

    .factory('topLocation', function topLocationFactory($window) {
      return Object.create({}, {
        _pf: {
          get: function () {
            return grab(/_pf=([1-9]*)/).from($window.top.location.hash);
          }
        },
        tenant: {
          get: function () {
            return grab(/tenant=([1-9]*)/).from($window.top.location.search);
          }
        }
      });
    });
})();
