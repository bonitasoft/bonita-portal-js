/* global element, by, xit */
(function() {
  'use strict';
  describe('case admin list', function () {

    var caseList;

    browser.get('#/admin/cases/list');


    beforeEach(function(){
      caseList = element(by.css('#case-list'));
      //browser.debugger(); //launch protractor with debug option and use 'c' in console to continue test execution
    });

    describe('table surroundings ', function () {

      xit('should contains table headers', function(){
        var columnList = element.all(by.css('#case-list th'));
        expect(columnList.count()).toBe(7);
        expect(columnList.get(1).getText()).toContain('App name');
        expect(columnList.get(2).getText()).toContain('Version');
        expect(columnList.get(3).getText()).toContain('ID');
        expect(columnList.get(4).getText()).toContain('Start date');
        expect(columnList.get(5).getText()).toContain('Started by');
        expect(columnList.get(6).getText()).toContain('State');
      });

      xit('should contains page size selection', function(){
        caseList.getWebElement().findElements(By.css('.page-size')).then(function (pageSizes) {
          expect(pageSizes[0].getText()).toContain('25');
          expect(pageSizes[1].getText()).toContain('50');
          expect(pageSizes[2].getText()).toContain('100');
          expect(pageSizes[3].getText()).toContain('200');
        });
        expect(element(by.css('.page-size.active')).getText()).toBe('25');
      });

      xit('should contains column selection button', function(){
        var columnSelectionButton = element.all(by.css('#columns-selection'));
        expect(columnSelectionButton.count()).toBe(1);
        expect(columnSelectionButton.get(0).getText()).toBe('Columns');
      });

      xit('should contains table footer with result number', function(){
        var resultsInfo = caseList.all(by.css('tfoot #cases-results-size'));
        expect(resultsInfo.count()).toBe(1);
        expect(resultsInfo.get(0).getText()).toBe('Results: 1 to 25 of 320');
      });

      xit('should contains table footer with pagination', function(){
        var pagination = caseList.all(by.css('tfoot .pagination li'));
        expect(pagination.count()).toBe(9);
        expect(pagination.getText()).toEqual(['«', '‹', '1', '2', '3', '4', '5', '›', '»']);
        var paginationDisabled = caseList.all(by.css('tfoot .pagination li.disabled'));
        expect(paginationDisabled.getText()).toEqual(['«', '‹']);
      });
    });

    describe('case admin list content', function(){
      xit('should display the list of the 25 first cases and check the specifi content of the first row', function () {
        expect(element.all(by.css('#case-list tr.case-row')).count()).toBe(25);

        caseList.getWebElement().findElements(By.css('#caseId-1 td')).then(function (poolCaseDetails) {
          expect(poolCaseDetails[1].getText()).toContain('Leave Request');
          expect(poolCaseDetails[2].getText()).toContain('1.0');
          expect(poolCaseDetails[3].getText()).toContain('1');
          expect(poolCaseDetails[4].getText()).toContain('2014-10-17 16:05');
          expect(poolCaseDetails[5].getText()).toContain('walter.bates');
          expect(poolCaseDetails[6].getText()).toContain('started');
        });
      });

      xit('should display the list of the 25 first cases and check its content', function () {
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

    describe('case admin pager', function(){

      it('should display the list of the 25 first cases and navigate using pager', function () {
        var caseList = element(by.css('#case-list'));
        expect(caseList).toBeDefined();
        caseList = element(by.css('#case-list'));
        // check how many lines there are in the table
        // by default it is the first value of the item number (25)
        var caseCheckBoxes = element.all(by.css('#case-list tbody tr.case-row td.case-checkbox input'));
        expect(caseCheckBoxes.count()).toBe(25);
        // retrieve pager links
        var pagination = caseList.all(by.css('tfoot .pagination li a'));
        // before clicking the pager is : |<<|<|1|2|3|4|5|>|>>|
        // click on the 6th element, the 4th page
        pagination.get(5).click();
        // now it must be |<<|<|2|3|4|5|6|>|>>| because we display 5 page links
        var paginationListElementP4 = element.all(by.css('tfoot .pagination li'));
        //check if the 4th page has active class
        browser.debugger();

        expect(paginationListElementP4.get(4).getAttribute('class')).toContain('active');
        // check if we have 25 results because 4*25 < 300
        var caseCheckBoxesP4 = element.all(by.css('#case-list tbody tr.case-row td.case-checkbox input'));
        expect(caseCheckBoxesP4.count()).toBe(25);
        expect(paginationListElementP4.getText()).toEqual(['«', '‹', '2', '3', '4', '5', '6', '›', '»']);

        //return to the first page using the first pager link
        paginationListElementP4.get(0).element(by.css('a')).click();
        // now pager it must be |<<|<|1|2|3|4|5>|>>|
        //browser.debugger();
        var paginationListElementsP1 = caseList.all(by.css('tfoot .pagination li'));
        //check if the first page is the active
        expect(paginationListElementsP1.get(2).getAttribute('class')).toContain('active');
        //click on last page
        paginationListElementsP1.get(8).element(by.css('a')).click();
        // now pager it must be |<<|<|9|10|11|12|13>|>>|
        var paginationListElementsP8 = caseList.all(by.css('tfoot .pagination li'));
        //check if the last page is the last element before the > and >>
        expect(paginationListElementsP8.get(6).getAttribute('class')).toContain('active');
        // check if the last element is 13 => 320 / 25 = 13
        expect(paginationListElementsP8.get(6).getText()).toBe('13');
        // in last page we must have only 20 elements displayed 320 = 25*12 + 20
        var caseCheckBoxesP13 = element.all(by.css('#case-list tbody tr.case-row td.case-checkbox input'));
        expect(caseCheckBoxesP13.count()).toBe(20);

      });
    });









  });
})();
