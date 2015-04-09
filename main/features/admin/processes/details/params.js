(function() {
  'use strict';
  /**
   * org.bonitasoft.features.admin.processes.details.params Module
   *
   * list params
   */
  angular.module('org.bonitasoft.features.admin.processes.details.params', [
    'org.bonitasoft.common.resources.store',
    'org.bonitasoft.service.features'
  ])
    .controller('ProcessParamsCtrl', function(parameters, FeatureManager, process) {
      var vm = this;
      vm.parameters = parameters;
      vm.process = process;
      vm.showActions = FeatureManager.isFeatureAvailable('POST_DEPLOY_CONFIG');
    });
})();