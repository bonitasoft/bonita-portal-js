(function() {
  'use strict';
  describe('ProcessInformationCtrl', function() {
    var scope, processParamsCtrl, parameters, featureManager, controller, process, parameterAPI, q, TYPE_ERROR_MESSAGE, i18nService;

    beforeEach(module('org.bonitasoft.features.admin.processes.details.params'));

    beforeEach(inject(function($rootScope, $controller, $q, _TYPE_ERROR_MESSAGE_, _i18nService_) {
      TYPE_ERROR_MESSAGE = _TYPE_ERROR_MESSAGE_;
      scope = $rootScope.$new();
      q = $q;
      parameters = [];
      process = {
        id: 123
      };
      featureManager = jasmine.createSpyObj('FeatureManager', ['isFeatureAvailable']);
      parameterAPI = jasmine.createSpyObj('parameterAPI', ['update']);
      controller = $controller;
      i18nService = _i18nService_;
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
      describe('error message constant', function() {
        it('should manage boolean', function() {
          expect(TYPE_ERROR_MESSAGE['java.lang.Boolean'].checkvalueMatchType('321')).toBeFalsy();
          expect(TYPE_ERROR_MESSAGE['java.lang.Boolean'].checkvalueMatchType(3241)).toBeFalsy();
          expect(TYPE_ERROR_MESSAGE['java.lang.Boolean'].checkvalueMatchType(true)).toBeTruthy();
          expect(TYPE_ERROR_MESSAGE['java.lang.Boolean'].checkvalueMatchType(false)).toBeTruthy();
          expect(TYPE_ERROR_MESSAGE['java.lang.Boolean'].checkvalueMatchType('true')).toBeTruthy();
          expect(TYPE_ERROR_MESSAGE['java.lang.Boolean'].checkvalueMatchType('false')).toBeTruthy();
        });
        it('should manage integer', function() {
          expect(TYPE_ERROR_MESSAGE['java.lang.Integer'].checkvalueMatchType('dfqrfdf')).toBeFalsy();
          expect(TYPE_ERROR_MESSAGE['java.lang.Integer'].checkvalueMatchType(true)).toBeFalsy();
          expect(TYPE_ERROR_MESSAGE['java.lang.Integer'].checkvalueMatchType(654.12)).toBeFalsy();
          expect(TYPE_ERROR_MESSAGE['java.lang.Integer'].checkvalueMatchType(3241)).toBeTruthy();
          expect(TYPE_ERROR_MESSAGE['java.lang.Integer'].checkvalueMatchType('1654')).toBeTruthy();

        });
        it('should manage doulbe', function() {
          expect(TYPE_ERROR_MESSAGE['java.lang.Double'].checkvalueMatchType('dfqrfdf')).toBeFalsy();
          expect(TYPE_ERROR_MESSAGE['java.lang.Double'].checkvalueMatchType(true)).toBeFalsy();
          expect(TYPE_ERROR_MESSAGE['java.lang.Double'].checkvalueMatchType(654.12)).toBeTruthy();
          expect(TYPE_ERROR_MESSAGE['java.lang.Double'].checkvalueMatchType(3241)).toBeTruthy();
          expect(TYPE_ERROR_MESSAGE['java.lang.Double'].checkvalueMatchType('1654')).toBeTruthy();
        });
      });
      describe('error message on wrong input', function() {
        it('should return not boolean message', function(){
          var parameter = {
            type: 'java.lang.Boolean'
          };
          expect(processParamsCtrl.updateParameter(parameter, 321)).toEqual(i18nService.getKey('processDetails.params.control.boolean'));
        });
        it('should return not integer message', function(){
          var parameter = {
            type: 'java.lang.Integer'
          };
          expect(processParamsCtrl.updateParameter(parameter, true)).toEqual(i18nService.getKey('processDetails.params.control.integer'));
        });
        it('should return not boolean message', function(){
          var parameter = {
            type: 'java.lang.Double'
          };
          expect(processParamsCtrl.updateParameter(parameter, true)).toEqual(i18nService.getKey('processDetails.params.control.double'));
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
        var errorMsg = {
          data: {
            message: 'error'
          }
        };
        processParamsCtrl.updateParameter(parameter, value).then(function() {}, function(errorResult) {
          expect(errorResult).toBe(errorMsg.data.message);
        });
        deferred.reject(errorMsg);
        scope.$apply();
      });
    });
  });
})();
