import TaskList from './tasklist.page.js';

(function() {

  'use strict';

  describe('tasklist custom page filters', function() {

      var tasklist;

      afterEach(function() {
          browser.executeScript('window.localStorage.clear();');
          browser.restart();
      });

      it('should search an element', function() {
          tasklist = TaskList.get();
          element(by.id('search')).sendKeys('app');
          element(by.id('search')).sendKeys(protractor.Key.ENTER);

          var tasks = tasklist.getTasks();
          expect(tasks.count()).toBe(2);

      });

      it('should go to filtered task by case id', function() {
          tasklist = TaskList.get({ case: 6 });
          var tasks = tasklist.getTasks();
          expect(tasks.count()).toBe(2);
      });

      it('should filter task by case id', function() {
          tasklist = TaskList.get();
          element(by.css('#case')).sendKeys('6').sendKeys(protractor.Key.ENTER);

          var tasks = tasklist.getTasks();
          expect(tasks.count()).toBe(2);
      });

      it('should filter task by process', function() {
          tasklist = TaskList.get();
          element(by.css('.Filter-process .btn')).click();

          var processes = element.all(by.repeater('p in app.processes'));
          // 2 process + All
          expect(processes.count()).toEqual(3);

          //select last process
          processes.last().element(by.css('.processOptionLink')).click();
          var tasks = tasklist.getTasks();
          expect(tasks.count()).toBe(2);
      });

      it('should have a selected list item', function() {
         tasklist = TaskList.get();
          var activeFilter = element(by.css('.TaskFilters .active'));
          expect(activeFilter.isPresent()).toBe(true);

      });

      it('should filter my tasks', function() {
          tasklist = TaskList.get();
          // select My task
          element.all(by.css('.TaskFilters li a')).get(1).click();

          var link = element(by.css('.TaskFilters .active'))
              .getWebElement()
              .getText();

          expect(link).toMatch(/my tasks/i);

          var tasks = tasklist.getTasks();
          expect(tasks.count()).toBe(2);
      });

      it('should set filter to done', function() {
          tasklist = TaskList.get({filter: 'done'});
          var link = element(by.css('.TaskFilters .active'))
              .getWebElement()
              .getText();
          expect(link).toMatch(/done/i);

          var tasks = tasklist.getTasks();
          expect(tasks.count()).toBe(5);
      });

      it('should filter done tasks', function() {
          tasklist = TaskList.get();
          element.all(by.css('.TaskFilters li a')).get(2).click();

          var link = element(by.css('.TaskFilters .active'))
              .getWebElement()
              .getText();
          expect(link).toMatch(/done/i);

          var tasks = tasklist.getTasks();
          expect(tasks.count()).toBe(5);
      });

      it('should toggle tasks filters menu when click toggle filters', function() {
          tasklist = TaskList.get();
          var toggleMenu = element(by.css('.FilterToggle'));
          var taskList = element(by.css('.TaskList'));
          var originalWidth = 0;

          taskList.getSize()
              .then(function(size) {
                  originalWidth = size.width;
                  toggleMenu.click();
                  return taskList.getSize();
              })
              .then(function(size) {
                  expect(size.width).toBeGreaterThan(originalWidth);
                  toggleMenu.click();
                  return taskList.getSize();
              })
              .then(function(size) {
                  expect(size.width).toBe(originalWidth);
              });
      });
  });
})();
