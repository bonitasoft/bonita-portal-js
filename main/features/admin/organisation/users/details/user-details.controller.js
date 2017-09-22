(function () {
  'use strict';

  angular
    .module('org.bonitasoft.features.admin.organisation.users')
    .controller('UserDetailsCtrl', UserDetailsCtrl);

  function UserDetailsCtrl(user, userAPI, growl, gettextCatalog) {
    var vm = this;
    vm.user = user;

    vm.saveGeneralInformation = function (user) {
      /* jshint camelcase: false */
      userAPI.update({
        id: user.id,
        title: user.title,
        firstname: user.firstname,
        lastname: user.lastname,
        userName: user.userName,
        job_title: user.job_title
      }).$promise.then(function () {
        growl.success(gettextCatalog.getString('General information successfully updated'));
      }, function () {
        growl.error(gettextCatalog.getString(
          'General information where not updated. Please retry later or contact an administrator'));
      });
    };
  }

})();
