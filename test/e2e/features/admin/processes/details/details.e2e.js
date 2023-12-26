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
            expect(element.all(by.css('.tag')).count()).toEqual(4);
            expect(element.all(by.css('.tag')).getText()).toEqual(['Support', 'R&D', 'Séverin', 'jQuery+']);
            element(by.css('.metatags-label button')).click();
            var categoriesModal = element(by.css('#manage-categories-modal'));
            expect(categoriesModal.all(by.css('.tag')).count()).toEqual(5);
            expect(categoriesModal.all(by.css('.tag')).getText()).toEqual(['Support', 'R&D', 'Séverin', 'jQuery+', 'Remove all']);
            expect(categoriesModal.all(by.cssContainingText('h4', 'Adding on apply')).isPresent()).toBeFalsy();
            expect(categoriesModal.all(by.cssContainingText('h4', 'Removing on apply')).isPresent()).toBeFalsy();
            var tagsInput = categoriesModal.all(by.css('.add-category-input-container input')).get(0);
            tagsInput.sendKeys('Red');
            categoriesModal.all(by.buttonText('Add')).get(0).click();
            expect(categoriesModal.all(by.cssContainingText('h4', 'Adding on apply')).isPresent()).toBeTruthy();
            tagsInput.sendKeys('F', protractor.Key.ARROW_DOWN, protractor.Key.ARROW_DOWN);
            expect(categoriesModal.all(by.css('.tag')).count()).toEqual(7);
            categoriesModal.all(by.css('.glyphicon-remove')).get(1).click();
            expect(categoriesModal.all(by.css('.tag')).count()).toEqual(6);
            expect(categoriesModal.all(by.cssContainingText('h4', 'Removing on apply')).isPresent()).toBeTruthy();
            categoriesModal.all(by.cssContainingText('.btn-primary', 'Apply')).get(0).click();
            expect(categoriesModal.isPresent()).toBeFalsy();
          });

          it('remove all and enable all should work correctly', function() {
            element(by.css('.metatags-label button')).click();
            var categoriesModal = element(by.css('#manage-categories-modal'));
            expect(categoriesModal.all(by.css('span')).getText()).toEqual(['Support', 'R&D', 'Séverin', 'jQuery+', 'Remove all']);
            expect(categoriesModal.all(by.buttonText('Apply')).isPresent()).toBeFalsy();
            expect(categoriesModal.all(by.cssContainingText('.text-muted', 'No mapping')).isPresent()).toBeFalsy();
            categoriesModal.all(by.cssContainingText('span', 'Remove all')).get(0).click();
            expect(categoriesModal.all(by.buttonText('Apply')).isPresent()).toBeTruthy();
            expect(categoriesModal.all(by.cssContainingText('.text-muted', 'No mapping')).isPresent()).toBeTruthy();
            categoriesModal.all(by.cssContainingText('span', 'Enable all')).get(0).click();
            expect(categoriesModal.all(by.buttonText('Apply')).isPresent()).toBeFalsy();
            expect(categoriesModal.all(by.cssContainingText('.text-muted', 'No mapping')).isPresent()).toBeFalsy();
            var tagsInput = categoriesModal.all(by.css('.add-category-input-container input')).get(0);
            tagsInput.sendKeys('Red');
            categoriesModal.all(by.buttonText('Add')).click();
            tagsInput.sendKeys('Blue');
            categoriesModal.all(by.buttonText('Add')).click();
            expect(categoriesModal.all(by.buttonText('Apply')).isPresent()).toBeTruthy();
            expect(categoriesModal.all(by.cssContainingText('.tag', 'Red')).isPresent()).toBeTruthy();
            expect(categoriesModal.all(by.cssContainingText('.tag', 'Blue')).isPresent()).toBeTruthy();
            categoriesModal.all(by.cssContainingText('.tag', 'Remove all')).get(1).click();
            expect(categoriesModal.all(by.buttonText('Apply')).isPresent()).toBeFalsy();
            expect(categoriesModal.all(by.buttonText('Add')).get(0).getAttribute('disabled')).toBe('true');
          });

          it('wrong inputs should be taken into account correctly', function() {
            element(by.css('.metatags-label button')).click();
            var categoriesModal = element(by.css('#manage-categories-modal'));
            var tagsInput = categoriesModal.all(by.css('.add-category-input-container input')).get(0);
            expect(categoriesModal.all(by.cssContainingText('.alert-info', 'category has already been added')).isPresent()).toBeFalsy();
            expect(categoriesModal.all(by.cssContainingText('.alert-info', 'category cannot be removed and added ')).isPresent()).toBeFalsy();
            tagsInput.sendKeys('Red');
            categoriesModal.all(by.buttonText('Add')).click();
            expect(categoriesModal.all(by.css('span')).getText()).toEqual(['Support', 'R&D', 'Séverin', 'jQuery+', 'Remove all', 'Red', 'Remove all']);
            tagsInput.sendKeys('Red');
            categoriesModal.all(by.buttonText('Add')).click();
            expect(categoriesModal.all(by.css('span')).getText()).toEqual(['Support', 'R&D', 'Séverin', 'jQuery+', 'Remove all', 'Red', 'Remove all']);
            tagsInput.sendKeys('Support');
            expect(categoriesModal.all(by.buttonText('Add')).get(0).getAttribute('disabled')).toBe('true');
            expect(categoriesModal.all(by.cssContainingText('.alert-info', 'category has already been added')).isPresent()).toBeTruthy();
            tagsInput.clear();
            expect(categoriesModal.all(by.cssContainingText('.alert-info', 'category has already been added')).isPresent()).toBeFalsy();
            expect(categoriesModal.all(by.buttonText('Add')).get(0).getAttribute('disabled')).toBe('true');
            categoriesModal.all(by.css('.glyphicon-remove')).get(0).click();
            tagsInput.sendKeys('Support');
            expect(categoriesModal.all(by.buttonText('Add')).get(0).getAttribute('disabled')).toBe('true');
            expect(categoriesModal.all(by.cssContainingText('.alert-info', 'category cannot be removed and added ')).isPresent()).toBeTruthy();
            tagsInput.clear();
            expect(categoriesModal.all(by.cssContainingText('.alert-info', 'category cannot be removed and added ')).isPresent()).toBeFalsy();
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

    describe('with no process id', function() {

      beforeEach(function() {
        browser.get('#/admin/processes/details/');
      });

      it('should display no id message', function() {
        expect(element(by.css('#processDetails-back')).isPresent()).toBe(true);
        expect(element(by.css('#id-not-provided')).isPresent()).toBe(true);
        expect(element(by.tagName('start-for')).isPresent()).toBe(false);
        expect(element(by.css('#id-wrong')).isPresent()).toBe(false);
        expect(element(by.css('#process-menu')).isPresent()).toBe(false);
      });
    });

    describe('with wrong process id', function() {

      beforeEach(function() {
        browser.get('#/admin/processes/details/10001');
      });

      it('should display wrong id message', function() {
        expect(element(by.css('#processDetails-back')).isPresent()).toBe(true);
        expect(element(by.css('#id-wrong')).isPresent()).toBe(true);
        expect(element(by.tagName('start-for')).isPresent()).toBe(false);
        expect(element(by.css('#id-not-provided')).isPresent()).toBe(false);
        expect(element(by.css('#process-menu')).isPresent()).toBe(false);
      });
    });

  });
})();
