/* global element, by */
(function () {
  'use strict';
  describe('case admin list', function () {

    var caseList,
      width = 1280,
      height = 800;
    browser.driver.manage().window().setSize(width, height);

    beforeEach(function () {
      browser.get('#/admin/cases/list/archived');
      caseList = element(by.css('#case-list'));
      //browser.debugger(); //launch protractor with debug option and use 'c' in console to continue test execution
    });

    describe('table surroundings ', function () {
      it('should contains table headers', function () {
        var columnList = element.all(by.css('#case-list th'));
        expect(columnList.count()).toBe(9);
        expect(columnList.get(1).getText()).toContain('ID');
        expect(columnList.get(2).getText()).toContain('Process name');
        expect(columnList.get(3).getText()).toContain('Version');
        expect(columnList.get(4).getText()).toContain('Start date');
        expect(columnList.get(5).getText()).toContain('Started by');
        expect(columnList.get(6).getText()).toContain('End date');
        expect(columnList.get(7).getText()).toContain('State');
      });
      it('should contains page size selection', function () {
        expect(element(By.css('#page-size')).getText()).toBe('25');
      });
      it('should contains column selection button', function () {
        var columnSelectionButton = element.all(by.css('#columns-selection'));
        expect(columnSelectionButton.count()).toBe(1);
        expect(columnSelectionButton.get(0).getText()).toBe('Columns');
        columnSelectionButton.all(by.css('.column-visibility')).each(function (column) {
          expect(column.getWebElement().isDisplayed()).toBeFalsy();
        });
      });
      it('should contains table footer with result number', function () {
        var resultsInfo = caseList.all(by.css('#cases-results-size'));
        expect(resultsInfo.count()).toBe(1);
        expect(resultsInfo.get(0).getText()).toBe('1 to 25 of 320');
      });
      it('should contains table footer with pagination', function () {
        var pagination = caseList.all(by.css('.pagination'));
        expect(pagination.count()).toBe(1);
        expect(pagination.all(by.css('li')).getText()).toEqual(['«', '‹', '1', '2', '3', '4', '5', '›', '»']);
        expect(pagination.all(by.css('li.disabled')).getText()).toEqual(['«', '‹']);
      });
    });

    describe('column selection', function () {
      it('should display all columns when dropdown is clicked', function () {
        var columnSelectionButton = element(by.css('#columns-selection button'));
        columnSelectionButton.click();
        var columnToShowList = element.all(by.css('#columns-selection li.column-visibility'));
        expect(columnToShowList.count()).toBe(7);
        columnToShowList.each(function (column) {
          expect(column.getWebElement().isDisplayed()).toBeTruthy();
          expect(column.all(by.css('input:checked')).count()).toBe(1);
        });

        columnSelectionButton.click();
        columnToShowList = columnSelectionButton.all(by.css('#columns-selection li.column-visibility'));
        expect(columnToShowList.count()).toBe(0);
        columnToShowList.each(function (column) {
          expect(column.getWebElement().isDisplayed()).toBeFalsy();
        });
      });
      it('should hide a column when an item is unselected in dropdown and make it reappeared when clicked', function () {
        var columnSelectionButton = element(by.css('#columns-selection button'));
        columnSelectionButton.click();
        var columnToShowNameList = element.all(by.css('#columns-selection .column-visibility input'));

        expect(element.all(by.css('#columns-selection input')).get(0).isSelected()).toBeTruthy();
        columnToShowNameList.get(0).click();
        expect(element.all(by.css('#columns-selection input')).get(0).isSelected()).toBeFalsy();
        var columnHeaders = caseList.all(by.css('th.case-column'));
        expect(columnHeaders.count()).toBe(6);
        expect(columnHeaders.getText()).not.toContain('Process Name');
        expect(caseList.all(by.css('#caseId-1 td.case-detail')).count()).toBe(6);

        var nextCheckedElement = element.all(by.css('.column-visibility input:checked'));
        expect(nextCheckedElement.count()).toBe(6);
        nextCheckedElement.get(0).click();

        expect(element.all(by.css('#columns-selection input')).count()).toBe(7);
        expect(element.all(by.css('#columns-selection input')).get(1).isSelected()).toBeFalsy();
        expect(caseList.all(by.css('th.case-column')).count()).toBe(5);
        columnHeaders = caseList.all(by.css('th.case-column'));
        expect(columnHeaders.getText()).not.toContain(nextCheckedElement.get(0).getText());
        expect(caseList.all(by.css('#caseId-1 td.case-detail')).count()).toBe(5);

        nextCheckedElement = element.all(by.css('#columns-selection .column-visibility input'));
        nextCheckedElement.get(2).click();
        expect(element.all(by.css('#columns-selection input')).get(2).isSelected()).toBeFalsy();
        columnHeaders = caseList.all(by.css('th.case-column'));
        expect(columnHeaders.getText()).not.toContain('ID');
        expect(caseList.all(by.css('th.case-column')).count()).toBe(4);
        expect(caseList.all(by.css('#caseId-1 td.case-detail')).count()).toBe(4);

        columnToShowNameList.get(2).click();
        expect(element.all(by.css('#columns-selection input')).get(2).isSelected()).toBeTruthy();
        columnHeaders = caseList.all(by.css('th.case-column'));
        expect(columnHeaders.getText()).toContain('Version');
        expect(caseList.all(by.css('th.case-column')).count()).toBe(5);
        expect(caseList.all(by.css('#caseId-1 td.case-detail')).count()).toBe(5);
      });
    });

    describe('column resize', function () {
      var resizeBars;
      beforeEach(function () {
        resizeBars = element.all(by.css('.rc-handle'));
      });
      xit('should change Version and ID column size ', function () {
        var idColumnBar = resizeBars.get(2);
        var formerIdColumnLocation = element.all(by.css('table th')).get(3).getLocation();
        var formerVersionColumnLocation = element.all(by.css('table th')).get(2).getLocation();
        var formerStartDateColumnLocation = element.all(by.css('table th')).get(4).getLocation();
        browser.driver.actions().mouseDown(idColumnBar).mouseMove(idColumnBar, {x: -50}).mouseUp().perform();
        var newIdColumnLocation = element.all(by.css('table th')).get(3).getLocation();
        formerIdColumnLocation.then(function (oldPosition) {
          newIdColumnLocation.then(function (newPosition) {
            //move is not very accurate, for instance, offset of 50 changed position of 53px
            expect(oldPosition.x - newPosition.x).toBeGreaterThan(40);
            expect(oldPosition.y - newPosition.y).toBe(0);
          });
        });
        var newVersionColumnLocation = element.all(by.css('table th')).get(2).getLocation();
        formerVersionColumnLocation.then(function (oldPosition) {
          newVersionColumnLocation.then(function (newPosition) {
            expect(oldPosition.x - newPosition.x).toBeGreaterThan(-1);
            expect(oldPosition.y - newPosition.y).toBe(0);
          });
        });
        var newStartDateColumnLocation = element.all(by.css('table th')).get(4).getLocation();
        formerStartDateColumnLocation.then(function (oldPosition) {
          newStartDateColumnLocation.then(function (newPosition) {
            expect(oldPosition.x - newPosition.x).toBeLessThan(1);
            expect(oldPosition.y - newPosition.y).toBe(0);
          });
        });
      });
      it('should change increase started Date and Started By column sizes', function () {
        var startedByColumnBar = resizeBars.get(4);
        var formerStartedByColumnLocation = element.all(by.css('table th')).get(5).getLocation();
        var formerStartDateColumnLocation = element.all(by.css('table th')).get(4).getLocation();
        var formerStateColumnLocation = element.all(by.css('table th')).get(6).getLocation();
        browser.driver.actions().mouseDown(startedByColumnBar).mouseMove(startedByColumnBar, {
          x: 100,
          y: 50
        }).mouseUp().perform();
        var newStartedByColumnLocation = element.all(by.css('table th')).get(5).getLocation();
        formerStartedByColumnLocation.then(function (oldPosition) {
          newStartedByColumnLocation.then(function (newPosition) {
            //move is not very accurate, for instance, offset of 50 changed position of 53px
            expect(oldPosition.x - newPosition.x).toBeLessThan(75);
            expect(oldPosition.y - newPosition.y).toBe(0);
          });
        });
        var newStartDateColumnLocation = element.all(by.css('table th')).get(4).getLocation();
        formerStartDateColumnLocation.then(function (oldPosition) {
          newStartDateColumnLocation.then(function (newPosition) {
            expect(oldPosition.x - newPosition.x).toBeGreaterThan(-5);
            expect(oldPosition.x - newPosition.x).toBeLessThan(32);
            expect(oldPosition.y - newPosition.y).toBe(0);
          });
        });
        var newStateColumnLocation = element.all(by.css('table th')).get(6).getLocation();
        formerStateColumnLocation.then(function (oldPosition) {
          newStateColumnLocation.then(function (newPosition) {
            expect(oldPosition.x - newPosition.x).toBeLessThan(1);
            expect(oldPosition.y - newPosition.y).toBe(0);
          });
        });
      });
    });

    describe('sort', function () {
      var tableHeader;
      beforeEach(function () {
        tableHeader = element.all(by.css('table th.pointer div'));
      });
      it('should order by date asc', function () {
        tableHeader.get(2).click();
        expect(tableHeader.get(2).getText()).toContain('Start date');
        expect(element.all(by.xpath('//table//th[5]//div/span[2]')).getAttribute('class')).toEqual(['glyphicon glyphicon-chevron-up']);
        expect(element.all(by.css('.glyphicon-chevron-up')).count()).toBe(1);
        expect(element(by.css('.glyphicon-chevron-down')).isElementPresent()).toBeFalsy();
        expect(caseList.all(by.css('tbody tr')).get(0).all(by.css('td')).getText()).toEqual(['', '1', 'Pool', '1.0', '10/16/2014 4:05:48 PM', 'william.jobs', '11/02/2014 10:07:43 AM', 'started', '']);
      });
      it('should order by date desc', function () {
        tableHeader.get(2).click();
        tableHeader.get(2).click();
        expect(element.all(by.xpath('//table//th[5]//div/span[2]')).getAttribute('class')).toEqual(['glyphicon glyphicon-chevron-down']);
        expect(element.all(by.css('.glyphicon-chevron-down')).count()).toBe(1);
        expect(element(by.css('.glyphicon-chevron-up')).isElementPresent()).toBeFalsy();
        expect(caseList.all(by.css('tbody tr')).get(0).all(by.css('td')).getText()).toEqual(['', '1', 'ProcessX', '2.0', '10/20/2014 10:08:29 AM', 'william.jobs', '11/02/2014 10:07:43 AM', 'started', '']);
      });
    });

    describe('case admin list content', function () {
      it('should display the list of the 25 first cases and check the specifi content of the first row', function () {
        expect(element.all(by.css('#case-list tr.case-row')).count()).toBe(25);

        caseList.all(by.css('#caseId-1 td')).then(function (poolCaseDetails) {
          expect(poolCaseDetails[1].getText()).toContain('1');
          expect(poolCaseDetails[2].getText()).toContain('Leave Request');
          expect(poolCaseDetails[3].getText()).toContain('1.0');
          expect(poolCaseDetails[4].getText()).toContain('10/17/2014 4:05:42 PM');
          expect(poolCaseDetails[5].getText()).toContain('walter.bates');
          expect(poolCaseDetails[6].getText()).toContain('11/02/2014 10:07:43 AM');
          expect(poolCaseDetails[7].getText()).toContain('started');
        });
      });

      it('should display the list of the 25 first cases and check its content', function () {
        var caseList = element(by.css('#case-list'));
        expect(caseList).toBeDefined();

        element.all(by.css('#case-list tbody tr.case-row')).each(function (caseRow) {
          var caseColumnList = caseRow.all(by.css('td'));
          expect(caseColumnList.count()).toBe(9);
        });
        var caseCheckBoxes = element.all(by.css('#case-list tbody tr.case-row td.case-checkbox input'));
        expect(caseCheckBoxes.count()).toBe(25);
        caseCheckBoxes.getText().then(function (checkboxTextArray) {
          checkboxTextArray.forEach(function (checkboxText) {
            expect(checkboxText).toBeFalsy();
          });
        });
        var caseColumns = element.all(by.css('#case-list tbody tr.case-row td.case-detail'));
        expect(caseColumns.count()).toBe(175);
        caseColumns.getText().then(function (caseColumnsTextArray) {
          caseColumnsTextArray.forEach(function (caseColumnsText) {
            expect(caseColumnsText).toBeTruthy();
          });
        });
      });
    });

    describe('case admin pager', function () {
      it('should display the list of the 25 first cases and navigate using pager', function () {
        var caseList = element(by.css('#case-list'));
        expect(caseList).toBeDefined();
        // check how many lines there are in the table
        // by default it is the first value of the item number (25)
        var caseCheckBoxes = element.all(by.css('#case-list tbody tr.case-row td.case-checkbox input'));
        expect(caseCheckBoxes.count()).toBe(25);
        // retrieve pager links
        var pagination = caseList.all(by.css('.pagination li a'));
        // before clicking the pager is : |<<|<|1|2|3|4|5|>|>>|
        // click on the 6th element, the 4th page
        pagination.get(5).click();
        // now it must be |<<|<|2|3|4|5|6|>|>>| because we display 5 page links
        var paginationListElementP4 = element.all(by.css('.pagination li'));
        //check if the 4th page has active class
        expect(paginationListElementP4.get(4).getAttribute('class')).toContain('active');
        // check if we have 25 results because 4*25 < 300
        var caseCheckBoxesP4 = element.all(by.css('#case-list tbody tr.case-row td.case-checkbox input'));
        expect(caseCheckBoxesP4.count()).toBe(25);
        expect(paginationListElementP4.getText()).toEqual(['«', '‹', '2', '3', '4', '5', '6', '›', '»']);

        //return to the first page using the first pager link
        paginationListElementP4.get(0).element(by.css('a')).click();
        // now pager it must be |<<|<|1|2|3|4|5>|>>|
        var paginationListElementsP1 = caseList.all(by.css('.pagination li'));
        //check if the first page is the active
        expect(paginationListElementsP1.get(2).getAttribute('class')).toContain('active');
        //click on last page
        paginationListElementsP1.get(8).element(by.css('a')).click();
        // now pager it must be |<<|<|9|10|11|12|13>|>>|
        var paginationListElementsP8 = caseList.all(by.css('.pagination li'));
        //check if the last page is the last element before the > and >>
        expect(paginationListElementsP8.get(6).getAttribute('class')).toContain('active');
        // check if the last element is 13 => 320 / 25 = 13
        expect(paginationListElementsP8.get(6).getText()).toBe('13');
        // in last page we must have only 20 elements displayed 320 = 25*12 + 20
        var caseCheckBoxesP13 = element.all(by.css('#case-list tbody tr.case-row td.case-checkbox input'));
        expect(caseCheckBoxesP13.count()).toBe(20);
      });
      it('should reset the pager when item displayed number is clicked', function () {
        var caseList = element(by.css('#case-list'));
        //browser.debugger();
        // |<<|<|1|2|3|4|5>|>>|
        //click on the 4th page
        var pagination = caseList.all(by.css('.pagination li a'));
        pagination.get(5).click();
        // get the fourth page pager
        var paginationP4 = caseList.all(by.css('.pagination li'));

        expect(paginationP4.get(4).getAttribute('class')).toContain('active');
        // click on the third number of page size buttons
        var itemDisplayedNumber = caseList.all(by.css('#page-size button'));
        itemDisplayedNumber.click();
        element.all(by.css('.items-per-page')).get(2).click();
        // 1st page must be the active
        expect(caseList.all(by.css('.pagination li')).get(2).getAttribute('class')).toContain('active');
      });
    });


    describe('case admin displayed items per page', function () {
      it('should reset the pager when item displayed number is clicked', function () {
        var caseList = element(by.css('#case-list'));

        // click on the third number of page size buttons
        var itemDisplayedNumber = caseList.all(by.css('#page-size button'));
        itemDisplayedNumber.click();
        browser.debugger();

        var itemsPerPageChoices = element.all(by.css('.items-per-page'));
        itemsPerPageChoices.get(0).click();

        // 1st page must be the active
        // by default it is the first value of the item number (25)
        var caseCheckBoxes25 = element.all(by.css('#case-list tbody tr.case-row td.case-checkbox input'));
        expect(caseCheckBoxes25.count()).toBe(25);

        itemDisplayedNumber.click();
        itemsPerPageChoices.get(1).click();
        var caseCheckBoxes50 = element.all(by.css('#case-list tbody tr.case-row td.case-checkbox input'));
        expect(caseCheckBoxes50.count()).toBe(50);

        itemDisplayedNumber.click();
        itemsPerPageChoices.get(2).click();
        var caseCheckBoxes100 = element.all(by.css('#case-list tbody tr.case-row td.case-checkbox input'));
        expect(caseCheckBoxes100.count()).toBe(100);

        itemDisplayedNumber.click();
        itemsPerPageChoices.get(3).click();
        caseCheckBoxes100 = element.all(by.css('#case-list tbody tr.case-row td.case-checkbox input'));
        expect(caseCheckBoxes100.count()).toBe(200);

      });
    });


    describe('case admin select all buttons', function () {
      it('should select all checkboxes when selectAllCB is clicked', function () {
        var selectAllCB = element(by.css('th.case-checkbox input'));
        selectAllCB.click();
        var checkedCasesCB = element.all(by.css('td.case-checkbox input:checked'));
        expect(checkedCasesCB.count()).toBe(25);
        checkedCasesCB.get(0).click();
        checkedCasesCB = element.all(by.css('td.case-checkbox input:checked'));
        expect(checkedCasesCB.count()).toBe(24);
        selectAllCB.click();
        checkedCasesCB = element.all(by.css('td.case-checkbox input:checked'));
        expect(checkedCasesCB.count()).toBe(0);
      });
    });
  });
})();
