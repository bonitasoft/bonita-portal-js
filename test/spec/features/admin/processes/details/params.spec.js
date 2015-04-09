(function() {
  'use strict';
  describe('ProcessInformationCtrl', function(){
    var scope, processParamsCtrl, parameters, featureManager, controller;
     
    beforeEach(module('org.bonitasoft.features.admin.processes.details.params'));

    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      parameters = [];
      featureManager = jasmine.createSpyObj('FeatureManager', ['isFeatureAvailable']);
      controller = $controller;
    }));
    it('should init controller with actions available', function() {
      featureManager.isFeatureAvailable.and.returnValue(true);
      processParamsCtrl = controller('ProcessParamsCtrl',{
        $scope: scope,
        parameters: parameters,
        FeatureManager: featureManager
      });
      expect(processParamsCtrl.parameters).toBe(parameters);
      expect(processParamsCtrl.showActions).toEqual(true);
      expect(featureManager.isFeatureAvailable).toHaveBeenCalledWith('POST_DEPLOY_CONFIG');
    });
    it('should init controller with actions not available', function() {
      featureManager.isFeatureAvailable.and.returnValue(false);
      processParamsCtrl = controller('ProcessParamsCtrl',{
        $scope: scope,
        parameters: parameters,
        FeatureManager: featureManager
      });
      expect(processParamsCtrl.parameters).toBe(parameters);
      expect(processParamsCtrl.showActions).toEqual(false);
      expect(featureManager.isFeatureAvailable).toHaveBeenCalledWith('POST_DEPLOY_CONFIG');
    });
  });
})();