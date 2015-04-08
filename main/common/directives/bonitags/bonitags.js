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
        tagsSuggestion : '=',
        tagsSelection : '='
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
              readOnly : iAttrs.readOnly ==='' || iAttrs.readOnly === 'true',
              tagData: $scope.tagsSelection,
              suggestions: $scope.tagsSuggestion,
              tagClass : iAttrs.tagClass || 'label-default',
              promptText : ' ',
              readOnlyEmptyMessage : ' '
            });
          $scope.$watch('tagsSelection', refreshTags, true);
        }, 0);

        /* jshint -W003 */
        function refreshTags(){
          if(iTags && iTags.readOnly) { iTags.renderReadOnly(); }
        }
      }
    };
  });
})();
