/* global element, by */
describe('Register', function registerTest() {
  'use strict';

  it('should display the list of the 28 first cases', function () {
    browser.get('#/admin/cases/list');
    browser.debugger(); //launch protractor with debug option and use 'c' in console to continue test execution
    var caseList = element(by.css('#case-list'));
    expect(caseList).toBeDefined();
    caseList.getWebElement().findElements(By.css('th.case-column')).then(function (columns) {
      expect(columns.length).toBe(6);
      expect(columns[0].getText()).toContain('App name');
      expect(columns[1].getText()).toContain('Version');
      expect(columns[2].getText()).toContain('ID');
      expect(columns[3].getText()).toContain('Start date');
      expect(columns[4].getText()).toContain('Started by');
      expect(columns[5].getText()).toContain('State');
    });
    caseList.getWebElement().findElements(By.css('tr.case-row')).then(function (cases) {
      expect(cases.length).toBe(25);
    });
    caseList.getWebElement().findElements(By.css('#caseId-1 td')).then(function (makeFunCaseDetails) {
      //console.log(makeFunCaseDetails);
      expect(makeFunCaseDetails[1].getText()).toContain('Pool');
      expect(makeFunCaseDetails[2].getText()).toContain('1.0');
      expect(makeFunCaseDetails[3].getText()).toContain('1');
      expect(makeFunCaseDetails[4].getText()).toContain('2014-10-17 16:05');
      expect(makeFunCaseDetails[5].getText()).toContain('william.jobs');
      expect(makeFunCaseDetails[6].getText()).toContain('started');
    });
    caseList.getWebElement().findElements(By.css('.page-size')).then(function (pageSizes) {
      expect(pageSizes[0].getText()).toContain('25');
      expect(pageSizes[1].getText()).toContain('50');
      expect(pageSizes[2].getText()).toContain('100');
      expect(pageSizes[3].getText()).toContain('200');
    });
    browser.debugger();
    var columnSelectionButton = element.all(by.css('#columns-selection'));
    expect(columnSelectionButton.count()).toBe(1);
    expect(columnSelectionButton.get(0).getText()).toBe('Columns');

    var columnSelectionList = element.all(by.css('.column-visibility'));
    console.log(columnSelectionList);
    expect(columnSelectionList.length).toBeUndefined();

  });



});
