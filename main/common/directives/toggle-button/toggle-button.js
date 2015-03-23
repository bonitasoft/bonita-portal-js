(function() {
  'use strict';
  angular.module('org.bonitasoft.directives.toggleButton', []).directive('toggleButton', function() {
    // Runs during compile
    return {
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      template: '<input type="checkbox">',
      replace: true,
      link: function(scope, iElm, iAttrs) {
        scope.properties = {
          enabled: true
        };

        iElm.prop('checked', !!scope.properties.enabled);
        iElm.bootstrapToggle({
          on: iAttrs.on || 'on',
          off: iAttrs.off || 'off'
        });
        iElm.change(function() {
          scope.$apply();
        });
        scope.$watch(function() {
          return iElm.prop('checked');
        }, function() {
          scope.properties.enabled = !scope.properties.enabled;
          console.log(scope.properties.enabled);
        });
      }
    };
  });
})();