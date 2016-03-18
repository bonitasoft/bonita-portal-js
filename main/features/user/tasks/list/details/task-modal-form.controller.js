(function() {
  'use strict';

  /**
   * Bootstrapp Modal controller for modalForm
   * This component uses bonita-iframe-viewer directive
   */
  angular
    .module('org.bonitasoft.features.user.tasks.details')
    .controller('ModalFormCtrl', ModalFormCtrl);

  function ModalFormCtrl(url, task, userId, $modalInstance, formMappingAPI) {
    this.task = task;
    this.title = task.displayName;
    /* jshint camelcase:false */
    this.isFormEditable = task.assigned_id === userId;
    this.isFormVisible = true;
    this.formUrl = url;

    this.hasForm = false;

    //Check if the task has a form
    if ('USER_TASK' === task.type) {
      this.hasForm = true;
      formMappingAPI.search({
        p: 0,
        c: 1,
        f: ['processDefinitionId=' + task.processId, 'task=' + task.name, 'type=TASK']
      }).$promise.then(function(results) {
          if (results.resource.pagination.total > 0 && results.data[0].target === 'NONE') {
            this.hasForm = false;
          }
        }.bind(this));
    }

    this.cancel = function() {
      $modalInstance.dismiss('abort');
    };
  }

})();
