/* global element, by */
(function () {
  'use strict';
  describe('case admin  buttons', function () {
    var caseList,
      width = 1920,
      height = 1080;
    browser.driver.manage().window().setSize(width, height);

    beforeEach(function () {
      browser.get('#/admin/cases/list');
      caseList = element(by.css('#case-list'));
      //browser.debugger(); //launch protractor with debug option and use 'c' in console to continue test execution
    });
    describe('case list : delete button ', function () {
      function getDeleteButton(){
        return element(by.css('#delete-button'), caseList);
      }
      function getModal(){
        return element(by.css('.modal-dialog'));
      }

      function getCheckboxes() {
        return element.all(by.css('.case-checkbox input[type=checkbox]'), caseList);
      }

      function getDeleteButtonDisabledAttribute() {
        return getDeleteButton().getAttribute('disabled');
      }
      it('should enable delete button when a checkbox is checked', function () {

        // click on a check box to activate the delete button
        getCheckboxes().get(0).click();

        // check if the button is active
        expect(getDeleteButtonDisabledAttribute()).toEqual(null);
      });

      it('should enable delete button when several checkboxes are checked', function () {

        expect(getDeleteButtonDisabledAttribute()).toEqual('true');

        // click on a check box to activate the delete button
        //check a checkbox
        getCheckboxes().get(0).click();

        // check if the button is active
        expect(getDeleteButtonDisabledAttribute()).toEqual(null);

        //check one more checkbox
        getCheckboxes().get(2).click();

        // check if the button is still active
        expect(getDeleteButtonDisabledAttribute()).toEqual(null);

        //check a checkbox
        getCheckboxes().get(4).click();

        // check if the button is still active
        expect(getDeleteButtonDisabledAttribute()).toEqual(null);
      });



      it('should disable delete button when the last checkbox is unchecked', function () {
        // click on several checkboxes to activate the delete button
        getCheckboxes().get(0).click();
        getCheckboxes().get(2).click();
        getCheckboxes().get(4).click();
        //uncheck clicked checkboxes
        getCheckboxes().get(0).click();
        //check the button state at each uncheck action, it it is not the last, the button must be active
        expect(getDeleteButtonDisabledAttribute()).toEqual(null);
        //uncheck clicked checkboxes
        getCheckboxes().get(2).click();
        //check the button state at each uncheck action, it it is not the last, the button must be active
        expect(getDeleteButtonDisabledAttribute()).toEqual(null);
        //uncheck last clicked checkbox
        getCheckboxes().get(4).click();
        //check the button state at each uncheck action, it is the last : the button must be inactive
        expect(getDeleteButtonDisabledAttribute()).toEqual('true');
      });

      it('should disable delete button when one checked checkbox is unchecked', function () {
        // click on a check box to activate the delete button
        getCheckboxes().get(4).click();
        // verify if the button is active
        expect(getDeleteButtonDisabledAttribute()).toEqual(null);
        // uncheck the checkbox
        getCheckboxes().get(4).click();
        // check if the button is disabled
        expect(getDeleteButtonDisabledAttribute()).toEqual('true');
      });

      it('should display a modal window when checkboxes are checked and the delete button is clicked', function () {
        // click on a check box to activate the delete button
        getCheckboxes().get(4).click();
        getCheckboxes().get(2).click();
        getCheckboxes().get(8).click();
        // verify if the button is active
        expect(getDeleteButtonDisabledAttribute()).toEqual(null);
        //click on delete button
        getDeleteButton().click();
        //check the title
        expect(getModal().element(by.css('.modal-content h3.modal-title')).getText()).toEqual('Case Deletion');
        // check the modal content
        expect(getModal().element(by.css('.modal-content .modal-body')).getText()).toEqual('Delete the selected 3 cases ?');
      });

      it('should delete 2 cases when 2 cases are selected and the confirmation modal is approved', function () {

        // click on a check box to activate the delete button
        getCheckboxes().get(5).click();
        getCheckboxes().get(3).click();
        getDeleteButton().click();
        getModal().element(by.css('#ValidateCaseDeletionBtn')).click();
        //TODO check if the list does not contain the deleted elements when E2E tests will be connected to a real server
      });

      it('should not delete 2 cases when 2 cases are selected and the confirmation modal is dismissed', function () {

        // click on a check box to activate the delete button
        getCheckboxes().get(5).click();
        getCheckboxes().get(3).click();
        getDeleteButton().click();
        getModal().element(by.css('#CancelCaseDeletionBtn')).click();
        //TODO check if the list contains the selected elements when E2E tests will be connected to a real server
      });

    });


  });
})();
