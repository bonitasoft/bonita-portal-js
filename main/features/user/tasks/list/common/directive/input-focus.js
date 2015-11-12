(function(){
  'use strict';

  /**
   * A simple directive to force focus on input element once page is loaded
   */
  angular
    .module('ui.focus',[])
    .directive('inputFocus', ['$timeout',
      function($timeout) {
        return {
          priority: 10,
          restrict: 'A',
          link: function(scope, elem) {
            $timeout(function(){
              elem[0].focus();
            }, 30, false);
          }
        };
      }
    ]);
})();
