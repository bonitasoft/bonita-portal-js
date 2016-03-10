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

/* global element, by, describe */
(function () {
  'use strict';
  describe('case admin  buttons', function () {
    var caseList;

    beforeEach(function () {
      browser.get('#/admin/cases/list');
      caseList = element(by.css('#case-list'));
    });

    afterEach(function () {
      browser.executeScript('window.sessionStorage.clear();');
      browser.executeScript('window.localStorage.clear();');
    });

    function getDeleteButton(){
      return element(by.css('#delete-button'), caseList);
    }
    function getModal(){
      return element(by.css('.modal-dialog'));
    }

    var selectAllCheckbox = (function getSelectAllCheckbox() {
      return element(by.css('th.case-checkbox input[type=checkbox]'), caseList);
    })();

    var checkboxes = (function () {
      return element.all(by.css('td.case-checkbox input[type=checkbox]'), caseList);
    })();

    function getDeleteButtonDisabledAttribute() {
      return getDeleteButton().getAttribute('disabled');
    }
    describe('case list : delete button ', function () {
      it('should enable delete button when a checkbox is checked', function () {

        // click on a check box to activate the delete button
        checkboxes.get(0).click();

        // check if the button is active
        expect(getDeleteButtonDisabledAttribute()).toEqual(null);
      });

      it('should enable delete button when several checkboxes are checked', function () {

        expect(getDeleteButtonDisabledAttribute()).toEqual('true');

        // click on a check box to activate the delete button
        //check a checkbox
        checkboxes.get(0).click();

        // check if the button is active
        expect(getDeleteButtonDisabledAttribute()).toEqual(null);

        //check one more checkbox
        checkboxes.get(2).click();

        // check if the button is still active
        expect(getDeleteButtonDisabledAttribute()).toEqual(null);

        //check a checkbox
        checkboxes.get(4).click();

        // check if the button is still active
        expect(getDeleteButtonDisabledAttribute()).toEqual(null);
      });



      it('should disable delete button when the last checkbox is unchecked', function () {
        // click on several checkboxes to activate the delete button
        checkboxes.get(0).click();
        checkboxes.get(2).click();
        checkboxes.get(4).click();
        //uncheck clicked checkboxes
        checkboxes.get(0).click();
        //check the button state at each uncheck action, it it is not the last, the button must be active
        expect(getDeleteButtonDisabledAttribute()).toEqual(null);
        //uncheck clicked checkboxes
        checkboxes.get(2).click();
        //check the button state at each uncheck action, it it is not the last, the button must be active
        expect(getDeleteButtonDisabledAttribute()).toEqual(null);
        //uncheck last clicked checkbox
        checkboxes.get(4).click();
        //check the button state at each uncheck action, it is the last : the button must be inactive
        expect(getDeleteButtonDisabledAttribute()).toEqual('true');
      });

      it('should disable delete button when one checked checkbox is unchecked', function () {
        // click on a check box to activate the delete button
        checkboxes.get(4).click();
        // verify if the button is active
        expect(getDeleteButtonDisabledAttribute()).toEqual(null);
        // uncheck the checkbox
        checkboxes.get(4).click();
        // check if the button is disabled
        expect(getDeleteButtonDisabledAttribute()).toEqual('true');
      });

      it('should display a modal window when checkboxes are checked and the delete button is clicked', function () {
        // click on a check box to activate the delete button
        checkboxes.get(4).click();
        checkboxes.get(2).click();
        checkboxes.get(8).click();
        // verify if the button is active
        expect(getDeleteButtonDisabledAttribute()).toEqual(null);
        //click on delete button
        getDeleteButton().click();
        //check the title
        expect(getModal().element(by.css('.modal-content h3.modal-title')).getText()).toEqual('Confirm delete?');
        // check the modal content
        expect(getModal().element(by.css('.modal-content .modal-body')).getText()).toEqual('These deleted cases will be permanently deleted and will not be stored in the archives.');
      });

      it('should delete 2 cases when 2 cases are selected and the confirmation modal is approved', function () {

        // click on a check box to activate the delete button
        checkboxes.get(5).click();
        checkboxes.get(3).click();
        getDeleteButton().click();
        getModal().element(by.css('#ValidateCaseDeletionBtn')).click();
        //TODO check if the list does not contain the deleted elements when E2E tests will be connected to a real server
      });

      it('should not delete 2 cases when 2 cases are selected and the confirmation modal is dismissed', function () {

        // click on a check box to activate the delete button
        checkboxes.get(5).click();
        checkboxes.get(3).click();
        getDeleteButton().click();
        getModal().element(by.css('#CancelCaseDeletionBtn')).click();
        //TODO check if the list contains the selected elements when E2E tests will be connected to a real server
      });

      it('should select all cases to delete when the column checkboxe is checked', function () {
        // click on the column check box to select all
        checkboxes.get(0).click();
        // verify if the button is active
        expect(getDeleteButtonDisabledAttribute()).toEqual(null);
        //click on delete button
        getDeleteButton().click();
        // check the modal content
        expect(getModal().element(by.css('.modal-content .modal-body')).getText()).toEqual('The deleted case will be permanently deleted and will not be stored in the archives.');
        // Cancel
        getModal().element(by.css('#CancelCaseDeletionBtn')).click();
        browser.waitForAngular();
        // click on the column check box to unselect all
        checkboxes.get(0).click();
        // verify if the button is active
        expect(getDeleteButtonDisabledAttribute()).toEqual('true');
      });

    });
    describe('select All button', function(){
      it('should select all items and try to delete them', function(){
        selectAllCheckbox.click();
        checkboxes.each(function(cb){
          expect(cb.isSelected()).toBeTruthy();
        });
        //click on delete button
        getDeleteButton().click();
        // check the modal content
        expect(getModal().element(by.css('.modal-content .modal-body')).getText()).toEqual('These deleted cases will be permanently deleted and will not be stored in the archives.');
      });
      it('should select all items', function(){
        var selectAllCB = selectAllCheckbox.click();
        selectAllCB.click();
        checkboxes.each(function(cb){
          expect(cb.isSelected()).toBeFalsy();
        });
      });

      it('should select all if some item are selected and selectAll is click', function(){
        checkboxes.get(0).click();
        expect(checkboxes.get(0).isSelected()).toBeTruthy();
        checkboxes.get(1).click();
        expect(checkboxes.get(1).isSelected()).toBeTruthy();
        checkboxes.get(5).click();
        expect(checkboxes.get(5).isSelected()).toBeTruthy();
        checkboxes.get(12).click();
        expect(checkboxes.get(12).isSelected()).toBeTruthy();
        selectAllCheckbox.click();
        checkboxes.each(function(cb){
          expect(cb.isSelected()).toBeTruthy();
        });
      });
    });

  });
})();
