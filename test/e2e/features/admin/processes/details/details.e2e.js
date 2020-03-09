/** Copyright (C) 2015 Bonitasoft S.A.
 * BonitaSoft, 31 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/* global element, by, protractor */
(function() {
  'use strict';
  describe('process details', function() {

    var processDetails;

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

        xit('should navigate among sections', function() {
          menuItems.get(1).click();
          //browser.get('#/admin/processes/details/321/actorsMapping');

          //Actors
          checkMainActions();
          expect(menuItems.get(0).getAttribute('class')).not.toContain('active');
          expect(menuItems.get(1).getAttribute('class')).toContain('active');
          expect(menuItems.get(2).getAttribute('class')).not.toContain('active');
          expect(menuItems.get(3).getAttribute('class')).not.toContain('active');

          //params
          menuItems.get(2).click();
          //browser.get('#/admin/processes/details/321/params');
          checkMainActions();
          expect(menuItems.get(0).getAttribute('class')).not.toContain('active');
          expect(menuItems.get(1).getAttribute('class')).not.toContain('active');
          expect(menuItems.get(2).getAttribute('class')).toContain('active');
          expect(menuItems.get(3).getAttribute('class')).not.toContain('active');

          //Connectors
          menuItems.get(3).click();
          //browser.get('#/admin/processes/details/321/connectors');
          checkMainActions();
          expect(menuItems.get(0).getAttribute('class')).not.toContain('active');
          expect(menuItems.get(1).getAttribute('class')).not.toContain('active');
          expect(menuItems.get(2).getAttribute('class')).not.toContain('active');
          expect(menuItems.get(3).getAttribute('class')).toContain('active');

          //General
          //browser.get('#/admin/processes/details/321');
          menuItems.get(0).click();
          expect(element.all(by.css('#process-details-information')).count()).toBe(1);
        });

        describe('Enable/Disable Button', function() {
          it('should disable process and enable delete then enable process and disable delete', function() {
            element(by.buttonText('Disable')).click();
            expect(processDetails.all(by.css('.actions #processDetails-deleteProcess')).get(0).getAttribute('disabled')).toEqual(null);
            element(by.buttonText('Enable')).click();
            expect(processDetails.all(by.css('.actions #processDetails-deleteProcess')).get(0).getAttribute('disabled')).toEqual('true');
          });

          it('should update state and button informations when button is pressed', function() {
            element(by.buttonText('Disable')).click();
            // This also checks if the button has changed it's label, since if the button is not found, the label has not changed
            expect(element(by.buttonText('Enable')).getAttribute('id')).toEqual('processDetails-enableProcess');
            element(by.buttonText('Enable')).click();
            expect(element(by.buttonText('Disable')).getAttribute('id')).toEqual('processDetails-disableProcess');
          });
        });

        describe('Categories', function() {
          it('should add new category and remove some others', function() {
            expect(element(by.css('.tags')).getText()).toEqual('  Support  \n  R&D  \n  Séverin  \n  jQuery+  ');
            element(by.css('.metatags-label button')).click();
            var categoriesModal = element(by.css('#manage-categories-modal'));
            expect(categoriesModal.all(by.css('.tags')).getText()).toEqual(['Support\nR&D\nSéverin\njQuery+']);
            var tagsInput = categoriesModal.all(by.css('input')).get(0);
            tagsInput.sendKeys('Red', protractor.Key.ENTER);
            tagsInput.sendKeys('F');
            categoriesModal.all(by.css('.tags-suggestion')).get(0).click();
            categoriesModal.all(by.css('.tags .tag i')).get(2).click();
            categoriesModal.all(by.css('.btn-primary')).get(0).click();
          });
        });
      });

      function checkMainActions() {
        var backButton = element(by.css('#processDetails-back'));
        expect(backButton.getText()).toEqual('Back');
        expect(backButton.getAttribute('ng-click')).toEqual('processMenuCtrl.goBack()');

        expect(processDetails.all(by.css('h1')).getText()).toEqual(['SupportProcess (1.0)']);
        expect(processDetails.all(by.css('.panel-danger > div')).count()).toBe(0);
        expect(processDetails.all(by.css('.actions #processDetails-deleteProcess')).get(0).getAttribute('disabled')).toEqual('true');
      }
    });
    describe('Unresolved Process', function() {

      beforeEach(function() {
        browser.get('#/admin/processes/details/789');
        processDetails = element(by.css('#process-details'));
        //browser.debugger(); //launch protractor with debug option and use 'c' in console to continue test execution
      });

      describe('main elements', function() {
        it('should display main action button', function() {
          var mainActionButtons = processDetails.all(by.css('.actions .btn'));
          expect(mainActionButtons.get(0).getText()).toEqual('BACK');
          expect(mainActionButtons.get(0).getAttribute('ng-click')).toEqual('processMenuCtrl.goBack()');

          expect(processDetails.all(by.css('h1')).getText()).toEqual(['Rock\'N\'Roll Process To Display (6.6.6)']);
          expect(processDetails.all(by.css('.panel-danger > div')).getText()).toEqual(['This process is not fully configured. It cannot be enabled.', 'Actors must be resolved before enabling the Process.\nParameters must be resolved before enabling the Process.']);
        });
      });
      describe('Delete button', function() {
        it('should open a popup asking for deletion with Delete and Cancel', function() {
          var deleteButton = processDetails.all(by.css('.actions #processDetails-deleteProcess')).get(0);
          expect(deleteButton.getText()).toEqual('DELETE');
          //click on delete
          deleteButton.click();
          var deleteModal = element(by.css('#delete-process-modal'));
          expect(deleteModal.all(by.css('.modal-title')).getText()).toEqual(['Delete process Rock\'N\'Roll Process (6.6.6)']);

          expect(deleteModal.all(by.css('.btn')).get(0).getText()).toEqual('DELETE');
          expect(deleteModal.all(by.css('.btn')).get(1).getText()).toEqual('CANCEL');
        });
      });
    });

    describe('Unresolved enabled Process', function() {

      beforeEach(function() {
        browser.get('#/admin/processes/details/101');
        processDetails = element(by.css('#process-details'));
        //browser.debugger(); //launch protractor with debug option and use 'c' in console to continue test execution
      });

      describe('main elements', function() {
        it('should change error message depending on activation state', function() {
          expect(processDetails.all(by.css('.panel-danger > div')).get(0).getText()).toEqual('This process is not fully configured, but it is still enabled. Users may still be able to start cases or do tasks, which may lead to errors.');
          element(by.buttonText('Disable')).click();
          expect(processDetails.all(by.css('.panel-danger > div')).get(0).getText()).toEqual('This process is not fully configured. It cannot be enabled.');
          expect(element(by.buttonText('Enable')).isEnabled()).toBe(false);
        });
      });
    });
  });
})();
