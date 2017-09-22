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

  describe('delete process modal instance controller', function () {
    var scope, $q, controller, modalInstance, processAPI, process;

    beforeEach(module('org.bonitasoft.features.admin.processes.details'));

    beforeEach(inject(function ($rootScope, $controller, _$q_) {
      scope = $rootScope.$new();
      $q = _$q_;

      modalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss']);
      processAPI = jasmine.createSpyObj('processAPI', ['delete']);

      process = {
        id: '1248',
        name: 'SupportProcess',
        version: '1.12.008'
      };

      controller = $controller('DeleteProcessModalInstanceCtrl', {
        process: process,
        $modalInstance: modalInstance,
        processAPI: processAPI
      });
    }));

    it('should init view model data', function () {
      expect(controller.process).toBe(process);
    });

    it('should dismiss modal instance on cancel', function () {
      controller.cancel();
      expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('should delete a process', function () {
      processAPI.delete.and.returnValue({$promise: $q.when()});

      controller.delete();

      expect(processAPI.delete).toHaveBeenCalledWith({id: process.id});
    });

    it('should close modal instance on delete success', function () {
      processAPI.delete.and.returnValue({$promise: $q.resolve()});

      controller.delete();
      scope.$apply();

      expect(modalInstance.close).toHaveBeenCalled();
    });

    it('should dismiss modal instance on deleted error', function () {
      processAPI.delete.and.returnValue({$promise: $q.reject({an: 'error'})});

      controller.delete();
      scope.$apply();

      expect(modalInstance.dismiss).toHaveBeenCalledWith({an: 'error'});
    });

    it('should manage a processing state when deleting a process', function () {
      processAPI.delete.and.returnValue({$promise: $q.when()});
      expect(controller.processing).toBe(false);

      controller.delete();
      expect(controller.processing).toBe(true);

      $q.resolve();
      expect(controller.processing).toBe(true);
    });

  });
}());
