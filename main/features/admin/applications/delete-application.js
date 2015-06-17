(function () {
  'use strict';

  angular.module('org.bonitasoft.features.admin.applications.delete',
    [
      'ui.bootstrap',
      'org.bonitasoft.common.resources'
    ])
    .controller('deleteApplicationCtrl', ['$scope', 'applicationAPI', '$modalInstance', 'application', function ($scope, applicationAPI, $modalInstance, application) {

      $scope.application = application;

      $scope.confirmDelete = function () {
        applicationAPI.delete({id: $scope.application.id}).$promise.then(function () {
          $modalInstance.close();
        });
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    }]);
})();
