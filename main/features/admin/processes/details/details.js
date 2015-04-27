/* jshint sub:true */
(function () {
  'use strict';

  var informationStateName = 'bonita.processesDetails.information';
  var paramsStateName = 'bonita.processesDetails.params';
  var processConnectorsStateName = 'bonita.processesDetails.processConnectors';
  var actorsMappingStateName = 'bonita.processesDetails.actorsMapping';
  /*eslint "angular/ng_di":0*/
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
    'org.bonitasoft.features.admin.processes.details.params',
    'org.bonitasoft.service.process.resolution'
  ])
    .value('menuContent', [{
      name: 'General',
      state: informationStateName
    }, {
      name: 'Actors',
      state: actorsMappingStateName
    }, {
      name: 'Parameters',
      state: paramsStateName
    }, {
      name: 'Connectors',
      state: processConnectorsStateName
    }]).service('ProcessMoreDetailsResolveService', function (store, processConnectorAPI, parameterAPI, categoryAPI, processAPI, processResolutionProblemAPI, ProcessProblemResolutionService) {
      var processMoreDetailsResolveService = {};
      processMoreDetailsResolveService.retrieveProcessResolutionProblem = function (processId) {
        return store.load(processResolutionProblemAPI, {
          f: ['process_id=' + processId]
        }).then(function (processResolutionProblems) {
          return ProcessProblemResolutionService.buildProblemsList(processResolutionProblems.map(function (resolutionProblem) {
            /* jshint camelcase: false */
            return resolutionProblem.target_type;
            /* jshint camelcase: true */
          }));
        });
      };

      processMoreDetailsResolveService.retrieveProcess = function (processId) {
        return processAPI.get({
          id: processId,
          d: ['deployedBy'],
          n: ['openCases', 'failedCases']
        });
      };

      processMoreDetailsResolveService.retrieveCategories = function (processId) {
        return store.load(categoryAPI, {
          f: ['id=' + processId]
        });
      };

      processMoreDetailsResolveService.retrieveParameters = function (processId) {
        return store.load(parameterAPI, {
          f: ['process_id=' + processId],
          o: ['name ASC']
        });
      };

      processMoreDetailsResolveService.retrieveConnectors = function (processId) {
        return store.load(processConnectorAPI, {
          o: 'definition_id ASC',
          f: 'process_id=' + processId
        });
      };
      return processMoreDetailsResolveService;
    })
    .config(
      function ($stateProvider) {
        $stateProvider.state('bonita.processesDetails', {
          url: '/admin/processes/details/:processId',
          templateUrl: 'features/admin/processes/details/menu.html',
          abstract: true,
          controller: 'ProcessMenuCtrl',
          controllerAs: 'processMenuCtrl',
          resolve: {
            process: function ($stateParams, ProcessMoreDetailsResolveService) {
              return ProcessMoreDetailsResolveService.retrieveProcess($stateParams.processId);
            },
            processResolutionProblems: function ($stateParams, ProcessMoreDetailsResolveService) {
              return ProcessMoreDetailsResolveService.retrieveProcessResolutionProblem($stateParams.processId);
            }
          }
        }).state(informationStateName, {
          url: '',
          templateUrl: 'features/admin/processes/details/information.html',
          controller: 'ProcessInformationCtrl',
          controllerAs: 'processInformationCtrl',
          resolve: {
            categories: function ($stateParams, ProcessMoreDetailsResolveService) {
              return ProcessMoreDetailsResolveService.retrieveCategories($stateParams.processId);
            }
          }
        }).state(paramsStateName, {
          url: '/params',
          templateUrl: 'features/admin/processes/details/params.html',
          controller: 'ProcessParamsCtrl',
          controllerAs: 'processParamsCtrl',
          resolve: {
            parameters: function ($stateParams, ProcessMoreDetailsResolveService) {
              return ProcessMoreDetailsResolveService.retrieveParameters($stateParams.processId);
            }
          }
        }).state(processConnectorsStateName, {
          url: '/connectors',
          templateUrl: 'features/admin/processes/details/process-connectors.html',
          controller: 'ProcessConnectorsCtrl',
          controllerAs: 'processConnectorsCtrl',
          resolve: {
            processConnectors: function ($stateParams, ProcessMoreDetailsResolveService) {
              return ProcessMoreDetailsResolveService.retrieveConnectors($stateParams.processId);
            }
          }
        }).state(actorsMappingStateName, {
          url: '/actorsMapping',
          templateUrl: 'features/admin/processes/details/actors-mapping.html',
          controller: 'ActorsMappingCtrl',
          controllerAs: 'actorsMappingCtrl'
        });
      }
    )
    .controller('ProcessMenuCtrl', ProcessMenuCtrl)
    .controller('DeleteProcessModalInstanceCtrl', DeleteProcessModalInstanceCtrl);

  /* jshint -W003 */
  function ProcessMenuCtrl($scope, menuContent, process, processAPI, $modal, $state, manageTopUrl, $window, processResolutionProblems, ProcessMoreDetailsResolveService) {
    var vm = this;
    vm.getCurrentStateName = function () {
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

    vm.goBack = function () {
      $window.history.back();
    };

    function deleteProcess() {
      $modal.open({
        templateUrl: 'features/admin/processes/details/delete-process-modal.html',
        controller: 'DeleteProcessModalInstanceCtrl',
        controllerAs: 'deleteProcessModalInstanceCtrl',
        size: 'sm',
        resolve: {
          process: function () {
            return process;
          }
        }
      });
    }

    function refreshProcess() {
      ProcessMoreDetailsResolveService.retrieveProcess(process.id).$promise.then(function (updatedProcess) {
        process.configurationState = updatedProcess.configurationState;
      });
      ProcessMoreDetailsResolveService.retrieveProcessResolutionProblem(process.id).then(function (problems) {
        vm.processResolutionProblems = problems;
      });
    }

    function toggleProcessActivation(event, args) {
      var state = args.value ? 'ENABLED' : 'DISABLED';
      processAPI.update({
        id: process.id,
        activationState: state
      }).$promise.then(function () {
        process.activationState = state;
      }, function TODOmanageerror() {

      });
    }
  }

  function DeleteProcessModalInstanceCtrl($scope, processAPI, process, $modalInstance, manageTopUrl) {
    var vm = this;
    vm.process = process;

    vm.delete = function () {
      processAPI.delete({
        id: process.id
      }).$promise.then(function () {
        manageTopUrl.goTo({
          token: 'processlistingadmin'
        });
        $modalInstance.close();
      }, function TODOmanageerror() {

      });
    };
    vm.cancel = function () {
      $modalInstance.dismiss();
    };
  }
})();
