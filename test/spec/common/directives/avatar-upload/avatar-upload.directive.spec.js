(() => {
  'use strict';

  describe('avatar upload', () => {

    let element, scope;

    beforeEach(module('angularFileUpload', 'org.bonitasoft.common.directives.avatar-upload', 'org.bonitasoft.templates'));

    beforeEach(inject(function ($compile, $rootScope, FileUploader) {
      scope = $rootScope.$new();
      scope.uploader = new FileUploader();
      let template = '<bo-avatar-upload icon-src="icon" uploader="uploader"></bo-avatar-upload>';
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

  });

})();
