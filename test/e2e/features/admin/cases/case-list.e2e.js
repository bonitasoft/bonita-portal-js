describe('Register', function registerTest() {
  'use strict';

  it('should display the list of the four first cases', function () {
    browser.get('#/admin/cases/list');
    browser.debugger(); //launch protractor with debug option and use 'c' in console to continue test execution
    var caseList = $('#case-list');
    expect(caseList).toBeDefined();
    caseList.getWebElement().findElements(By.css('th.case-column')).then(function (columns) {
      expect(columns.length).toBe(7);
      expect(columns[0].getText()).toContain('AppName');
      expect(columns[1].getText()).toContain('Version');
      expect(columns[2].getText()).toContain('CaseId');
      expect(columns[3].getText()).toContain('StartDate');
      expect(columns[4].getText()).toContain('StartedByFirstname');
      expect(columns[5].getText()).toContain('StartedByLastname');
      expect(columns[6].getText()).toContain('CurrentState');
    });
    caseList.getWebElement().findElements(By.css('tr.case-row')).then(function (cases) {
      expect(cases.length).toBe(4);
    });
    browser.debugger();
    caseList.getWebElement().findElements(By.css('#caseId-1 td')).then(function (makeFunCaseDetails) {
      //console.log(makeFunCaseDetails);
      expect(makeFunCaseDetails[0].getText()).toContain('Pool');
      expect(makeFunCaseDetails[1].getText()).toContain('1.0');
      expect(makeFunCaseDetails[2].getText()).toContain('1');
      expect(makeFunCaseDetails[3].getText()).toContain('2014-10-09 16:35:39.270');
      expect(makeFunCaseDetails[4].getText()).toContain('William');
      expect(makeFunCaseDetails[5].getText()).toContain('Jobs');
      expect(makeFunCaseDetails[6].getText()).toContain('started');
    });
  });
});
