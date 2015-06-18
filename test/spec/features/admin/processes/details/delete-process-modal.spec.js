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

  describe('monitoringStatus Directive and Controller in Process More Details',
    function() {
      var scope, modal, controller, q;

      beforeEach(module('org.bonitasoft.features.admin.processes.details'));

      beforeEach(inject(function($rootScope, $modal, $controller, $q) {
        scope = $rootScope.$new();
        modal = $modal;
        controller = $controller;
        q = $q;
      }));

      describe('DeleteProcessModalInstanceCtrl', function() {
        var deleteProcessModalInstanceCtrl, modalInstance, manageTopUrl, processAPI, process;
        beforeEach(function() {
          modalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss']);
          manageTopUrl = jasmine.createSpyObj('manageTopUrl', ['goTo']);
          processAPI = jasmine.createSpyObj('processAPI', ['delete']);
          process = {
              id: '1248',
              name: 'SupportProcess',
              version: '1.12.008'
            };
          
          deleteProcessModalInstanceCtrl = controller('DeleteProcessModalInstanceCtrl', {
            $scope: scope,
            process: process,
            $modalInstance: modalInstance,
            manageTopUrl: manageTopUrl,
            processAPI: processAPI
          });
        });
        it('should init view model datas', function() {
          expect(deleteProcessModalInstanceCtrl.process).toBe(process);
          deleteProcessModalInstanceCtrl.cancel();
          expect(modalInstance.dismiss).toHaveBeenCalled();
        });
        describe('should call delete on processAPI when "Delete" is clicked', function() {
          it('should redirect to process listing page on delete success', function() {
            var deferred = q.defer();
            processAPI.delete.and.returnValue({$promise : deferred.promise});
            deleteProcessModalInstanceCtrl.delete();
            deferred.resolve();
            scope.$apply();
            expect(processAPI.delete).toHaveBeenCalledWith({id : process.id});
            expect(modalInstance.close).toHaveBeenCalled();
          });
        });
      });
    });
}());