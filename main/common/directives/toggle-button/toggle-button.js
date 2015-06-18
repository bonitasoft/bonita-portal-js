/** Copyright (C) 2015 Bonitasoft S.A.
 * BonitaSoft, 31 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
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
