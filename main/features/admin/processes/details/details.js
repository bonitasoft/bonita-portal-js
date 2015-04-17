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
    name: 'Actors',
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
            process: ['processAPI', '$stateParams', retrieveProcess],
            processResolutionProblems : ['store', 'processResolutionProblemAPI', '$stateParams', retrieveProcessResolutionProblem]
          }
        }).state(informationStateName, {
          url: '',
          templateUrl: 'features/admin/processes/details/information.html',
          controller: 'ProcessInformationCtrl',
          controllerAs: 'processInformationCtrl',
          resolve: {
            categories: ['store', 'categoryAPI', '$stateParams', retrieveCategories]
          }
        }).state(paramsStateName, {
          url: '/params',
          templateUrl: 'features/admin/processes/details/params.html',
          controller: 'ProcessParamsCtrl',
          controllerAs: 'processParamsCtrl',
          resolve: {
            parameters : ['store', 'parameterAPI', '$stateParams', retrieveParameters]
          }
        }).state(processConnectorsStateName, {
          url: '/connectors',
          templateUrl: 'features/admin/processes/details/process-connectors.html',
          controller: 'ProcessConnectorsCtrl',
          controllerAs: 'processConnectorsCtrl',
          resolve: {
            processConnectors: ['store', 'processConnectorAPI', '$stateParams', retrieveConnectors]
          }
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
  function ProcessMenuCtrl($scope, menuContent, process, processAPI, $modal, $stateParams, $state, manageTopUrl, $window, processResolutionProblems) {
    var vm = this;
    vm.getCurrentStateName = function() {
      return $state.current.name;
    };
    vm.menuContent = menuContent;
    vm.process = process;
    vm.toggleProcessActivation = toggleProcessActivation;
    vm.refreshProcess = refreshProcess;
    vm.deleteProcess = deleteProcess;
    vm.currentPageToken = manageTopUrl.getCurrentPageToken();
    vm.processResolutionProblems = processResolutionProblems;

    $scope.$on('button.toggle', vm.toggleProcessActivation);
    $scope.$on('process.refresh', vm.refreshProcess);

    vm.goBack = function() {
      $window.history.back();
    };

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



  function retrieveProcessResolutionProblem(store, processResolutionProblemAPI, $stateParams) {
    return store.load(processResolutionProblemAPI, {
      f: ['process_id=' + $stateParams.processId]
    });
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

  function retrieveConnectors(store, processConnectorAPI, $stateParams) {
    return store.load(processConnectorAPI, {
      o: 'definition_id ASC',
      f: 'process_id=' + $stateParams.processId
    });
  }
})();