(function () {
  'use strict';

  angular
    .module('org.bonitasoft.features.admin.processes.details')
    .controller('DeleteProcessModalInstanceCtrl', DeleteProcessModalInstanceCtrl);

  function DeleteProcessModalInstanceCtrl(processAPI, process, $modalInstance) {
    var vm = this;
    vm.process = process;

    vm.delete = function () {
      processAPI.delete({id: process.id}).$promise
        .then(function () {
          $modalInstance.close();
        }, function (error) {
          $modalInstance.dismiss(error);
        });
    };

    vm.cancel = function () {
      $modalInstance.dismiss();
    };
  }

})();
