(function() {
  'use strict';

  angular
    .module('org.bonitasoft.features.admin.applications')
    .controller('importApplicationCtrl', ImportApplicationCtrl);

  function ImportApplicationCtrl($scope, $modalInstance, FileUploader, importApplication) {

    var self = this;

    /**
     * Callback on uploadSuccess
     * @param  {FileObject} fileItem
     * @param  {String} page     API return
     * @return {void}
     */
    self.successUpload = function successUpload(fileItem, page) {

      fileItem = fileItem || {file: {}};

      $scope.isUploadSuccess = true;
      $scope.fileName = fileItem.file.name;
      $scope.filePath = page || '';
    };

    /**
     * Cannot upload the file
     * @throws {Error} If Cannot upload the file
     * @return {void}
     */
    self.errorUpload = function errorUpload() {
      throw new Error('Cannot upload the file');
    };

    $scope.uploader = new FileUploader({
      autoUpload: true,
      url: '../portal/applicationsUpload',
      onSuccessItem: self.successUpload,
      onErrorItem: self.errorUpload
    });

    /**
     * Import an application
     * @return {void}
     */
    this.importApp = function importApp() {
      importApplication
        .save({
          importPolicy: 'FAIL_ON_DUPLICATES',
          // Fix for IE9. The best browser in da world add pre tag around the string.
          applicationsDataUpload: $scope.filePath.replace('<pre>', '').replace('</pre>', '')
        })
        .$promise.then(successImportCb, errorImportCb);
    };

    function successImportCb(data) {
      $scope.importIsSuccessfull = true;
      $scope.totalImportedApps = data.imported.length;
      $scope.imports = data.imported;
      $scope.errorsApi = data.errors;
    }

    function errorImportCb(res) {
      $scope.importNotSuccessfull = true;
      $scope.messageError = res.data.message;
    }

    /**
     * Close da modal
     * @return {void}
     */
    this.cancel = function cancel() {
      $modalInstance.dismiss('cancel');
    };

    /**
     * Close da modal
     * @return {void}
     */
    this.closeModalSuccess = function closeModalSuccess() {
      $modalInstance.close();
    };
  }

})();
