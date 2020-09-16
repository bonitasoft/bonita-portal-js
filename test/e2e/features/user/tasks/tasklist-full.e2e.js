import TaskList from './tasklist.page.js';

(() => {
  'use strict';

  describe('tasklist in full size mode', function () {

    var tasklist;

    beforeEach(() => {
      tasklist = TaskList.get();
      tasklist.detailsPanel().collapse();
    });

    afterEach(function () {
      browser.executeScript('window.localStorage.clear();');
      browser.restart();
    });

    it('should display a button on hovered lines', function () {
      var firstLine = tasklist.tableLines().get(0);
      browser.actions().mouseMove(firstLine).perform();

      expect(firstLine.all(by.css('.Cell--with-actions button')).count()).toBe(1);
    });

    it('should NOT display a button on hovered lines for done tasks', function () {
      tasklist.selectDoneTasksFilter();
      var firstLine = tasklist.tableLines().get(0);
      browser.actions().mouseMove(firstLine).perform();

      expect(firstLine.all(by.css('.Cell--with-actions button')).count()).toBe(0);
    });

    it('should open task details pop up when clicking on table line', function() {
      var firstLine = tasklist.tableLines().get(0);

      firstLine.click();

      expect(element(by.css('.modal.TaskDetailsModal')).isPresent()).toBe(true);
    });

  });
})();
