(function() {
  'use strict';

  angular
    .module('org.bonitasoft.features.user.tasks.list.comments')
    .directive('scrollBottom', function ($timeout) {
    return {
      scope: {
        scrollBottom: '='
      },
      link: function ($scope, $element) {
        $scope.$watch('scrollBottom.length', function (newValue) {
          if (newValue) {
            $timeout(function(){
              $element.scrollTop($element[0].scrollHeight);
            }, 0);
          }
        });
      }
    };
  });

})();
