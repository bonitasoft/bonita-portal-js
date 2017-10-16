(function () {
  'use strict';

  angular
    .module('org.bonitasoft.features.admin.organisation.users')
    .directive('boManagerField', boManagerField);

  function boManagerField() {
    return {
      scope: {
        manager: '=selected',
        onType: '=',
      },
      replace: true,
      bindToController: true,
      controllerAs: 'vm',
      controller: BoManagerFieldController,
      templateUrl: 'features/admin/organisation/users/details/general/manager-field.html'
    };
  }

  function BoManagerFieldController() {
    var vm = this;

    vm.formatLabel = function (user) {
      if (!user) {
        return '';
      }
      return user.firstname + ' ' + user.lastname + ' (' + user.userName + ')';
    };

    vm.searchManagers = function (viewvalue) {
      return vm.onType(viewvalue);
    };
  }

})();
