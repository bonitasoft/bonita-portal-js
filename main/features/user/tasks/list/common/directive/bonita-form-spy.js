(function(){
  'use strict';

  /**
   * Iframe spy
   * This directive handle bonita form communication through the postMessage API
   * After receiving a message, the directive will trigger
   * the spySubmit handler, passing the message's content.
   *
   * the bonita form page will emit 2 kinds of messages
   * - success : message content will be the id of the submit button
   * - error : the message content will start with error: and contains an i18n error key
   */
  angular
    .module('ui.iframe.spy', [])
    .directive('formSpy', ['$window', '$timeout', function($window, $timeout){
      return {
        scope: {
          'spySubmit':'&'
        },
        restrict: 'A',
        link: function($scope) {
          angular.element($window.top).on('message', function(event){
            $timeout(function(){
              $scope.spySubmit({message:event.data});
            });
          });
        }
      };
    }
  ]);
})();
