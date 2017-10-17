(function () {
  'use strict';

  angular
    .module('org.bonitasoft.features.admin.organisation.users')
    .directive('boAvatarUpload', boAvatarUpload);

  function boAvatarUpload() {
    return {
      scope: {
        iconSrc: '=',
        uploader: '=',
      },
      replace: true,
      bindToController: true,
      controllerAs: 'vm',
      controller: BoAvatarUploadController,
      templateUrl: 'features/admin/organisation/users/details/general/avatar-upload.html'
    };
  }

  function BoAvatarUploadController() {
    var vm = this;

    // User coming from API has an icon field set to 'icons/default/icon_user.png' by default
    vm.hasIcon = function() {
      return vm.iconSrc && vm.iconSrc !== 'icons/default/icon_user.png';
    };
  }

})();
