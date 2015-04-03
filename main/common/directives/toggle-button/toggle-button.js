(function() {
  'use strict';
  angular.module('org.bonitasoft.common.directives.toggleButton', []).directive('toggleButton', function() {
    // Runs during compile
    return {
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      template: '<input type="checkbox">',
      replace: true,
      link: function(scope, iElm, iAttrs) {
        iElm.prop('checked', iAttrs.initialState === 'true');
        iElm.bootstrapToggle({
          on: iAttrs.on || 'on',
          off: iAttrs.off || 'off',
          style: iAttrs.style || 'bonita-toggle',
          height : iAttrs.height || '25px'
        });
        iElm.change(function() {
          scope.$apply();
        });
        scope.$watch(function() {
          return iElm.prop('checked');
        }, function(newVal, oldVal) {
          if (oldVal !== newVal) {
            scope.$emit('button.toggle', {
              value: iElm.prop('checked')
            });
          }
        });
      }
    };
  });
})();