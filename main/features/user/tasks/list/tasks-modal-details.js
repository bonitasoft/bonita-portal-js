(function(){
  'use strict';

  /**
   * Bootstrapp Modal controller for modalDetails
   * This component uses a TaskDetails directive
   */
  angular
    .module('org.bonitasoft.features.user.tasks.modal.details', ['ui.bootstrap.modal'])
    .controller('ModalDetailsCtrl', [
      'url',
      'task',
      'Case',
      'userId',
      'refreshHandler',
      '$modalInstance',

      function( url, task, Case, userId, refreshHandler, $modalInstance){
        this.title = task.displayName;
        this.Case = Case;
        this.task = task;
        this.formUrl = url;
        function onRefreshHandler(){
          refreshHandler();
        }
        this.onRefreshHandler = onRefreshHandler;
        this.userId = userId;

        this.cancel  =  function () {
          $modalInstance.dismiss('abort');
        };

        
      }
    ]);
})();
