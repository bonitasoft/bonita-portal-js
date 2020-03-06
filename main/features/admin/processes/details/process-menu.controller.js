(function() {

  'use strict';

  angular
    .module('org.bonitasoft.features.admin.processes.details')
    .controller('ProcessMenuCtrl', ProcessMenuCtrl);

  /* jshint -W003 */
  function ProcessMenuCtrl($scope, menuContent, process, processAPI, $modal, $state, manageTopUrl, $window, processResolutionProblems, ProcessMoreDetailsResolveService, TokenExtensionService, growl, $log, i18nService) {
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
    vm.changeProcessState = changeProcessState;
    vm.getProcessStatusButtonId = getProcessStatusButtonId;
    vm.getNewButtonLabel = getNewButtonLabel;
    vm.ENABLED = 'ENABLED';
    vm.DISABLED = 'DISABLED';
    vm.Enable = i18nService.getKey('processDetails.state.button.enable');
    vm.Disable = i18nService.getKey('processDetails.state.button.disable');

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
      $modal.open({
        templateUrl: 'features/admin/processes/details/delete-process-modal.html',
        controller: 'DeleteProcessModalInstanceCtrl',
        controllerAs: 'deleteProcessModalInstanceCtrl',
        size: 'md',
        resolve: {
          process: function () {
            return process;
          }
        }
      }).result.then(function(process) {
        processAPI.delete({id: process.id}).$promise
          .then(function () {
            manageTopUrl.goTo({
              token: 'processlisting' + TokenExtensionService.tokenExtensionValue
            });
          }, function (error) {
            $log.error('An Error occurred during process deletion', error);
            growl.error('An Error occurred during process deletion: '+ error.message);
          });
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

    function toggleProcessActivation(newState) {
      processAPI.update({
        id: process.id,
        activationState: newState
      }).$promise.then(function () {
        process.activationState = newState;
        $scope.$broadcast('activation.state.change', {newState: newState});
      });
    }

    function getProcessStatusButtonId() {
      var processButtonStateId = 'processDetails-';
      processButtonStateId += process.activationState.toLowerCase() === vm.ENABLED.toLowerCase() ? vm.Disable.toLowerCase() : vm.Enable.toLowerCase();
      processButtonStateId += 'Process';
      return processButtonStateId;
    }

    function changeProcessState() {
      var newState = process.activationState.toLowerCase() === vm.ENABLED.toLowerCase() ? vm.DISABLED : vm.ENABLED;
      toggleProcessActivation(newState);
    }

    function getNewButtonLabel() {
      return process.activationState.toLowerCase() === vm.ENABLED.toLowerCase() ? vm.Disable : vm.Enable;
    }
  }
})();
