(function () {
  'use strict';

  var mock = require('protractor-http-mock');

  describe('bdm view for a technical user', () => {
    afterEach(function(){
      mock.teardown();
    });

    it('should display bdm detail information when tenant is paused ', () => {
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
      expect(installPopUpButton.getAttribute('disabled')).toEqual('true');
      let cancelButton = element(by.cssContainingText('.btn', 'Cancel'));
      cancelButton.click();
      installButton.click();
      element(by.css('input[type="file"]')).sendKeys(__filename);
      installPopUpButton.click();

      setTimeout(() => {
        element.all(by.css('.modal-dialog')).then(function (items) {
          expect(items.length).toBe(0);
        });
      }, 200);
    });
  });

})();
