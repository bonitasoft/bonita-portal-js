/** Copyright (C) 2015 Bonitasoft S.A.
 * Bonitasoft, 32 rue Gustave Eiffel - 38000 Grenoble
 * This library is free software; you can redistribute it and/or modify it under the terms
 * of the GNU Lesser General Public License as published by the Free Software Foundation
 * version 2.1 of the License.
 * This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public License along with this
 * program; if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth
 * Floor, Boston, MA 02110-1301, USA.
 */

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