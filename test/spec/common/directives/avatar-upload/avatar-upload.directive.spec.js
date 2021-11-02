(() => {
  'use strict';

  describe('avatar upload', () => {

    beforeEach(module('angularFileUpload', 'org.bonitasoft.common.directives.avatar-upload', 'org.bonitasoft.templates'));

    describe('on success', () => {
      let element, scope, $state, $q;

      beforeEach(inject(function ($compile, $rootScope, _$q_, FileUploader) {
        $q = _$q_;
        scope = $rootScope.$new();
        scope.uploader = new FileUploader();
        $state = jasmine.createSpyObj('$state', ['reload']);
        scope.itemId = '7866';
        scope.apiToCall = {
          'delete': jasmine.createSpy().and.callFake(function () {
            var deferred = $q.defer();
            deferred.resolve({status: 204});
            return deferred.promise;
          })
        };
        scope.successFunction = jasmine.createSpy().and.callFake(function () {
          $state.reload();
        });
        let template = '<bo-avatar-upload icon-src="icon" uploader="uploader" item-id="itemId" api-to-call="apiToCall" success-function="successFunction"></bo-avatar-upload>';
        element = $compile(template)(scope);
        scope.$apply();
      }));

      it('should have a default preview when user has no icon', () => {
        scope.icon = undefined;
        scope.$apply();

        expect(element.find('img').length).toEqual(0);
        expect(element.find('.AvatarUpload-preview')[0].className).toContain('AvatarUpload-preview--default');
      });

      it('should have a default preview when user has the default icon', () => {
        scope.icon = 'icons/default/icon_user.png';
        scope.$apply();

        expect(element.find('img').length).toEqual(0);
        expect(element.find('.AvatarUpload-preview')[0].className).toContain('AvatarUpload-preview--default');
      });

      it('should have a preview when user has an icon', () => {
        scope.icon = '../API/avatars/139';
        scope.$apply();

        expect(element.find('img')[0].src).toContain('API/avatars/139');
        expect(element.find('.AvatarUpload-preview')[0].className).not.toContain('AvatarUpload-preview--default');
      });

      it('should show a loader when uploading', () => {
        scope.uploader.isUploading = true;
        scope.$apply();

        expect(element.find('.AvatarUpload-preview')[0].className).toContain('AvatarUpload-preview--busy');
      });

      it('should NOT show a loader when NOT uploading', () => {
        scope.uploader.isUploading = false;
        scope.$apply();

        expect(element.find('.AvatarUpload-preview')[0].className).not.toContain('AvatarUpload-preview--busy');
      });

      it('should disable the button when uploading', () => {
        scope.uploader.isUploading = true;
        scope.$apply();

        expect(element.find('.AvatarUpload-btn .btn')[0].className).toContain('disabled');
        expect(element.find('input[type=file]')[0].disabled).toBeTruthy();
      });

      it('should NOT disable the button when NOT uploading', () => {
        scope.uploader.isUploading = false;
        scope.$apply();

        expect(element.find('.AvatarUpload-btn .btn')[0].className).not.toContain('disabled');
        expect(element.find('input[type=file]')[0].disabled).not.toBeTruthy();
      });

      it('should be able to delete', () => {
        scope.icon = '../API/avatars/139';
        scope.$apply();

        expect(element.find('.AvatarUpload-preview')[0].className).not.toContain('AvatarUpload-preview--default');
        expect(element.find('.AvatarUpload-delete-icon')[0]).toBeTruthy();

        element.find('.AvatarUpload-delete-icon').click();

        expect(scope.successFunction).toHaveBeenCalled();
      });
    });

    describe('on failure', () => {
      let element, scope, $state, $q, deleteError = {status: 204};

      beforeEach(inject(function ($compile, $rootScope, _$q_, FileUploader) {
        $q = _$q_;
        scope = $rootScope.$new();
        scope.uploader = new FileUploader();
        $state = jasmine.createSpyObj('$state', ['reload']);
        scope.itemId = '7866';
        scope.apiToCall = {
          'delete': jasmine.createSpy().and.callFake(function () {
            var deferred = $q.defer();
            deferred.reject(deleteError);
            return deferred.promise;
          })
        };
        scope.successFunction = jasmine.createSpy().and.callFake(function () {
          $state.reload();
        });
        let template = '<bo-avatar-upload icon-src="icon" uploader="uploader" item-id="itemId" api-to-call="apiToCall" success-function="successFunction"></bo-avatar-upload>';
        element = $compile(template)(scope);
        scope.$apply();
      }));

      it('should show internal server error when uploading icon', () => {
        expect(element.find('.AvatarUpload-preview')[0].className).toContain('AvatarUpload-preview--default');
        expect(element.find('.AvatarUpload-internal-error')[0]).toBeFalsy();

        scope.uploader.status = 500;
        scope.$apply();

        expect(element.find('.AvatarUpload-internal-error')[0]).toBeTruthy();
      });

      it('should show file too big error when uploading icon', () => {
        expect(element.find('.AvatarUpload-preview')[0].className).toContain('AvatarUpload-preview--default');
        expect(element.find('.AvatarUpload-file-too-big-error')[0]).toBeFalsy();

        scope.uploader.status = 413;
        scope.$apply();

        expect(element.find('.AvatarUpload-file-too-big-error')[0]).toBeTruthy();
      });

      it('should show file wrong mime type error when uploading icon', () => {
        expect(element.find('.AvatarUpload-preview')[0].className).toContain('AvatarUpload-preview--default');
        expect(element.find('.AvatarUpload-wrong-mime-type-error')[0]).toBeFalsy();

        scope.uploader.status = 415;
        scope.$apply();

        expect(element.find('.AvatarUpload-wrong-mime-type-error')[0]).toBeTruthy();
      });

      it('should show internal server error when deleting icon', () => {
        scope.icon = '../API/avatars/139';
        deleteError.status = 500;
        scope.$apply();

        expect(element.find('.AvatarUpload-preview')[0].className).not.toContain('AvatarUpload-preview--default');
        expect(element.find('.AvatarUpload-delete-icon')[0]).toBeTruthy();
        expect(element.find('.AvatarUpload-internal-error')[0]).toBeFalsy();

        element.find('.AvatarUpload-delete-icon').click();
        scope.$apply();

        expect(scope.successFunction).not.toHaveBeenCalled();
        expect(element.find('.AvatarUpload-delete-icon')[0]).toBeTruthy();
        expect(element.find('.AvatarUpload-internal-error')[0]).toBeTruthy();
      });

      it('should show not found error when deleting icon', () => {
        scope.icon = '../API/avatars/139';
        deleteError.status = 404;
        scope.$apply();

        expect(element.find('.AvatarUpload-preview')[0].className).not.toContain('AvatarUpload-preview--default');
        expect(element.find('.AvatarUpload-delete-icon')[0]).toBeTruthy();
        expect(element.find('.AvatarUpload-not-found-error')[0]).toBeFalsy();

        element.find('.AvatarUpload-delete-icon').click();
        scope.$apply();

        expect(scope.successFunction).not.toHaveBeenCalled();
        expect(element.find('.AvatarUpload-delete-icon')[0]).toBeTruthy();
        expect(element.find('.AvatarUpload-not-found-error')[0]).toBeTruthy();
      });
    });
  });
})();
