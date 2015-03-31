/* jshint sub:true */
(function() {
  'use strict';

  var processMenuCtrl = ProcessMenuCtrl;
  processMenuCtrl.prototype.retrieveProcess = retrieveProcess;

  angular.module('org.bonitasoft.features.admin.processes.details', [
    'ui.router',
    'ui.bootstrap',
    'gettext',
    'org.bonitasoft.services.topurl',
    'org.bonitasoft.common.directives.bonitaHref',
    'org.bonitasoft.common.directives.toggleButton',
    'org.bonitasoft.common.resources',
    'org.bonitasoft.features.admin.processes.details.actorMapping',
    'org.bonitasoft.features.admin.processes.editActorMembers',
    'org.bonitasoft.services.topurl',
    'org.bonitasoft.features.admin.processes.details.information',
    'org.bonitasoft.features.admin.processes.details.categories'
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
          controllerAs: 'processMenuCtrl',
          resolve: {
            process: retrieveProcess
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
        }).state('bonita.processesDetails.categories', {
          url: '/categories',
          templateUrl: 'features/admin/processes/details/categories.html',
          controller: 'ProcessCategoriesCtrl',
          controllerAs: 'processCategoriesCtrl'
        });
      }
  )
    .controller('processMenuCtrl', processMenuCtrl
      
  ).controller('DeleteProcessModalInstanceCtrl', DeleteProcessModalInstanceCtrl);

  /* jshint -W003 */
  function ProcessMenuCtrl($scope, menuContent, process, processAPI, $modal) {
    var vm = this;
    vm.menuContent = menuContent;
    vm.process = process;
    vm.toogleProcessActivation = toogleProcessActivation;
    vm.deleteProcess = deleteProcess;

    $scope.$on('button.toggle', toogleProcessActivation);
    
    function deleteProcess() {
      $modal.open({
        templateUrl: 'features/admin/processes/details/delete-process-modal.html',
        controller: 'DeleteProcessModalInstanceCtrl',
        controllerAs: 'deleteProcessModalInstanceCtrl',
        size: 'sm',
        resolve: {
          process: function() {
            return process;
          }
        }
      });
    }

    function toogleProcessActivation(event, args) {
      var state = args.value?'ENABLED':'DISABLED';
      processAPI.update({id: process.id, activationState: state}).$promise.then(function(){
        process.activationState = state;
      }, function TODOmanageerror() {

      });
    }
  }

  function DeleteProcessModalInstanceCtrl($scope, processAPI, process, $modalInstance, manageTopUrl) {
    var vm = this;
    vm.process = process;
    
    vm.delete = function() {
      processAPI.delete({id: process.id}).$promise.then(function(){
        manageTopUrl.goTo({token:'processlistingadmin'});
        $modalInstance.close();
      }, function TODOmanageerror() {

      });
    };
    vm.cancel = function(){
      $modalInstance.dismiss();
    };
  }


  function retrieveProcess(processAPI, $stateParams) {
    return processAPI.get({
      id: $stateParams.processId,
      d: ['deployedBy'],
      n:['openCases', 'failedCases']
    });
  }
})();
