(function() {
  'use strict';

  angular
    .module('org.bonitasoft.features.user.tasks.list')
    .config(taskListRoutes);

  function taskListRoutes($stateProvider) {

    $stateProvider
      .state('bonita.userTasks', {
        templateUrl: 'portalTemplates/user/tasks/list/tasks-list.html'
      });
  }

})();
