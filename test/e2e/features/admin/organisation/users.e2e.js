(function () {
  'use strict';

  describe('users', () => {

    it('should display a user detail informations', () => {
      browser.get('#/admin/organisation/users/1');

      expect(element(by.tagName('h1')).getText()).toBe('Mr Walter Bates');
    });

  });
})();
