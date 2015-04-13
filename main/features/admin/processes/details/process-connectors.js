(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.details.processConnectors', [
    'ui.bootstrap',
    'angular-growl',
    'org.bonitasoft.service.features',
    'org.bonitasoft.common.resources.store'
  ])
    .controller('ProcessConnectorsCtrl', function($scope, process, store, $modal, growl, processConnectorAPI, FeatureManager) {
      var self = this;
      self.scope = $scope;
      self.scope.process = process;
      self.showActions = FeatureManager.isFeatureAvailable('POST_DEPLOY_CONFIG');
      var resourceInit = [];
      
      resourceInit.pagination = {
        currentPage: 1,
        numberPerPage: 10
      };

      $scope.processConnectors = {
        resource: resourceInit
      };
      $scope.$on('process.connectors.refresh', self.init);

      
      store.load(processConnectorAPI, {
          'p': $scope.processConnectors.resource.pagination.currentPage - 1,
          'c': $scope.processConnectors.resource.pagination.numberPerPage,
          'o': 'definition_id ASC',
          'f': 'process_id=' + self.scope.process.id,
        }).then(function mapProcessConnectors(processConnectorsResponse) {
          $scope.processConnectors = processConnectorsResponse;
        });
    });
})();