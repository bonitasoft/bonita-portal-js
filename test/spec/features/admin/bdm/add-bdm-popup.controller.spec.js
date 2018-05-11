/** Copyright (C) 2017 Bonitasoft S.A.
 * Bonitasoft is a trademark of Bonitasoft SA.
 * This software file is BONITASOFT CONFIDENTIAL. Not For Distribution.
 * For commercial licensing information, contact:
 * Bonitasoft, 32 rue Gustave Eiffel – 38000 Grenoble
 * or Bonitasoft US, 51 Federal Street, Suite 305, San Francisco, CA 94107
 */

(function () {
  'use strict';

  describe('Add BDM Popup', function () {


    var addBDMPopupCtrl, scope, fileUploader, gettext, modalInstance, bonitaVersion;

    beforeEach(module('org.bonitasoft.features.admin.bdm'));

    beforeEach(inject(function ($controller, $rootScope, FileUploader, _gettext_) {
      fileUploader = FileUploader;
      gettext = _gettext_;
      scope = $rootScope.$new();
      modalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss']);
      bonitaVersion = '7.7';

      addBDMPopupCtrl = function () {
        return $controller('AddBDMPopupCtrl', {
          '$scope': scope,
          'FileUploader': FileUploader,
          'gettext': gettext,
          '$modalInstance': modalInstance,
          'bonitaVersion': bonitaVersion
        });
      };
    }));

    it('should have an uploader', function () {
      addBDMPopupCtrl();

      expect(scope.uploader).toBeDefined();
    });

    it('should not have upload success if no file was uploaded', function () {
      addBDMPopupCtrl();

      expect(scope.isUploadSuccess).toBeUndefined();
    });

    describe('Success upload', function () {
      it('should not break if fileItem is undefined', function () {
        var ctrl = addBDMPopupCtrl();

        ctrl.successUpload();

        expect(scope.fileName).toBeUndefined();
      });

      it('should set isUploadSuccess to true', function () {
        expect(scope.isUploadSuccess).toBeUndefined();
        var ctrl = addBDMPopupCtrl();

        ctrl.successUpload({file: {name: 'myFileName'}});

        expect(scope.isUploadSuccess).toBeTruthy();
      });

      it('should get the fileName', function () {
        expect(scope.fileName).toBeUndefined();
        var ctrl = addBDMPopupCtrl();

        ctrl.successUpload({file: {name: 'myFileName'}});

        expect(scope.fileName).toBe('myFileName');
      });

      it('should get the filePath', function () {
        expect(scope.filePath).toBeUndefined();
        var ctrl = addBDMPopupCtrl();
        ctrl.successUpload({file: {name: 'myFileName'}}, 'myFilePath.xml');
        expect(scope.filePath).toBe('myFilePath.xml');
      });

      it('should enable install button', function () {
        var ctrl = addBDMPopupCtrl();

        ctrl.successUpload();

        expect(scope.fileName).toBeUndefined();
      });

      describe('Error upload', function () {
        it('should display a default error message when upload has failed', function () {
          var ctrl = addBDMPopupCtrl();

          ctrl.errorUpload();

          expect(scope.isUploadSuccess).toBeFalsy();
          expect(scope.isTechnicalError).toEqual(true);
          expect(scope.error).toBeDefined();
        });
      });
    });
  });
})();
