(function () {
  'use strict';

  describe('users', () => {

    it('should display a user detail informations', () => {
      browser.get('#/admin/organisation/users/1');

      expect(element(by.tagName('h1')).getText()).toBe('Mr Walter Bates');

      // should land on general information
      expect(element(by.tagName('h2')).getText()).toBe('General information');

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

      // custom info
      let customInfoMenuItem = element(by.cssContainingText('a.list-group-item', 'Custom information'));
      customInfoMenuItem.click();
      expect(customInfoMenuItem.getAttribute('class')).toContain('active');
      expect(element(by.tagName('h2')).getText()).toBe('Custom information');

      // profiles
      let profilesMenuItem = element(by.cssContainingText('a.list-group-item', 'Profiles / Memberships'));
      profilesMenuItem.click();
      expect(profilesMenuItem.getAttribute('class')).toContain('active');
      expect(element(by.tagName('h2')).getText()).toBe('Profiles');
    });

    it('should display no user id information', () => {
      browser.get('#/admin/organisation/users/');

      expect(element(by.cssContainingText('a', 'Back')).isPresent()).toBe(true);
      expect(element(by.css('#id-not-provided')).isPresent()).toBe(true);
      expect(element(by.css('#id-wrong')).isPresent()).toBe(false);
      expect(element(by.css('.list-group')).isPresent()).toBe(false);
      expect(element(by.css('.UserDetails')).isPresent()).toBe(false);
    });

    it('should display user not found information', () => {
      browser.get('#/admin/organisation/users/500');

      expect(element(by.cssContainingText('a', 'Back')).isPresent()).toBe(true);
      expect(element(by.css('#id-wrong')).isPresent()).toBe(true);
      expect(element(by.css('#id-not-provided')).isPresent()).toBe(false);
      expect(element(by.css('.list-group')).isPresent()).toBe(false);
      expect(element(by.css('.UserDetails')).isPresent()).toBe(false);
    });
  });

})();
