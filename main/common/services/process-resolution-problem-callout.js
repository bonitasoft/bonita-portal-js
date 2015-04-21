(function() {
  'use strict';
  /**
   * org.bonitasoft.service.process.errorMessage Module
   *
   * Description
   */
  angular.module('org.bonitasoft.service.process.resolution', ['gettext'])
    .value('ProcessResolutionProblemItem', {
      VALUE_STATE_TARGET_TYPE_ACTOR: 'actor',
      VALUE_STATE_TARGET_TYPE_CONNECTOR: 'connector',
      VALUE_STATE_TARGET_TYPE_PARAMETER: 'parameter'
    })
    .service('ProcessProblemResolutionService', function(gettextCatalog, ProcessResolutionProblemItem) {
      var processProblemResolutionService = {};
      processProblemResolutionService.title = gettextCatalog.getString('The Process cannot be enabled');
      processProblemResolutionService.buildProblemsList = function(stateResolverList) {
        var problemList = [];
        if (processProblemResolutionService.isActorResolutionFailing(stateResolverList)) {
          problemList.push(gettextCatalog.getString('Entity Mapping must be resolved before enabling the Process.'));
        }
        if (processProblemResolutionService.isConnectorResolutionFailing(stateResolverList)) {
          problemList.push(gettextCatalog.getString('Connector definitions must be resolved before enabling the Process.'));
        }
        if (processProblemResolutionService.isParameterResolutionFailing(stateResolverList)) {
          problemList.push(gettextCatalog.getString('Parameters must be resolved before enabling the Process.'));
        }
        return problemList;
      };

      processProblemResolutionService.isActorResolutionFailing = function(problemsStateList) {
        return problemsStateList && problemsStateList.indexOf && problemsStateList.indexOf(ProcessResolutionProblemItem.VALUE_STATE_TARGET_TYPE_ACTOR) >= 0;
      };

      processProblemResolutionService.isConnectorResolutionFailing = function(problemsStateList) {
        return problemsStateList && problemsStateList.indexOf && problemsStateList.indexOf(ProcessResolutionProblemItem.VALUE_STATE_TARGET_TYPE_CONNECTOR) >= 0;
      };


      processProblemResolutionService.isParameterResolutionFailing = function(problemsStateList) {
        return problemsStateList && problemsStateList.indexOf && problemsStateList.indexOf(ProcessResolutionProblemItem.VALUE_STATE_TARGET_TYPE_PARAMETER) >= 0;
      };

      return processProblemResolutionService;
    });
})();
