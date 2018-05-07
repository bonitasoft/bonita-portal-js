(function () {
  'use strict';

  describe('password directive', () => {

    beforeEach(module(
      'org.bonitasoft.features.admin.organisation.users',
      'org.bonitasoft.templates'
    ));

    let element, scope;

    beforeEach(inject(function ($compile, $rootScope) {
      scope = $rootScope.$new();
      scope.errors = [];

      scope.updatePassword = jasmine.createSpy('updatePassword');

      let template = '<bo-password on-update="updatePassword" errors="errors"></bo-password>';
      element = $compile(template)(scope);
      scope.$apply();
    }));

    function setValue(selector, value) {
      element.find(selector).val(value).trigger('input');
    }

    function setFormInvalidWithNotMathingPasswords() {
      setValue('input#password', 'newPassword');
      setValue('input#confirm', 'doesNotmatch');
      element.find('.btn-primary').click();
    }

    it('should trigger an update when passwords are filled and matches', () => {

      setValue('input#password', 'newPassword');
      setValue('input#confirm', 'newPassword');
      element.find('.btn-primary').click();

      expect(scope.updatePassword).toHaveBeenCalledWith({new: 'newPassword', confirm: 'newPassword'});
    });

    it('should not trigger an update when new password is empty', () => {

      element.find('.btn-primary').click();

      expect(scope.updatePassword).not.toHaveBeenCalled();
    });

    it('should not trigger an update when passwords does not match', () => {

      setFormInvalidWithNotMathingPasswords();

      expect(scope.updatePassword).not.toHaveBeenCalled();
    });

    it('should set the field confirm as invalid when passwords does not match', () => {

      setFormInvalidWithNotMathingPasswords();

      let confirmFormGroup = element.find('.form-group')[1];
      expect(confirmFormGroup.className).toContain('has-error');
      expect(angular.element(confirmFormGroup).find('.help-block').text()).toBe('Passwords don\'t match');
    });

    it('should reset invalidity when user try to fix the error on the first field', () => {
      setFormInvalidWithNotMathingPasswords();

      setValue('input#password', 'someOtherThing');

      let confirmFormGroup = element.find('.form-group')[1];
      expect(confirmFormGroup.className).not.toContain('has-error');
      expect(angular.element(confirmFormGroup).find('.help-block').length).toBe(0);
    });

    it('should reset invalidity when user try to fix the error on the second field', () => {
      setFormInvalidWithNotMathingPasswords();

      setValue('input#confirm', 'someOtherThing');

      let confirmFormGroup = element.find('.form-group')[1];
      expect(confirmFormGroup.className).not.toContain('has-error');
      expect(angular.element(confirmFormGroup).find('.help-block').length).toBe(0);
    });

    it('should show validation error message when update password has failed', () => {
      scope.errors = ['Password must contain at least 3 digits',
        'Password must contain at least 2 lower case characters',
        'Password must contain at least 2 upper case characters'];
      scope.$apply();

      expect(scope.updatePassword).not.toHaveBeenCalled();
      let confirmFormGroup = element.find('.form-group')[0];
      expect(confirmFormGroup.className).toContain('has-error');
      expect(angular.element(confirmFormGroup).find('.help-block').length).toBe(3);
    });

  });
})();
