(function () {
  'use strict';

  angular
    .module('org.bonitasoft.features.user.tasks.list')
    .config(taskListRoutes);

  function taskListRoutes($stateProvider) {
    $stateProvider.state('bonita.userTasks', {
      url: '/user/tasks/list',
      templateUrl: 'portalTemplates/user/tasks/list/tasks-list.html'
    });
  }

})();
