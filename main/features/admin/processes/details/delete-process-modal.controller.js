(function () {
  'use strict';

  angular
    .module('org.bonitasoft.features.admin.processes.details')
    .controller('DeleteProcessModalInstanceCtrl', DeleteProcessModalInstanceCtrl);

  function DeleteProcessModalInstanceCtrl(process, $modalInstance) {
    var vm = this;
    vm.process = process;

    vm.delete = function () {
      $modalInstance.close(process);
    };

    vm.cancel = function () {
      $modalInstance.dismiss();
    };
  }

})();
