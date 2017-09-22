(function () {
  'use strict';

  angular
    .module('org.bonitasoft.features.admin.processes.details')
    .controller('DeleteProcessModalInstanceCtrl', DeleteProcessModalInstanceCtrl);

  function DeleteProcessModalInstanceCtrl(processAPI, process, $modalInstance) {
    var vm = this;
    vm.process = process;
    vm.processing = false;

    vm.delete = function () {
      // avoid double click
      if (vm.processing) {
        return;
      }

      vm.processing = true;
      processAPI.delete({id: process.id}).$promise
        .then(function () {
          $modalInstance.close();
          vm.processing = false;
        }, function (error) {
          $modalInstance.dismiss(error);
          vm.processing = false;
        });
    };

    vm.cancel = function () {
      $modalInstance.dismiss();
    };
  }

})();
