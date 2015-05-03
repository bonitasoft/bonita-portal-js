(function() {
  'use strict';
  describe('ProcessInformationCtrl', function() {
    var scope, processConnectorsCtrl, connectors, featureManager, controller, process;

    beforeEach(module('org.bonitasoft.features.admin.processes.details.processConnectors'));

    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      connectors = [];
      process = {
        id: 123
      };
      featureManager = jasmine.createSpyObj('FeatureManager', ['isFeatureAvailable']);
      controller = $controller;
    }));
    it('should init controller with actions available', function() {
      featureManager.isFeatureAvailable.and.returnValue(true);
      processConnectorsCtrl = controller('ProcessConnectorsCtrl', {
        $scope: scope,
        processConnectors: connectors,
        process: process,
        FeatureManager: featureManager
      });
      expect(processConnectorsCtrl.processConnectors).toBe(connectors);
      expect(processConnectorsCtrl.showActions).toEqual(true);
      expect(featureManager.isFeatureAvailable).toHaveBeenCalledWith('POST_DEPLOY_CONFIG');
    });
    it('should init controller with actions not available', function() {
      featureManager.isFeatureAvailable.and.returnValue(false);
      processConnectorsCtrl = controller('ProcessConnectorsCtrl', {
        $scope: scope,
        processConnectors: connectors,
        process: process,
        FeatureManager: featureManager
      });
      expect(processConnectorsCtrl.processConnectors).toBe(connectors);
      expect(processConnectorsCtrl.showActions).toEqual(false);
      expect(featureManager.isFeatureAvailable).toHaveBeenCalledWith('POST_DEPLOY_CONFIG');
    });
  });
})();