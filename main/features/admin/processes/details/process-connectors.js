(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.details.processConnectors', [
    'ui.bootstrap',
    'angular-growl',
    'org.bonitasoft.common.resources.store'
  ])
    .controller('ProcessConnectorsCtrl', function($scope, process, store, $modal, growl, processConnectorAPI) {
      var self = this;
      self.scope = $scope;
      self.scope.process = process;
      var resourceInit = [];
      
      resourceInit.pagination = {
        currentPage: 1,
        numberPerPage: 10
      };

      $scope.processConnectors = {
        resource: resourceInit
      };
      $scope.$on('process.connectors.refresh', self.init);

      self.init = function init() {
        self.getConnectors();
      };

      self.getConnectors = function getConnectors() {
        processConnectorAPI.search({
          'p': $scope.processConnectors.resource.pagination.currentPage - 1,
          'c': $scope.processConnectors.resource.pagination.numberPerPage,
          'o': 'definition_id ASC',
          'f': 'process_id=' + self.scope.process.id,
        }).$promise.then(function mapProcessConnectors(processConnectorsResponse) {
          $scope.processConnectors = processConnectorsResponse;
        });
      };

    });
})();