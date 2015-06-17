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