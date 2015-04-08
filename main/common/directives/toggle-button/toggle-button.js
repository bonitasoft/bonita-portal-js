(function() {
  'use strict';
  angular.module('org.bonitasoft.common.directives.toggleButton', []).directive('toggleButton', function() {
    // Runs during compile
    return {
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      template: '<input type="checkbox">',
      scope : {
        enableToggle : '='
      },
      replace: true,
      link: function(scope, iElm, iAttrs) {
        iElm.prop('checked', iAttrs.initialState === 'true');
        iElm.bootstrapToggle({
          on: iAttrs.on || 'on',
          off: iAttrs.off || 'off',
          style: iAttrs.style || 'bonita-toggle',
          height : iAttrs.height || '25px',
        });
        if(scope.enableToggle){
          iElm.bootstrapToggle('enable');
        } else {
          iElm.bootstrapToggle('disable');
        }
        iElm.change(function() {
          scope.$apply();
        });
        scope.$watch('enableToggle', function(newValue, oldValue) {
          if(newValue !== oldValue){
            if(newValue){
              iElm.bootstrapToggle('enable');
            } else {
              iElm.bootstrapToggle('disable');
            }
          }
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