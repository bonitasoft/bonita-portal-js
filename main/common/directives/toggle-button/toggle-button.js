/**
 * Copyright (C) 2015 Bonitasoft S.A.
 * Bonitasoft, 32 rue Gustave Eiffel - 38000 Grenoble
 * This library is free software; you can redistribute it and/or modify it under the terms
 * of the GNU Lesser General Public License as published by the Free Software Foundation
 * version 2.1 of the License.
 * This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public License along with this
 * program; if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth
 * Floor, Boston, MA 02110-1301, USA.
 */

(function() {
  'use strict';
  angular.module('org.bonitasoft.common.directives.toggleButton', []).directive('toggleButton', function() {
    // Runs during compile
    return {
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      template: '<input type="checkbox">',
      scope: {
        enableToggle: '='
      },
      replace: true,
      link: function(scope, iElm, iAttrs) {
        iElm.prop('checked', iAttrs.initialState === 'true');
        iElm.bootstrapToggle({
          on: iAttrs.on || 'on',
          off: iAttrs.off || 'off',
          style: iAttrs.style || 'bonita-toggle',
          height: iAttrs.height || '25px'
        });
        if(scope.enableToggle){
          iElm.bootstrapToggle('enable');
        } else {
          iElm.bootstrapToggle('disable');
        }
        iElm.change(scope.$apply);
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
