(function () {
  'use strict';

  angular
    .module('org.bonitasoft.features.admin.organisation.users')
    .directive('boPassword', boPassword);

  function boPassword() {
    return {
      scope: {
        onUpdate: '=',
        errors : '='
      },
      bindToController: true,
      controllerAs: 'vm',
      controller: BoPasswordCtrl,
      templateUrl: 'features/admin/organisation/users/details/password/password.html'
    };
  }

  function BoPasswordCtrl() {
    var vm = this;
    vm.password = {};
    vm.invalid = false;

    vm.update = function(password) {
      if (!password.new) {
        return;
      }

      if (password.new !== password.confirm) {
        vm.invalid = true;
        return;
      }

      vm.onUpdate(password);
      vm.resetValidity();
    };

    vm.resetValidity = function() {
      vm.invalid = false;
    };
  }

})();
