(function () {

  'use strict';

  angular
    .module('org.bonitasoft.features.user.tasks.list')
    .config(routes);

  function routes($urlRouterProvider) {
    $urlRouterProvider.when('/user/tasks/list', function ($state) {
      $state.go('bonita.userTasks');
    })
  }

})();
