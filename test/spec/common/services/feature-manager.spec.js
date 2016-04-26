/** Copyright (C) 2015 Bonitasoft S.A.
 * BonitaSoft, 31 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

(function() {
  'use strict';
  describe('FeatureManager service', function() {
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
    describe('isMonitoringFeatureActivated', function() {
      it('should return true if feature is present', function() {
        var features = [{name: 'PROCESS_MONITORING'}, {name: 'Monitoring'}];
        deferred.resolve(features);
        scope.$apply();
        expect(featureManager.isMonitoringFeatureActivated()).toBeTruthy();
      });
      it('should return false if feature is not present', function() {
        var features = [{name: 'SEARCH_INDEX'}];
        deferred.resolve(features);
        scope.$apply();
        expect(featureManager.isMonitoringFeatureActivated()).toBeFalsy();
      });
    });
    describe('isSearchIndexedFeatureActivated', function() {
      it('should return true if feature is present', function() {
        var features = [{name: 'SEARCH_INDEX'}, {name: 'Monitoring'}];
        deferred.resolve(features);
        scope.$apply();
        expect(featureManager.isSearchIndexedFeatureActivated()).toBeTruthy();
      });
      it('should return false if feature is not present', function() {
        var features = [{name: 'Monitoring'}];
        deferred.resolve(features);
        scope.$apply();
        expect(featureManager.isSearchIndexedFeatureActivated()).toBeFalsy();
      });
    });
  });
})();
