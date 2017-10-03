(function () {
  'use strict';

  angular
    .module('org.bonitasoft.features.admin.organisation.users')
    .controller('UserDetailsCtrl', UserDetailsCtrl);

  function UserDetailsCtrl(user) {
    var vm = this;
    vm.user = user;
  }

})();
