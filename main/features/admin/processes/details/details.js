/* jshint sub:true */
(function () {
  'use strict';

  var informationStateName = 'bonita.processesDetails.information';
  var paramsStateName = 'bonita.processesDetails.params';
  var processConnectorsStateName = 'bonita.processesDetails.processConnectors';
  var actorsMappingStateName = 'bonita.processesDetails.actorsMapping';
  /*eslint "angular/ng_di":0*/
  angular.module('org.bonitasoft.features.admin.processes.details', [
    'ngAnimate',
    'ui.router',
    'ui.bootstrap',
    'gettext',
    'org.bonitasoft.service.token',
    'angular-growl',
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
    'org.bonitasoft.service.process.resolution',
    'org.bonitasoft.common.filters.stringTemplater'
  ])
    .value('menuContent', [{
      name: 'General',
      resolutionLabel: 'general',
      state: informationStateName
    }, {
      name: 'Actors',
      resolutionLabel: 'actor',
      state: actorsMappingStateName
    }, {
      name: 'Parameters',
      resolutionLabel: 'parameter',
      state: paramsStateName
    }, {
      name: 'Connectors',
      resolutionLabel: 'connector',
      state: processConnectorsStateName
    }]).service('ProcessMoreDetailsResolveService', function (store, processConnectorAPI, parameterAPI, categoryAPI, processAPI, actorAPI, processResolutionProblemAPI, ProcessProblemResolutionService) {
      var processMoreDetailsResolveService = {};
      processMoreDetailsResolveService.retrieveProcessResolutionProblem = function (processId) {
        return store.load(processResolutionProblemAPI, {
          f: ['process_id=' + processId]
        }).then(function(processResolutionProblems) {
          return ProcessProblemResolutionService.buildProblemsList(processResolutionProblems.map(function (resolutionProblem) {
            /* jshint camelcase: false */
            return {
              type: resolutionProblem.target_type,
              'ressource_id': resolutionProblem.ressource_id
            };
            /* jshint camelcase: true */
          }));
        });
      };

      processMoreDetailsResolveService.retrieveProcessActors = function(processId, pagination) {
        return actorAPI.search({
          'p': pagination.currentPage - 1,
          'c': pagination.numberPerPage,
          'o': 'name ASC',
          'f': 'process_id=' + processId,
          'n': ['users', 'groups', 'roles', 'memberships']
        }).$promise.then(function(result){
          return result.data;
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
      function ($stateProvider, ACTOR_PER_PAGE) {
        $stateProvider.state('bonita.processesDetails', {
          url: '/admin/processes/details/:processId?supervisor_id',
          templateUrl: 'features/admin/processes/details/menu.html',
          abstract: true,
          controller: 'ProcessMenuCtrl',
          controllerAs: 'processMenuCtrl',
          resolve: {
            process: function ($stateParams, ProcessMoreDetailsResolveService) {
              var process = ProcessMoreDetailsResolveService.retrieveProcess($stateParams.processId);
              process.id = $stateParams.processId;
              return process;
            },
            processResolutionProblems: function ($stateParams, ProcessMoreDetailsResolveService) {
              return ProcessMoreDetailsResolveService.retrieveProcessResolutionProblem($stateParams.processId);
            },
            supervisorId: function($stateParams, TokenExtensionService) {
              TokenExtensionService.tokenExtensionValue = (angular.isDefined($stateParams['supervisor_id']) ? 'pm' : 'admin');
              return $stateParams['supervisor_id'];
            },
            defaultLocalLang : function(i18nService) {
              return i18nService.translationsLoadPromise.then(function () {
                return {
                  selectAll: i18nService.getKey('multiSelect.selectAll'),
                  selectNone: i18nService.getKey('multiSelect.selectNone'),
                  reset: i18nService.getKey('multiSelect.reset'),
                  search: i18nService.getKey('multiSelect.search.helper')
                };
              });
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
          controllerAs: 'actorsMappingCtrl',
          resolve: {
            processActors: function ($stateParams, ProcessMoreDetailsResolveService) {
              return ProcessMoreDetailsResolveService.retrieveProcessActors($stateParams.processId, {
                currentPage: 1,
                numberPerPage: ACTOR_PER_PAGE
              });
            }
          }
        });
      }
    )
    .controller('ProcessMenuCtrl', ProcessMenuCtrl)
    .controller('DeleteProcessModalInstanceCtrl', DeleteProcessModalInstanceCtrl);

  /* jshint -W003 */
  function ProcessMenuCtrl($scope, menuContent, process, processAPI, $modal, $state, manageTopUrl, $window, processResolutionProblems, ProcessMoreDetailsResolveService, TokenExtensionService, growl, $log) {
    var vm = this;
    vm.includesCurrentState = function(state) {
      return $state.includes(state);
    };
    vm.menuContent = menuContent;
    vm.process = process;
    vm.toggleProcessActivation = toggleProcessActivation;
    vm.refreshProcess = refreshProcess;
    vm.deleteProcess = deleteProcess;
    vm.currentPageToken = manageTopUrl.getCurrentPageToken();
    vm.processResolutionProblems = processResolutionProblems;
    vm.hasResolutionProblem = hasResolutionProblem;

    $scope.$on('button.toggle', vm.toggleProcessActivation);
    $scope.$on('process.refresh', vm.refreshProcess);

    vm.goBack = function () {
      $window.history.back();
    };

    function hasResolutionProblem(problemType) {
      return vm.processResolutionProblems.some(function(resolutionProblem) {
        return resolutionProblem.type === problemType;
      });
    }

    function deleteProcess() {
      var growlOptions = {
        ttl: 3000,
        disableCountDown: true,
        disableIcons: true
      };
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
      }).result.then(function() {
        manageTopUrl.goTo({
          token: 'processlisting' + TokenExtensionService.tokenExtensionValue
        });
      }, function(error){
        if(angular.isDefined(error)) {
          $log.error('An Error occurred during process deletion', error);
          growl.error('An Error occurred during process deletion: '+ error.message, growlOptions);
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
      });
    }
  }

  function DeleteProcessModalInstanceCtrl($scope, processAPI, process, $modalInstance) {
    var vm = this;
    vm.process = process;

    vm.delete = function () {
      processAPI.delete({
        id: process.id
      }).$promise.then(function () {
        $modalInstance.close();
      }, function closePopupWithError(error) {
        $modalInstance.dismiss(error);
      });
    };
    vm.cancel = function () {
      $modalInstance.dismiss();
    };
  }
})();
