import TaskList from './tasklist.page.js';

(function() {

  'use strict';

  describe('context', function() {

    beforeEach(() => TaskList.get());

    afterEach(function() {
      browser.executeScript('window.localStorage.clear();');
      browser.restart();
    });

    it('should display the form associated to a task', function() {
      var tab = element(by.css('li[heading=Form] a'));
      tab.click();

      expect(element(by.css('iframe'))).toBeDefined();
    });

    it('should display an alert if the form is not assigned to current user', function() {
      var tab = element(by.css('li[heading=Form]'));
      tab.click();
      browser.actions().mouseMove($('.Viewer-overlay')).perform();

      var node = element.all(by.css('.FormOverlay-message')).first();
      expect(node.getAttribute('class')).toMatch('FormOverlay-message');
    });

    it('should not display an alert if the form is assigned to current user', function() {

      element.all(by.repeater('task in tasks')).last().click();
      var node = element(by.css('.TaskDetails .alert'));
      expect(node.isPresent()).toBeFalsy();
    });

    it('should not display a case overview tab if there is no mapping', function(){
      element.all(by.repeater('task in tasks')).first().click();

      var overviewTab = element(by.css('#case-tab'));
      expect(overviewTab.isPresent()).toBe(false);

      var iframe = element(by.css('.CaseViewer iframe'));
      expect(iframe.isPresent()).toBe(false);
    });

    it('should display a case overview tab', function(){
      element.all(by.repeater('task in tasks')).last().click();

      var overviewTab = element(by.css('#case-tab a'));
      expect(overviewTab.isPresent()).toBe(true);

      overviewTab.click();
      var iframe = element(by.css('.CaseViewer iframe'));
      expect(iframe.isPresent()).toBe(true);
    });

  });
})();
