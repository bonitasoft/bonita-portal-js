(function() {
  'use strict';

  angular.module('org.bonitasoft.features.user.tasks.list',[
    'org.bonitasoft.features.user.tasks.app',
    'org.bonitasoft.features.user.tasks.filter',
    'org.bonitasoft.features.user.tasks.list.table',
    'org.bonitasoft.features.user.tasks.details',
    'ui.bootstrap.tpls',
    'org.bonitasoft.templates',
    'org.bonitasoft.portalTemplates',
    'common.security',
    'org.bonitasoft.features.user.tasks.app.config'
  ])
  .config(function($stateProvider) {
    $stateProvider.state('bonita.userTasks', {
      url: '/user/tasks/list',
      templateUrl: 'portalTemplates/user/tasks/list/tasks-list.html',
      controller: 'TaskUserListCtrl',
      controllerAs: 'taskUserListCtrl'
    });
  });
})();
