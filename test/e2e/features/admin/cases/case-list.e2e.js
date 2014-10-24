/* global element, by, it, describe */
(function() {
  'use strict';
  describe('case admin list', function () {

    var caseList;
    var width = 1920;
    var height = 1080;
    browser.driver.manage().window().setSize(width, height);

    beforeEach(function(){
      browser.get('#/admin/cases/list');
      caseList = element(by.css('#case-list'));
      browser.debugger(); //launch protractor with debug option and use 'c' in console to continue test execution
    });

    describe('table surroundings ', function () {

      it('should contains table headers', function(){
        var columnList = element.all(by.css('#case-list th'));
        expect(columnList.count()).toBe(7);
        expect(columnList.get(1).getText()).toContain('App name');
        expect(columnList.get(2).getText()).toContain('Version');
        expect(columnList.get(3).getText()).toContain('ID');
        expect(columnList.get(4).getText()).toContain('Start date');
        expect(columnList.get(5).getText()).toContain('Started by');
        expect(columnList.get(6).getText()).toContain('State');
      });

      it('should contains page size selection', function(){
        caseList.getWebElement().findElements(By.css('.page-size')).then(function (pageSizes) {
          expect(pageSizes[0].getText()).toContain('25');
          expect(pageSizes[1].getText()).toContain('50');
          expect(pageSizes[2].getText()).toContain('100');
          expect(pageSizes[3].getText()).toContain('200');
        });
        expect(element(by.css('.page-size.active')).getText()).toBe('25');
      });

      it('should contains column selection button', function(){
        var columnSelectionButton = element.all(by.css('#columns-selection'));
        expect(columnSelectionButton.count()).toBe(1);
        expect(columnSelectionButton.get(0).getText()).toBe('Columns');
        columnSelectionButton.all(by.css('.column-visibility')).each(function(column){
          expect(column.getWebElement().isDisplayed()).toBeFalsy();
        });
      });

      it('should contains table footer with result number', function(){
        var resultsInfo = caseList.all(by.css('tfoot #cases-results-size'));
        expect(resultsInfo.count()).toBe(1);
        expect(resultsInfo.get(0).getText()).toBe('Results: 1 to 25 of 28');
      });

      it('should contains table footer with pagination', function(){
        var pagination = caseList.all(by.css('tfoot .pagination'));
        expect(pagination.count()).toBe(1);
        expect(pagination.all(by.css('li')).getText()).toEqual(['«', '‹', '1', '2', '›', '»']);
        expect(pagination.all(by.css('li.disabled')).getText()).toEqual(['«', '‹']);
      });
    });

    describe('column selection', function(){
      it('should display all columns when dropdown is clicked', function(){
        var columnSelectionButton = element(by.css('#columns-selection'));
        columnSelectionButton.click();
        var columnToShowList = columnSelectionButton.all(by.css('.column-visibility'));
        expect(columnToShowList.count()).toBe(6);
        columnToShowList.each(function(column){
          expect(column.getWebElement().isDisplayed()).toBeTruthy();
          expect(column.all(by.css('input:checked')).count()).toBe(1);
        });

        columnSelectionButton.click();
        columnToShowList = columnSelectionButton.all(by.css('.column-visibility'));
        expect(columnToShowList.count()).toBe(6);
        columnToShowList.each(function(column){
          expect(column.getWebElement().isDisplayed()).toBeFalsy();
        });
      });
      it('should hide a column when an item is unselected in dropdown and make it reappeared when clicked', function(){
        var columnSelectionButton = element(by.css('#columns-selection'));
        columnSelectionButton.click();
        var columnToShowList = columnSelectionButton.all(by.css('.column-visibility '));

        columnToShowList.get(0).click();
        expect(columnSelectionButton.all(by.css('.column-visibility')).get(0)
          .all(by.css('input:checked')).count()).toBe(0);
        var columnHeaders = caseList.all(by.css('th.case-column'));
        expect(columnHeaders.count()).toBe(5);
        expect(columnHeaders.getText()).not.toContain(columnToShowList.get(0).getText());
        expect(caseList.all(by.css('#caseId-1 td.case-detail')).count()).toBe(5);

        var nextCheckedElement = columnSelectionButton.all(by.css('.column-visibility input:checked'));
        nextCheckedElement.get(0).click();

        expect(columnSelectionButton.all(by.css('.column-visibility')).get(1)
          .all(by.css('input:checked')).count()).toBe(0);
        expect(caseList.all(by.css('th.case-column')).count()).toBe(4);
        columnHeaders = caseList.all(by.css('th.case-column'));
        expect(columnHeaders.getText()).not.toContain(nextCheckedElement.get(0).getText());
        expect(caseList.all(by.css('#caseId-1 td.case-detail')).count()).toBe(4);

        nextCheckedElement = columnSelectionButton.all(by.css('.column-visibility .column-visibility-name'));
        nextCheckedElement.get(2).click();
        expect(columnSelectionButton.all(by.css('.column-visibility')).get(2)
          .all(by.css('input:checked')).count()).toBe(0);
        columnHeaders = caseList.all(by.css('th.case-column'));
        expect(columnHeaders.getText()).not.toContain(nextCheckedElement.get(2).getText());
        expect(caseList.all(by.css('th.case-column')).count()).toBe(3);
        expect(caseList.all(by.css('#caseId-1 td.case-detail')).count()).toBe(3);

        nextCheckedElement = columnSelectionButton.all(by.css('.column-visibility .column-visibility-name'));
        nextCheckedElement.get(2).click();
        expect(columnSelectionButton.all(by.css('.column-visibility')).get(2)
          .all(by.css('input:checked')).count()).toBe(1);
        columnHeaders = caseList.all(by.css('th.case-column'));
        expect(columnHeaders.getText()).toContain(nextCheckedElement.get(2).getText());
        expect(caseList.all(by.css('th.case-column')).count()).toBe(4);
        expect(caseList.all(by.css('#caseId-1 td.case-detail')).count()).toBe(4);
      });
    });

    describe('column resize', function(){
      var resizeBars;
      beforeEach(function(){
         resizeBars = element.all(by.css('.rc-handle'));
      });
      it('should change Version and ID column size ', function(){
        var idColumnBar = resizeBars.get(2);
        var formerIdColumnLocation = element.all(by.css('table th')).get(3).getLocation();
        var formerVersionColumnLocation = element.all(by.css('table th')).get(2).getLocation();
        var formerStartDateColumnLocation = element.all(by.css('table th')).get(4).getLocation();
        browser.driver.actions().mouseDown(idColumnBar).mouseMove(idColumnBar, { x: -50 }).mouseUp().perform();
        var newIdColumnLocation = element.all(by.css('table th')).get(3).getLocation();
        formerIdColumnLocation.then(function(oldPosition){
          newIdColumnLocation.then(function(newPosition){
            //move is not very accurate, for instance, offset of 50 changed position of 53px
            expect(oldPosition.x - newPosition.x).toBeGreaterThan(45);
            expect(oldPosition.y - newPosition.y).toBe(0);
          });
        });
        var newVersionColumnLocation = element.all(by.css('table th')).get(2).getLocation();
        formerVersionColumnLocation.then(function(oldPosition){
          newVersionColumnLocation.then(function(newPosition){
            expect(oldPosition.x - newPosition.x).toBe(0);
            expect(oldPosition.y - newPosition.y).toBe(0);
          });
        });
        var newStartDateColumnLocation = element.all(by.css('table th')).get(4).getLocation();
        formerStartDateColumnLocation.then(function(oldPosition){
          newStartDateColumnLocation.then(function(newPosition){
            expect(oldPosition.x - newPosition.x).toBe(0);
            expect(oldPosition.y - newPosition.y).toBe(0);
          });
        });
      });
      it('should change increase started Date and Started By column sizes',function(){
        var startedByColumnBar = resizeBars.get(4);
        var formerStartedByColumnLocation = element.all(by.css('table th')).get(5).getLocation();
        var formerStartDateColumnLocation = element.all(by.css('table th')).get(4).getLocation();
        var formerStateColumnLocation = element.all(by.css('table th')).get(6).getLocation();
        browser.driver.actions().mouseDown(startedByColumnBar).mouseMove(startedByColumnBar, { x: 100, y:50 }).mouseUp().perform();
        var newStartedByColumnLocation = element.all(by.css('table th')).get(5).getLocation();
        formerStartedByColumnLocation.then(function(oldPosition){
          newStartedByColumnLocation.then(function(newPosition){
            //move is not very accurate, for instance, offset of 50 changed position of 53px
            expect(oldPosition.x - newPosition.x).toBeLessThan(-95);
            expect(oldPosition.y - newPosition.y).toBe(0);
          });
        });
        var newStartDateColumnLocation = element.all(by.css('table th')).get(4).getLocation();
        formerStartDateColumnLocation.then(function(oldPosition){
          newStartDateColumnLocation.then(function(newPosition){
            expect(oldPosition.x - newPosition.x).toBe(0);
            expect(oldPosition.y - newPosition.y).toBe(0);
          });
        });
        var newStateColumnLocation = element.all(by.css('table th')).get(6).getLocation();
        formerStateColumnLocation.then(function(oldPosition){
          newStateColumnLocation.then(function(newPosition){
            expect(oldPosition.x - newPosition.x).toBe(0);
            expect(oldPosition.y - newPosition.y).toBe(0);
          });
        });
      });
    });

    describe('case admin list content', function(){
      it('should display the list of the 25 first cases and check the specifi content of the first row', function () {
        expect(element.all(by.css('#case-list tr.case-row')).count()).toBe(25);

        caseList.all(by.css('#caseId-1 td')).then(function (poolCaseDetails) {
          expect(poolCaseDetails[1].getText()).toContain('Pool');
          expect(poolCaseDetails[2].getText()).toContain('1.0');
          expect(poolCaseDetails[3].getText()).toContain('1');
          expect(poolCaseDetails[4].getText()).toContain('2014-10-17 16:05');
          expect(poolCaseDetails[5].getText()).toContain('william.jobs');
          expect(poolCaseDetails[6].getText()).toContain('started');
        });
      });

      it('should display the list of the 25 first cases and check its content', function () {
        var caseList = element(by.css('#case-list'));
        expect(caseList).toBeDefined();

        element.all(by.css('#case-list tbody tr.case-row')).each(function(caseRow){
          var caseColumnList = caseRow.all(by.css('td'));
          expect(caseColumnList.count()).toBe(7);
        });
        var caseCheckBoxes = element.all(by.css('#case-list tbody tr.case-row td.case-checkbox input'));
        expect(caseCheckBoxes.count()).toBe(25);
        caseCheckBoxes.getText().then(function(checkboxTextArray) {
          checkboxTextArray.forEach(function(checkboxText){
            expect(checkboxText).toBeFalsy();
          });
        });
        var caseColumns = element.all(by.css('#case-list tbody tr.case-row td.case-detail'));
        expect(caseColumns.count()).toBe(150);
        caseColumns.getText().then(function(caseColumnsTextArray) {
          caseColumnsTextArray.forEach(function(caseColumnsText){
            expect(caseColumnsText).toBeTruthy();
          });
        });
      });
    });
  });
})();
