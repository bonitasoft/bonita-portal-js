/* jshint sub:true */
(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.details', [
    'ui.router',
    'ui.bootstrap',
    'gettext',
    'org.bonitasoft.services.topurl',
    'org.bonitasoft.common.directives.bonitaHref',
    'org.bonitasoft.common.directives.toggleButton',
    'org.bonitasoft.common.resources'
  ])
    .config(
      function($stateProvider) {
        $stateProvider.state('bonita.processesDetails', {
          url: '/admin/processes/details/:processId',
          templateUrl: 'features/admin/processes/details/menu.html',
          //abstract: true,
          controller: 'processMenuCtrl',
          controllerAs: 'ctrl'
        }).state('bonita.processesDetails.information', {
          url: '/information',
          /*views: {
            'case-list': {
              templateUrl: 'features/admin/cases/list/cases-list.html',
              controller: 'ActiveCaseListCtrl',
              controllerAs : 'caseCtrl'
            }
          }*/
        });
      }
    )
    .controller('processMenuCtrl',
      function($scope) {
        $scope.enabled = true;
        //process.get()
      }
    );
})();
