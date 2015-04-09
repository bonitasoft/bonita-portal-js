/* jshint sub:true */
(function() {
  'use strict';

  var processMenuCtrl = ProcessMenuCtrl;
  processMenuCtrl.prototype.retrieveProcess = retrieveProcess;
  processMenuCtrl.prototype.retrieveCategories = retrieveCategories;
  processMenuCtrl.prototype.retrieveParameters = retrieveParameters;
  var informationStateName = 'bonita.processesDetails.information';
  var paramsStateName = 'bonita.processesDetails.params';
  var processConnectorsStateName = 'bonita.processesDetails.processConnectors';
  var actorsMappingStateName = 'bonita.processesDetails.actorsMapping';

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
    'org.bonitasoft.features.admin.processes.details.processConnectors',
    'org.bonitasoft.features.admin.processes.details.params'
  ]).value('menuContent', [{
    name: 'General',
    link: '',
    state: informationStateName
  }, {
    name: 'Actor Mapping',
    link: 'actorsMapping',
    state: actorsMappingStateName
  }, {
    name: 'Parameters',
    link: 'params',
    state: paramsStateName
  }, {
    name: 'Connectors',
    link: 'connectors',
    state: processConnectorsStateName
  }])
    .config(
      function($stateProvider) {
        $stateProvider.state('bonita.processesDetails', {
          url: '/admin/processes/details/:processId',
          templateUrl: 'features/admin/processes/details/menu.html',
          abstract: true,
          controller: 'ProcessMenuCtrl',
          controllerAs: 'processMenuCtrl',
          resolve: {
            process: retrieveProcess
          }
        }).state(informationStateName, {
          url: '',
          templateUrl: 'features/admin/processes/details/information.html',
          controller: 'ProcessInformationCtrl',
          controllerAs: 'processInformationCtrl',
          resolve: {
            categories: retrieveCategories
          }
        }).state(paramsStateName, {
          url: '/params',
          templateUrl: 'features/admin/processes/details/params.html',
          controller: 'ProcessParamsCtrl',
          controllerAs: 'processParamsCtrl',
          resolve: {
            parameters : retrieveParameters
          }
        }).state(processConnectorsStateName, {
          url: '/connectors',
          templateUrl: 'features/admin/processes/details/process-connectors.html',
          controller: 'ProcessConnectorsCtrl',
          controllerAs: 'processConnectorsCtrl'
        }).state(actorsMappingStateName, {
          url: '/actorsMapping',
          templateUrl: 'features/admin/processes/details/actors-mapping.html',
          controller: 'ActorsMappingCtrl',
          controllerAs: 'actorsMappingCtrl'
        });
      }
  )
    .controller('ProcessMenuCtrl', processMenuCtrl)
    .controller('DeleteProcessModalInstanceCtrl', DeleteProcessModalInstanceCtrl);

  /* jshint -W003 */
  function ProcessMenuCtrl($scope, menuContent, process, processAPI, $modal, $stateParams, $state) {
    var vm = this;
    vm.getCurrentStateName = function() {
      return $state.current.name;
    };
    vm.menuContent = menuContent;
    vm.process = process;
    vm.toggleProcessActivation = toggleProcessActivation;
    vm.refreshProcess = refreshProcess;
    vm.deleteProcess = deleteProcess;

    $scope.$on('button.toggle', vm.toggleProcessActivation);
    $scope.$on('process.refresh', vm.refreshProcess);

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

    function refreshProcess() {
      retrieveProcess(processAPI, $stateParams).$promise.then(function(updatedProcess) {
        process.configurationState = updatedProcess.configurationState;
      });
    }

    function toggleProcessActivation(event, args) {
      var state = args.value ? 'ENABLED' : 'DISABLED';
      processAPI.update({
        id: process.id,
        activationState: state
      }).$promise.then(function() {
        process.activationState = state;
      }, function TODOmanageerror() {

      });
    }
  }

  function DeleteProcessModalInstanceCtrl($scope, processAPI, process, $modalInstance, manageTopUrl) {
    var vm = this;
    vm.process = process;

    vm.delete = function() {
      processAPI.delete({
        id: process.id
      }).$promise.then(function() {
        manageTopUrl.goTo({
          token: 'processlistingadmin'
        });
        $modalInstance.close();
      }, function TODOmanageerror() {

      });
    };
    vm.cancel = function() {
      $modalInstance.dismiss();
    };
  }



  function retrieveProcess(processAPI, $stateParams) {
    return processAPI.get({
      id: $stateParams.processId,
      d: ['deployedBy'],
      n: ['openCases', 'failedCases']
    });
  }

  function retrieveCategories(store, categoryAPI, $stateParams) {
    return store.load(categoryAPI, {
      f: ['id=' + $stateParams.processId]
    });
  }

  function retrieveParameters(store, parameterAPI, $stateParams) {
    return store.load(parameterAPI, {
      f: ['process_id=' + $stateParams.processId],
      o: ['name ASC']
    });
  }
})();