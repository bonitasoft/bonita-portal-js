(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.details.editConnectorImplementation', [
    'ui.bootstrap',
    'ui.router',
    'angular-growl',
    'org.bonitasoft.bonitable',
    'org.bonitasoft.bonitable.selectable',
    'org.bonitasoft.bonitable.repeatable',
    'org.bonitasoft.bonitable.sortable',
    'org.bonitasoft.bonitable.settings',
    'org.bonitasoft.common.resources.store',
    'xeditable'
  ])
    .controller('EditConnectorImplementationCtrl', function($scope, $modalInstance, store, processConnectorAPI, process, processConnector, FileUploader) {
      var self = this;
      self.scope = $scope;
      console.log('controller',processConnector);
      var growlOptions = {
        ttl: 3000,
        disableCountDown: true,
        disableIcons: true
      }; 
      var mappedIds = [];
      /**
       * Callback on uploadSuccess
       * @param  {FileObject} fileItem
       * @param  {String} page     API return
       * @return {void}
       */
      self.successUpload = function successUpload(fileItem, page) {

        fileItem = fileItem || {file:{}};

        $scope.isUploadSuccess = true;
        $scope.fileName        = fileItem.file.name;
        $scope.filePath        = page || '';
      };

      /**
       * Cannot upload the file
       * @throws {Error} If Cannot upload the file
       * @return {void}
       */
      self.errorUpload = function errorUpload() {
        throw new Error('Cannot upload the file');
      };

      //init uploader
      $scope.uploader = new FileUploader({
        autoUpload: true,
        url: '/bonita/portal/fileUpload',
        onSuccessItem: self.successUpload,
        onErrorItem: self.errorUpload
      });

      self.saveDefinition = function saveDefinition(){
        console.log(processConnector);
        processConnectorAPI.update({
          id:process.id+'/'+processConnector.definition_id+'/'+processConnector.definition_version,
          process_id: process.id,
          definition_id: processConnector.definition_id,
          definition_version: processConnector.definition_version,
          implementation: $scope.fileName
        });
      };

      self.closeModal = function closeModal() {
        $modalInstance.close();
      };

    });
})();