(function() {
  'use strict';

  /**
   * Attach a custom click event to a button, it provides routing for iframe too.
   */
  angular.module('org.bonitasoft.common.directives.bonitaHref', ['org.bonitasoft.services.topurl'])
  .directive('bonitaHref', ['manageTopUrl',
    function(manageTopUrl) {
      return {
        restrict: 'A',
        link: function(scope, element, attr) {
          //we do not override ngClick value in case
          element.bind('click', function() {
            manageTopUrl.goTo(scope.$eval(attr.bonitaHref));
          });
        }
      };
    }
  ]);
})();
