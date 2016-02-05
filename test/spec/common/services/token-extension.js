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

(function () {
  'use strict';
  describe('manage token extension', function () {
    beforeEach(module('org.bonitasoft.service.token'));
    describe('tokenExtensionValue', function(){
      it('should keep token the same when imported multiple times', inject(function ($injector) {
        var tokenExtensionService = $injector.get('TokenExtensionService');
        tokenExtensionService.tokenExtensionValue = 'pm';
        tokenExtensionService = $injector.get('TokenExtensionService');
        expect(tokenExtensionService.tokenExtensionValue).toEqual('pm');
      }));
    });
  });
})();
