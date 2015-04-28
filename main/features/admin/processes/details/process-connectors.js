(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.details.processConnectors', [
    'ui.bootstrap',
    'angular-growl',
    'org.bonitasoft.service.features',
    'org.bonitasoft.common.resources.store'
  ])
    .controller('ProcessConnectorsCtrl', function($scope, process, store, $modal, growl, FeatureManager, processConnectors) {
      var vm = this;
      vm.scope = $scope;
      vm.scope.process = process;
      vm.processConnectors = processConnectors;
      vm.showActions = FeatureManager.isFeatureAvailable('POST_DEPLOY_CONFIG');
    });
})();
