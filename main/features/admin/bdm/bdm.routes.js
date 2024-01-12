(function () {

  'use strict';

  angular
    .module('org.bonitasoft.features.admin.bdm')
    .config(routes);

  function routes($stateProvider) {
    $stateProvider
      .state('bonita.bdmInstall', {
        url: '/admin/bdm',
        templateUrl: 'features/admin/bdm/bdm.html',
        controller: 'bdmCtrl',
        controllerAs: 'vm'
      });
  }
})();
