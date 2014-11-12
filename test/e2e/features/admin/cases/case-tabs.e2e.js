(function () {
  'use strict';
  describe('case admin list', function () {

    var activeCaseTab,
      activeCaseA,
      archivedCaseTab,
      archivedCaseA,
      width = 1280,
      height = 800;
    browser.driver.manage().window().setSize(width, height);

    beforeEach(function () {
      browser.get('#/admin/cases/list');


      activeCaseA = element(by.css('#TabActiveCases'));
      archivedCaseA = element(by.css('#TabArchivedCases'));
      activeCaseTab = activeCaseA.getWebElement().findElement(by.xpath('..'));
      archivedCaseTab = archivedCaseA.getWebElement().findElement(by.xpath('..'));
      //browser.debugger(); //launch protractor with debug option and use 'c' in console to continue test execution
    });

    it('should navigate between tabs', function(){
      expect(activeCaseTab.getAttribute('class')).toContain('active');
      expect(archivedCaseTab.getAttribute('class')).not.toContain('active');
      archivedCaseA.click();
      expect(activeCaseTab.getAttribute('class')).not.toContain('active');
      expect(archivedCaseTab.getAttribute('class')).toContain('active');
      archivedCaseA.click();
      expect(activeCaseTab.getAttribute('class')).not.toContain('active');
      expect(archivedCaseTab.getAttribute('class')).toContain('active');
      activeCaseA.click();
      expect(activeCaseTab.getAttribute('class')).toContain('active');
      expect(archivedCaseTab.getAttribute('class')).not.toContain('active');

    });
  });
})();
