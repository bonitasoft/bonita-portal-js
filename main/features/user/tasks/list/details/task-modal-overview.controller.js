(function() {
  'use strict';

  /**
   * Bootstrapp Modal controller for modalOverview
   */
  angular
    .module('org.bonitasoft.features.user.tasks.details')
    .controller('ModalOverviewCtrl', ModalOverviewCtrl);

  function ModalOverviewCtrl(Case, $modalInstance, iframe, formMappingAPI) {
    this.Case = Case;
    this.hasOverview = false;

    this.cancel = function() {
      $modalInstance.dismiss('abort');
    };

    this.overviewUrl = iframe.getCaseOverview(Case, Case.processDefinitionId);

    //Check if the case has a form
    formMappingAPI.search({
      p: 0,
      c: 1,
      f: ['processDefinitionId=' + Case.processDefinitionId, 'type=PROCESS_OVERVIEW']
    }).$promise.then(function(response) {
        this.hasOverview = response.resource.pagination.total > 0 && response.resource[0].target === 'NONE';
      });
  }

})();
