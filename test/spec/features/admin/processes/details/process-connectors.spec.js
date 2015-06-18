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