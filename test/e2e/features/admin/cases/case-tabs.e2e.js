(function () {
  'use strict';
  describe('case admin tabs', function () {

    var activeCaseTab,
      archivedCaseTab,
      width = 1280,
      height = 800;
    browser.driver.manage().window().setSize(width, height);

    beforeEach(function () {
      browser.get('#/admin/cases/list');

      activeCaseTab = element(by.xpath('//li[a/@id="TabActiveCases"]'));
      archivedCaseTab = element(by.xpath('//li[a/@id="TabArchivedCases"]'));
      //browser.debugger(); //launch protractor with debug option and use 'c' in console to continue test execution
    });

    it('should navigate between tabs', function(){
      expect(activeCaseTab.getAttribute('class')).toContain('active');
      expect(archivedCaseTab.getAttribute('class')).not.toContain('active');
      browser.setLocation('/admin/cases/list/archived');
      expect(activeCaseTab.getAttribute('class')).not.toContain('active');
      expect(archivedCaseTab.getAttribute('class')).toContain('active');
      browser.setLocation('/admin/cases/list/archived');
      expect(activeCaseTab.getAttribute('class')).not.toContain('active');
      expect(archivedCaseTab.getAttribute('class')).toContain('active');
      browser.setLocation('/admin/cases/list');
      expect(activeCaseTab.getAttribute('class')).toContain('active');
      expect(archivedCaseTab.getAttribute('class')).not.toContain('active');

    });
  });
})();
