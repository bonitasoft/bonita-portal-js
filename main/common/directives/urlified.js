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

(function () {
  'use strict';
  angular.module('org.bonitasoft.common.directives.urlified', ['org.bonitasoft.common.filters.urlify']).directive('urlified', function ($filter) {
    return{
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModelCtrl) {
        scope.doGetTextCursorPosition = function doGetTextCursorPosition(element) {
          // Initialize
          var iCaretPos = 0;
           // IE Support
          if (document.selection) {
            // Set focus on the element
            element.focus ();
            // To get cursor position, get empty selection range
            var oSel = document.selection.createRange ();
            // Move selection start to 0 position
            oSel.moveStart ('character', -element.value.length);
            // The caret position is selection length
            iCaretPos = oSel.text.length;
          }
          // Firefox support
          else if (element.selectionStart || element.selectionStart === '0' || element.selectionStart === 0){
            iCaretPos = element.selectionStart;
          }else if (element.setSelectionRange){
            iCaretPos = element.selectionStart;
          }
          // Return results
          return (iCaretPos);
        };

        scope.doSetTextCursorPosition = function setCaretPosition(ctrl, pos){
          if(ctrl.setSelectionRange){
            ctrl.focus();
            ctrl.setSelectionRange(pos,pos);
          }else if(ctrl.createTextRange){
            var range = ctrl.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
          }
        };
        scope.$watch(attrs.ngModel, function () {
          ngModelCtrl.$setViewValue($filter('urlify')(scope.$eval(attrs.ngModel)));
          var carretPosition = scope.doGetTextCursorPosition(element[0]);
          ngModelCtrl.$render();
          scope.doSetTextCursorPosition(element[0],carretPosition);
        });
      }
    };
  });
})();
