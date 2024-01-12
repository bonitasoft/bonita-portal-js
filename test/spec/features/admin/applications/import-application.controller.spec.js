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

(() => {
  'use strict';

  describe('ImportApplicationCtrl', () => {

    var modalInstance, importApplication, loadRequest, createCtrl, scope;

    beforeEach(module('org.bonitasoft.features.admin.applications', 'org.bonitasoft.portalTemplates'));

    beforeEach(inject(function($controller, _importApplication_, $q, $rootScope) {

      modalInstance = angular.copy(window.fakeModal);
      importApplication = _importApplication_;
      scope = $rootScope.$new();
      loadRequest = $q.defer();

      spyOn(importApplication, 'save').and.returnValue({
        $promise: loadRequest.promise
      });

      spyOn(modalInstance, 'dismiss');
      spyOn(modalInstance, 'close');

      createCtrl = function() {
        scope.application = {
          id: 1337
        };
        return $controller('importApplicationCtrl', {
          '$scope': scope,
          'importApplication': importApplication,
          '$modalInstance': modalInstance,
          'application': {
            id: 1337
          }
        });
      };

    }));

    it('should have an uploader', function() {
      createCtrl();
      expect(scope.uploader).toBeDefined();
    });

    it('should close the modal when we trigger cancel', function() {
      var ctrl = createCtrl();
      ctrl.cancel();

      expect(modalInstance.dismiss).toHaveBeenCalled();
      expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
    });


    describe('Success upload', function() {

      it('should not break if fileItem is undefined', function() {
        var ctrl = createCtrl();
        ctrl.successUpload();
        expect(scope.fileName).toBeUndefined();
      });


      it('should et isUploadSuccess to true', function() {
        expect(scope.isUploadSuccess).toBeUndefined();
        var ctrl = createCtrl();
        ctrl.successUpload({file: {name: 'toto'}});
        expect(scope.isUploadSuccess).toBeTruthy();
      });

      it('should et get the fileName', function() {
        expect(scope.fileName).toBeUndefined();
        var ctrl = createCtrl();
        ctrl.successUpload({file: {name: 'toto'}});
        expect(scope.fileName).toBe('toto');
      });

      it('should et get the filePath', function() {
        expect(scope.filePath).toBeUndefined();
        var ctrl = createCtrl();
        ctrl.successUpload({file: {name: 'toto'}}, 'hean-pierrot.xml');
        expect(scope.filePath).toBe('hean-pierrot.xml');
      });

    });

    it('should throw an Error with errorUpload', function() {
      var ctrl = createCtrl();

      expect(function() {
        ctrl.errorUpload();
      }).toThrow();
      expect(function() {
        ctrl.errorUpload();
      }).toThrowError('Cannot upload the file');
    });

    describe('Import an application', function() {

      var ctrl;
      beforeEach(function() {
        console.debug = angular.noop;
        ctrl = createCtrl();
        scope.filePath = 'toto.xml';
      });

      it('should call importApplication', function() {
        ctrl.importApp();
        expect(importApplication.save).toHaveBeenCalled();
        expect(importApplication.save).toHaveBeenCalledWith({
          importPolicy: 'FAIL_ON_DUPLICATES',
          applicationsDataUpload: 'toto.xml'
        });
      });

      it('should set importIsSuccessfull to true', function() {
        ctrl.importApp();
        loadRequest.resolve({imported: []});
        scope.$apply();
        expect(scope.importIsSuccessfull).toBeTruthy();
      });

      it('should set totalImportedApps to how many import do we have', function() {
        ctrl.importApp();
        loadRequest.resolve({imported: []});
        scope.$apply();
        expect(scope.totalImportedApps).toBe(0);
      });

      it('should set totalImportedApps to how many import do we have -2', function() {
        ctrl.importApp();
        loadRequest.resolve({imported: [{}, {}]});
        scope.$apply();
        expect(scope.totalImportedApps).toBe(2);
      });

      it('should bind imports', function() {
        ctrl.importApp();
        loadRequest.resolve({imported: [{name: 'tolo'}]});
        scope.$apply();
        expect(scope.imports.length).toBe(1);
        expect(scope.imports[0].name).toBe('tolo');
      });

      it('should bind importNotSuccessfull to true if an error', function() {
        ctrl.importApp();
        loadRequest.reject({data: {message: 'Ein error'}});
        scope.$apply();
        expect(scope.importNotSuccessfull).toBeTruthy();
      });

      it('should bind the message from the error', function() {
        ctrl.importApp();
        loadRequest.reject({data: {message: 'Ein error'}});
        scope.$apply();
        expect(scope.messageError).toBe('Ein error');
      });

    });

    it('should trigger the close method of the modalInstance on success', function() {
      var ctrl = createCtrl();
      ctrl.closeModalSuccess();
      expect(modalInstance.close).toHaveBeenCalled();
    });
  });
})();
