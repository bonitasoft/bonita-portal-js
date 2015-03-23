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
    'org.bonitasoft.common.resources',
    'com.bonitasoft.features.admin.processes.details.information'
  ]).value('menuContent', [
    {name:'Information', link: ''},
    {name:'Configuration'},
    {name:'Actor Mapping', link: '/actorsMapping', submenu : true},
    {name:'Params', link: '/params', submenu : true},
    {name:'Connectors', link: '/connectors', submenu : true}
    ])
    .config(
      function($stateProvider) {
        $stateProvider.state('bonita.processesDetails', {
          url: '/admin/processes/details/:processId',
          templateUrl: 'features/admin/processes/details/menu.html',
          abstract: true,
          controller: 'processMenuCtrl',
          controllerAs: 'ctrl',
          resolve: {
            process : function(processAPI, $stateParams) {
              return processAPI.get({id:$stateParams.processId});
            }
          }
        }).state('bonita.processesDetails.information', {
          url: '',
          templateUrl: 'features/admin/processes/details/information.html',
          controller: 'processInformationCtrl',
          controllerAs : 'ctrl'
        });
      }
    )
    .controller('processMenuCtrl',
      function($scope, menuContent, process) {
        var vm  = this;
        vm.menuContent = menuContent;
        vm.process = process;
      }
    );
})();
