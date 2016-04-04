(function() {
  'use strict';

  angular
    .module('org.bonitasoft.features.user.tasks.details')
    .controller('TaskDetailsPopupCtrl', TaskDetailsPopupCtrl);

  function TaskDetailsPopupCtrl($modalInstance, taskListStore, updateCount) {

    this.currentTask = taskListStore.currentTask;
    this.currentCase = taskListStore.currentCase;
    this.updateCount = updateCount;

    this.cancel = function() {
      $modalInstance.dismiss('abort');
    };
  }

})();
