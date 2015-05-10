/* global element, by */
(function() {
  'use strict';
  describe('process details', function() {

    var processDetails,
      width = 1280,
      height = 800;
    browser.driver.manage().window().setSize(width, height);

    describe('Resolved Process', function() {

      beforeEach(function() {
        browser.get('#/admin/processes/details/321');
        processDetails = element(by.css('#process-details'));
        //browser.debugger(); //launch protractor with debug option and use 'c' in console to continue test execution
      });

      describe('navigation in menu ', function() {
        var menuItems;
        beforeEach(function() {
          menuItems = processDetails.all(by.css('.list-group > a.list-group-item'));
        });
        it('should display 4 items in menu', function() {
          expect(menuItems.get(0).getAttribute('class')).toContain('active');
          expect(menuItems.get(1).getAttribute('class')).not.toContain('active');
          expect(menuItems.get(2).getAttribute('class')).not.toContain('active');
          expect(menuItems.get(3).getAttribute('class')).not.toContain('active');
          expect(menuItems.get(0).getText()).toEqual('General');
          expect(menuItems.get(1).getText()).toEqual('Actors');
          expect(menuItems.get(2).getText()).toEqual('Parameters');
          expect(menuItems.get(3).getText()).toEqual('Connectors');
        });

        it('should navigate among sections', function() {
          //menuItems.get(1).all(by.css('a')).get(0).click();
          browser.get('#/admin/processes/details/321/actorsMapping');

          //Actors
          checkMainActions();
          expect(menuItems.get(0).getAttribute('class')).not.toContain('active');
          expect(menuItems.get(1).getAttribute('class')).toContain('active');
          expect(menuItems.get(2).getAttribute('class')).not.toContain('active');
          expect(menuItems.get(3).getAttribute('class')).not.toContain('active');

          //params
          //menuItems.get(2).all(by.css('a')).get(0).click();
          browser.get('#/admin/processes/details/321/params');
          checkMainActions();
          expect(menuItems.get(0).getAttribute('class')).not.toContain('active');
          expect(menuItems.get(1).getAttribute('class')).not.toContain('active');
          expect(menuItems.get(2).getAttribute('class')).toContain('active');
          expect(menuItems.get(3).getAttribute('class')).not.toContain('active');

          //Connectors
          //menuItems.get(3).all(by.css('a')).get(0).click();
          browser.get('#/admin/processes/details/321/connectors');
          checkMainActions();
          expect(menuItems.get(0).getAttribute('class')).not.toContain('active');
          expect(menuItems.get(1).getAttribute('class')).not.toContain('active');
          expect(menuItems.get(2).getAttribute('class')).not.toContain('active');
          expect(menuItems.get(3).getAttribute('class')).toContain('active');

          //General
          browser.get('#/admin/processes/details/321');
          //menuItems.get(0).all(by.css('a')).get(0).click();
          expect(element.all(by.css('#process-details-information')).count()).toBe(1);
        });
      });

      function checkMainActions() {
        var mainActionButtons = processDetails.all(by.css('.actions .btn'));

        expect(mainActionButtons.get(0).getText()).toEqual('Back');
        expect(mainActionButtons.get(0).getAttribute('bonita-href')).toEqual('{token: \'processlistingadmin\'}');

        expect(processDetails.all(by.css('h1')).getText()).toEqual(['SupportProcess (1.0)']);
        expect(processDetails.all(by.css('.panel-danger > div')).count()).toBe(0);
        expect(processDetails.all(by.css('.actions button.btn-primary')).get(0).getAttribute('disabled')).toEqual('true');
      }
    });
    describe('Resolved Process', function() {

      beforeEach(function() {
        browser.get('#/admin/processes/details/789');
        processDetails = element(by.css('#process-details'));
        //browser.debugger(); //launch protractor with debug option and use 'c' in console to continue test execution
      });

      describe('main elements', function() {
        it('should display main action button', function() {
          var mainActionButtons = processDetails.all(by.css('.actions .btn'));
          expect(mainActionButtons.get(0).getText()).toEqual('Back');
          expect(mainActionButtons.get(0).getAttribute('bonita-href')).toEqual('{token: \'processlistingadmin\'}');

          expect(processDetails.all(by.css('h1')).getText()).toEqual(['Rock\'N\'Roll Process (6.6.6)']);
          expect(processDetails.all(by.css('.panel-danger > div')).getText()).toEqual(['The Process cannot be enabled', 'Entity Mapping must be resolved before enabling the Process.\nParameters must be resolved before enabling the Process.']);
        });
      });
      describe('Delete button', function() {
        it('should open a popup asking for deletion with Delete and Cancel', function() {
          var deleteButton = processDetails.all(by.css('.actions .btn-primary')).get(0);
          expect(deleteButton.getText()).toEqual('Delete');
          //click on delete
          deleteButton.click();
          var deleteModal = element(by.css('#delete-process-modal'));
          expect(deleteModal.all(by.css('.modal-title')).getText()).toEqual(['Delete process']);
          expect(deleteModal.all(by.css('.modal-body')).getText()).toEqual(['Delete the process Rock\'N\'Roll Process']);

          expect(deleteModal.all(by.css('.btn')).get(0).getText()).toEqual('Delete');
          expect(deleteModal.all(by.css('.btn')).get(1).getText()).toEqual('Cancel');
        });
      });
    });
  });
})();