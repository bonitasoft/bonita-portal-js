(function () {
  'use strict';

  angular.module('org.bonita.common.directives.bntHref', [])
  .directive('bntHref', ['$window', function ($window) {
    return {
      restrict: 'A',
      scope : {
        bntHref : '@'
      },
      link: function (scope) {
        $window.top.location.href = scope.bntHref;
      }
    };
  }]);
})();
