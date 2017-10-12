(function () {
  'use strict';

  describe('users', () => {

    it('should display a user detail informations', () => {
      browser.get('#/admin/organisation/users/1');

      expect(element(by.tagName('h1')).getText()).toBe('Mr Walter Bates');

      // should land on general information
      expect(element(by.tagName('h3')).getText()).toBe('General information');

      // Password
      let passwordMenuItem = element(by.cssContainingText('a.list-group-item', 'Password'));
      passwordMenuItem.click();
      expect(passwordMenuItem.getAttribute('class')).toContain('active');
      expect(element(by.tagName('h2')).getText()).toBe('Password');

      // business card
      let businessCardMenuItem = element(by.cssContainingText('a.list-group-item', 'Business card'));
      businessCardMenuItem.click();
      expect(businessCardMenuItem.getAttribute('class')).toContain('active');
      expect(element(by.tagName('h2')).getText()).toBe('Business card');

      // personnal info
      let personnalInfoMenuItem = element(by.cssContainingText('a.list-group-item', 'Personal information'));
      personnalInfoMenuItem.click();
      expect(personnalInfoMenuItem.getAttribute('class')).toContain('active');
      expect(element(by.tagName('h2')).getText()).toBe('Personal information');
    });
  });

})();
