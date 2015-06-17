(function() {
  'use strict';
  describe('ProcessInformationCtrl', function() {
    var featureManager, featureManagerResolver, featureAPI, q, scope, deferred;

    beforeEach(module('org.bonitasoft.service.features'));

    beforeEach(function() {

      featureAPI = jasmine.createSpyObj('featureAPI', ['query']);

      module(function($provide) {
        $provide.value('featureAPI', featureAPI);
      });

      inject(function($injector, $q, $rootScope) {
        scope = $rootScope.$new();
        q = $q;
        deferred = q.defer();
        featureAPI.query.and.returnValue({
          $promise: deferred.promise
        });
        featureManagerResolver = $injector.get('FeatureManagerResolver');
        featureManager = $injector.get('FeatureManager');
      });
    });
    it('should call featuresAPI and populate FeatureManager when loading', function() {
      var features = [{name: 'PM'}, {name: 'Monitoring'}];
      deferred.resolve(features);
      scope.$apply();
      expect(featureManager.isFeatureAvailable()).toBeFalsy();
      expect(featureManager.isFeatureAvailable('PM')).toBeTruthy();
      expect(featureManager.isFeatureAvailable('Monitoring')).toBeTruthy();
      expect(featureManager.isFeatureAvailable('Process Visu')).toBeFalsy();
    });
  });
})();