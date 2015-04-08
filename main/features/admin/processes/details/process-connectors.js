(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.details.processConnectors', [
    'ui.bootstrap',
    'angular-growl',
    'org.bonitasoft.common.resources.store',
    'org.bonitasoft.features.admin.processes.details.editConnectorImplementation'

  ])
    .controller('ProcessConnectorsCtrl', function($scope, process, store, $modal, growl, processConnectorAPI) {
      var self = this;
      self.process = process;
      //var processConnectors = [];
      var resourceInit = [];

      self.init = function init() {
        self.getConnectors();
      };

      resourceInit.pagination = {
        currentPage: 1,
        numberPerPage: 10
      };

      $scope.processConnectors = {
        resource: resourceInit
      };

      self.getConnectors = function getConnectors() {
        processConnectorAPI.search({
          'p': $scope.processConnectors.resource.pagination.currentPage - 1,
          'c': $scope.processConnectors.resource.pagination.numberPerPage,
          'o': 'definition_id ASC',
          'f': 'process_id=' + self.process.id,
        }).$promise.then(function mapProcessConnectors(processConnectorsResponse) {
          $scope.processConnectors = processConnectorsResponse;
        });
      };

      self.editConnectorImplementationModal = function(processConnector) {
        console.log(processConnector);
        $modal.open({
          templateUrl: 'features/admin/processes/details/edit-process-connector-implementation.html',
          controller: 'EditConnectorImplementationCtrl',
          controllerAs: 'editConnectorImplementationCtrl',
          size: 'lg',
          resolve: {
            process: function resolveProcess() {
              return process;
            },
            processConnector: function resolveConnector() {
              return processConnector;
            }
          }
        }).result.then(function close() {
          self.init();
        }, function cancel() {
          self.init();
        });
      };
    });
})();