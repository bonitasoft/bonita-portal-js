(function () {
  'use strict';

  var mock = require('protractor-http-mock');

  describe('bdm view for a technical user', () => {
    afterEach(function(){
      mock.teardown();
    });

    it('should install bdm', () => {
      // Load mock defined in e2e/mocks folder
      mock(['technical-user-session','paused-tenant','uninstalled-bdm']);
      browser.get('#/admin/bdm');

      expect(element(by.id('displayState')).getText()).toBe('Not installed');
      expect(element(by.id('lastUpdate')).getText()).toBe('-');
      expect(element(by.id('updatedBy')).getText()).toBe('-');

      //install
      let installButton = element(by.tagName('button'));
      installButton.click();
      let installPopUpButton = element(by.id('btn-open-modal'));
      let cancelButton = element(by.cssContainingText('.btn', 'Cancel'));
      cancelButton.click();
      installButton.click();
      expect(installPopUpButton.getAttribute('disabled')).toEqual('true');
      element(by.css('input[type="file"]')).sendKeys(__filename);
      expect(installPopUpButton.getAttribute('disabled')).toBeNull();
      installPopUpButton.click();
      setTimeout(() => {
        element.all(by.css('.modal-dialog')).then(function (items) {
          expect(items.length).toBe(0);
        });
      }, 200);
    });

    it('should update bdm', () => {
      // Load mock defined in e2e/mocks folder
      mock(['technical-user-session','paused-tenant','installed-bdm']);
      browser.get('#/admin/bdm');

      expect(element(by.id('displayState')).getText()).toBe('Installed');
      expect(element(by.id('lastUpdate')).getText()).not.toBe('-');
      expect(element(by.id('updatedBy')).getText()).not.toBe('-');

      //install
      let installButton = element(by.tagName('button'));
      installButton.click();
      let installPopUpButton = element(by.id('btn-open-modal'));
      let cancelButton = element(by.cssContainingText('.btn', 'Cancel'));
      let confirmationCheckbox = element(by.css('.modal-footer .callout-warning > input[type=checkbox]'));
      let confirmationText = element(by.css('.modal-footer .callout-warning > span'));
      cancelButton.click();
      installButton.click();
      expect(installPopUpButton.getAttribute('disabled')).toEqual('true');
      element(by.css('input[type="file"]')).sendKeys(__filename);
      expect(installPopUpButton.getAttribute('disabled')).toEqual('true');
      confirmationCheckbox.click();
      expect(installPopUpButton.getAttribute('disabled')).toBeNull();
      confirmationText.click();
      expect(installPopUpButton.getAttribute('disabled')).toEqual('true');
      confirmationText.click();
      expect(installPopUpButton.getAttribute('disabled')).toBeNull();
      installPopUpButton.click();
      setTimeout(() => {
        element.all(by.css('.modal-dialog')).then(function (items) {
          expect(items.length).toBe(0);
        });
      }, 200);
    });
  });

})();
