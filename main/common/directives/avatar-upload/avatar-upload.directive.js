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
        itemId: '=',
        apiToCall: '=',
        successFunction: '='
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
    vm.deleteError = undefined;

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

    vm.didServerErrorOccur = function () {
      return (vm.uploader && !vm.uploader.isUploading && vm.uploader.status === 500) ||
             (vm.deleteError && vm.deleteError.status === 500);
    };

    vm.isItemNotFound = function () {
      return vm.deleteError && vm.deleteError.status === 404;
    };

    vm.deleteIcon = function() {
      var model = {
        id: vm.itemId
      };
      vm.apiToCall.delete(model)
        .then(vm.successFunction)
        .catch(function(error) {
          vm.deleteError = error;
        });
    };
  }

})();
