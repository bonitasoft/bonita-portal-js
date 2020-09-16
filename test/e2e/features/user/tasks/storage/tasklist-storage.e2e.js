import TaskList from './../tasklist.page.js';

(function() {

  'use strict';

  describe('tasklist custom page with storage', function() {

      var tasklist;

      afterEach(function() {
          browser.executeScript('window.localStorage.clear();');
          browser.restart();
      });

      it('should save display mode in local storage', function() {
        tasklist = TaskList.get();
        browser.sleep(500);
        expect(tasklist.detailsPanel().isCollapsed()).toBeFalsy();
        expect(element(by.css('.TaskFilters')).isDisplayed()).toBeTruthy();          // filter panel

        tasklist.detailsPanel().collapse();
        element(by.css('.FilterToggle')).click();
        browser.refresh();
        browser.sleep(500);
        tasklist = TaskList.get();
        browser.sleep(500);
        expect(tasklist.detailsPanel().isCollapsed()).toBeTruthy();
        expect(element(by.css('.TaskFilters')).isDisplayed()).toBeFalsy();
      });
  });
})();
