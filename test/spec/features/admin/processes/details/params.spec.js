(function() {
  'use strict';
  describe('ProcessInformationCtrl', function() {
    var scope, processParamsCtrl, parameters, featureManager, controller, process, parameterAPI, q;

    beforeEach(module('org.bonitasoft.features.admin.processes.details.params'));

    beforeEach(inject(function($rootScope, $controller, $q) {
      scope = $rootScope.$new();
      q = $q;
      parameters = [];
      process = {
        id: 123
      };
      featureManager = jasmine.createSpyObj('FeatureManager', ['isFeatureAvailable']);
      parameterAPI = jasmine.createSpyObj('parameterAPI', ['update']);
      controller = $controller;
    }));
    it('should init controller with actions available', function() {
      featureManager.isFeatureAvailable.and.returnValue(true);
      processParamsCtrl = controller('ProcessParamsCtrl', {
        $scope: scope,
        parameters: parameters,
        process: process,
        FeatureManager: featureManager
      });
      expect(processParamsCtrl.parameters).toBe(parameters);
      expect(processParamsCtrl.showActions).toEqual(true);
      expect(featureManager.isFeatureAvailable).toHaveBeenCalledWith('POST_DEPLOY_CONFIG');
    });
    it('should init controller with actions not available', function() {
      featureManager.isFeatureAvailable.and.returnValue(false);
      processParamsCtrl = controller('ProcessParamsCtrl', {
        $scope: scope,
        parameters: parameters,
        process: process,
        FeatureManager: featureManager
      });
      expect(processParamsCtrl.parameters).toBe(parameters);
      expect(processParamsCtrl.showActions).toEqual(false);
      expect(featureManager.isFeatureAvailable).toHaveBeenCalledWith('POST_DEPLOY_CONFIG');
    });

    describe('updateParameter method', function() {
      beforeEach(function() {
        angular.noop = jasmine.createSpy();
        processParamsCtrl = controller('ProcessParamsCtrl', {
          $scope: scope,
          parameters: parameters,
          process: process,
          FeatureManager: featureManager,
          parameterAPI: parameterAPI
        });
      });
      it('should call API to update parameter', function() {
        var deferred = q.defer();
        parameterAPI.update.and.returnValue({
          $promise: deferred.promise
        });
        var parameter = {
          name: 'paramName',
          description: 'description',
          type: 'java.lang.String',
          'process_id': 123
        };
        var value = 'newValue';
        processParamsCtrl.updateParameter(parameter, value);
        expect(parameterAPI.update).toHaveBeenCalledWith({
          'process_id': 123,
          description: parameter.description,
          name: parameter.name,
          value: value,
          type: 'java.lang.String'
        });
        deferred.resolve('success');
        scope.$emit = jasmine.createSpy();
        scope.$apply();
        expect(scope.$emit).toHaveBeenCalledWith('process.refresh');

      });
      xit('should call API to update parameter', function() {
        var deferred = q.defer();
        parameterAPI.update.and.returnValue({
          $promise: deferred.promise
        });
        var parameter = {
          name: 'paramName',
          description: 'description',
          type: 'java.lang.String',
          'process_id': 123
        };
        var value = 'newValue';
        var errorMsg = {
          data: {
            message: 'error'
          }
        };
        processParamsCtrl.updateParameter(parameter, value).then(function(){}, function(errorResult){
          expect(errorResult).toBe(errorMsg.data.message);
        });
        deferred.reject(errorMsg);
        scope.$apply();
      });
    });
  });
})();
