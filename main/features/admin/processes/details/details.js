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
    'org.bonitasoft.features.admin.processes.details.information',
    'org.bonitasoft.features.admin.processes.details.actorMapping'
  ]).value('menuContent', [{
    name: 'Information',
    link: ''
  }, {
    name: 'Configuration'
  }, {
    name: 'Actor Mapping',
    link: 'actorsMapping',
    submenu: true
  }, {
    name: 'Params',
    link: 'params',
    submenu: true
  }, {
    name: 'Connectors',
    link: 'connectors',
    submenu: true
  }, {
    name: 'Categories',
    link: 'categories'
  }])
    .config(
      function($stateProvider) {
        $stateProvider.state('bonita.processesDetails', {
          url: '/admin/processes/details/:processId',
          templateUrl: 'features/admin/processes/details/menu.html',
          abstract: true,
          controller: 'processMenuCtrl',
          controllerAs: 'ctrl',
          resolve: {
            process: function(processAPI, $stateParams) {
              return processAPI.get({
                id: $stateParams.processId,
                d: ['deployedBy'],
                n:['openCases', 'failedCases']
              });
            }
          }
        }).state('bonita.processesDetails.information', {
          url: '',
          templateUrl: 'features/admin/processes/details/information.html',
          controller: 'processInformationCtrl',
          controllerAs: 'processInformationCtrl'
        }).state('bonita.processesDetails.params', {
          url: '/params',
          templateUrl: 'features/admin/processes/details/params.html',
          controller: 'processParamsCtrl',
          controllerAs: 'processParamsCtrl'
        });
      }
  )
    .controller('processMenuCtrl',
      function($scope, menuContent, process, processAPI) {
        var vm = this;
        vm.menuContent = menuContent;
        vm.process = process;

        $scope.$on('button.toggle', function(event, args) {
          console.log('button.toggle', args);
          var state = args.value?'ENABLED':'DISABLED';
          processAPI.update({id: process.id, activationState: state});
          process.activationState = state;
        });

      }
  );
})();
