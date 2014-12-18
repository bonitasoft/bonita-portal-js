(function() {
  'use strict';

  angular.module('org.bonita.common.directives.bonitaHref', ['org.bonita.services.topurl'])

  .directive('bonitaHref', ['manageTopUrl',
    function(manageTopUrl) {
      return {
        restrict: 'A',
        scope: {
          destination: '=bonitaHref'
        },
        link: function($scope, element) {
          //we do not override ngClick value in case
          element.bind('click', function() {
            $scope.$apply(function() {
              manageTopUrl.goTo($scope.destination);
            });
          });
        }
      };
    }
  ]);
})();
