(function () {
  'use strict';

  angular.module('org.bonita.common.directives.urlified', ['org.bonita.common.filters.urlify']).directive('urlified', function ($filter) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModelCtrl) {
        scope.$watch(attrs.ngModel, function () {
          ngModelCtrl.$setViewValue($filter('urlify')(scope.$eval(attrs.ngModel)));
          ngModelCtrl.$render();
        });
      }
    };
  });
})();
