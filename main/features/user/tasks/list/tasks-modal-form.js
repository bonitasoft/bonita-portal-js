(function(){
  'use strict';

  /**
   * Bootstrapp Modal controller for modalForm
   * This component uses bonita-iframe-viewer directive
   */
  angular
    .module('org.bonitasoft.features.user.tasks.modal.form', ['ui.bootstrap.modal'])
    .controller('ModalFormCtrl', [
      'url',
      'task',
      'userId',
      '$modalInstance',

      function( url, task, userId, $modalInstance){
        this.title = task.displayName;
        /* jshint camelcase:false */
        this.isFormEditable = task.assigned_id === userId;
        this.isFormVisible = true;
        this.formUrl = url;

        this.cancel  =  function () {
          $modalInstance.dismiss('abort');
        };
      }
    ]);
})();
