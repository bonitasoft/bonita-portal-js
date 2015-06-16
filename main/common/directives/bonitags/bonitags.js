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
  /**
  * org.bonitasoft.common.directies.bonitags Module
  *
  * manage tags within a directive
  */
  angular.module('org.bonitasoft.common.directives.bonitags', []).directive('bonitags', function($timeout){
    // Runs during compile
    return {
      scope: {
        tagsSuggestion: '=',
        tagsSelection: '='
      }, // {} = isolate, true = child, false/undefined = no change
      // controller: function($scope, $element, $attrs, $transclude) {},
      restrict: 'E',
      template: '<div class="bootstrap-tags"></div>',
      // templateUrl: '',
      replace: true,
      link: function($scope, iElm, iAttrs) {
        var iTags;
        $timeout(function() {
          iTags = iElm.tags({
              readOnly: iAttrs.readOnly === '' || iAttrs.readOnly === 'true',
              tagData: $scope.tagsSelection,
              suggestions: $scope.tagsSuggestion,
              tagClass: iAttrs.tagClass || 'label-default',
              promptText: ' ',
              readOnlyEmptyMessage: ' '
            });
          $scope.$watch('tagsSelection', refreshTags, true);
        }, 0);
        /* jshint -W003 */
        function refreshTags(){
          if(iTags && iTags.readOnly) {
            iTags.renderReadOnly();
          }
        }
      }
    };
  });
})();
