import TaskList from './tasklist.page.js';

(function() {

  'use strict';

  describe('tasklist custom page', function() {

      var tasklist;

      beforeEach(() => {
        tasklist = TaskList.get();
      });

      afterEach(function() {
          browser.executeScript('window.localStorage.clear();');
          browser.restart();
      });

      it('should load a list of task', function() {
          var tasks = tasklist.getTasks();
          expect(tasks.count()).toBe(26);
      });

      it('should have a selected element by default', function() {
          var task = element(by.css('.Line.info'));
          expect(task).toBeDefined();
      });

      it('should change pagination', function() {
          element(by.css('.bo-Settings')).click();
          var test = element.all(by.css('.bo-TableSettings-content .btn-group button')).first().getText();
          element.all(by.css('.bo-TableSettings-content .btn-group button')).first().click();

          var tasks;
          tasklist.getTasks()
              .then(_tasks => tasks = _tasks)
              .then(() => test)
              .then(val => expect(tasks.length).toEqual(parseInt(val, 10)));
      });

      it('should have sorted tasks by default', function() {
          var tasks = tasklist.getTasks();
          tasks.first().all(by.css('td')).get(2).getText().then(function(name) {
              expect(name.trim()).toBe('A Étape1');
          });
      });

      it('should have sort tasks DESC when click on active sort button', function() {
          var sortButtons = element(by.css('.bo-SortButton--active'));
          //Click on the first button
          sortButtons.click();

          var task = element.all(by.css('.Line td:first-child+td+td')).first();

          task.getText().then(function(name) {
              expect(name.trim()).toBe('Z Contract Mail');
          });
      });

      it('should update tasks when navigate using pagination', function() {
          // open table settings
          element.all(by.css('.bo-Settings')).first().click();
          //Select pagination 25
          element.all(by.css('.bo-TableSettings-content .btn-group button')).first().click();

          // Go to last page
          element
              .all(by.repeater('page in pages track by $index'))
              .last()
              .element(by.tagName('a'))
              .click();

          var tasks = tasklist.getTasks();
          expect(tasks.count()).toBe(1);
      });

      it('should toggle Details view menu when click expand', function() {
          var taskList = element(by.css('.TaskList')), originalWidth = 0;

          taskList.getSize()
              .then(function(size) {
                  originalWidth = size.width;
                  tasklist.detailsPanel().collapse();
                  return taskList.getSize();
              })
              .then(function(size) {
                  expect(size.width).toBeGreaterThan(originalWidth);
                  tasklist.detailsPanel().expand();
                  return taskList.getSize();
              })
              .then(function(size) {
                  expect(size.width).toBe(originalWidth);
              });
      });

      it('selectAll should select all task', function() {
          element.all(by.css('th .Cell-ckeckbox input[type=checkbox]')).click();

          var cb = element.all(by.css('.Line input[type=checkbox]'));
          expect(cb.count()).toBe(26);
      });
  });
})();
