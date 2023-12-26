(function() {
  'use strict';

  angular
    .module('org.bonitasoft.common.resources')
    .controller('httpErrorModalCtrl', function ($scope, $modalInstance, messages) {

      $scope.messages = messages;

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };

      $scope.confirm = function () {
        $modalInstance.close();
      };
    });

})();
