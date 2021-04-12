(function () {
  'use strict';

  angular
    .module('org.bonitasoft.common.directives.avatar-upload', [])
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
      templateUrl: 'common/directives/avatar-upload/avatar-upload.html'
    };
  }

  function BoAvatarUploadController() {
    var vm = this;

    // User coming from API has an icon field set to 'icons/default/icon_user.png' by default
    vm.hasIcon = function() {
      return vm.iconSrc && vm.iconSrc !== 'icons/default/icon_user.png';
    };

    vm.isUploadedFileTooBig = function () {
      return vm.uploader && !vm.uploader.isUploading && vm.uploader.status === 413;
    };

    vm.hasUploadedFileWrongMimeType = function () {
      return vm.uploader && !vm.uploader.isUploading && vm.uploader.status === 415;
    };
  }

})();
