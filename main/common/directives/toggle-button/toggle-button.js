(function() {
  'use strict';
  angular.module('org.bonitasoft.common.directives.toggleButton', []).directive('toggleButton', function() {
    // Runs during compile
    return {
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      template: '<input type="checkbox">',
      scope : {
        enabled : '='
      },
      replace: true,
      link: function(scope, iElm, iAttrs) {
        iElm.prop('checked', !!scope.enabled);
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
          scope.enabled = iElm.prop('checked');
        });
      }
    };
  });
})();