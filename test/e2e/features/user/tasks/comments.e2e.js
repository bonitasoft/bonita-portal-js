import TaskList from './tasklist.page.js';

(function() {

  'use strict';

  describe('comments tab', () => {

    beforeEach(() => TaskList.get());

    afterEach(function() {
      browser.executeScript('window.localStorage.clear();');
    });

    it('should display task\'s case human comments ordered by postDate descendant' , function() {
      var tab = element(by.css('li[heading=Comments] a'));
      tab.click();

      var comments = element.all(by.css('.Comment'));
      expect(comments.count()).toBe(2);
      expect(comments.get(0).element(by.css('.Comment-header')).getText()).toBe('Walter Bates Mar 9, 2016 4:33 PM');
      expect(comments.get(0).element(by.css('.Comment-content ')).getText()).toBe('This is a human comment');
      expect(comments.get(1).element(by.css('.Comment-header')).getText()).toBe('Hellen Kelly Mar 10, 2016 12:22 PM');
      expect(comments.get(1).element(by.css('.Comment-content')).getText()).toBe('This is another human comment');
    });

    it('should allow user to add a comment', function() {
      var tab = element(by.css('li[heading=Comments] a'));
      tab.click();

      element(by.css('.CommentForm .form-control')).sendKeys('Here is a new comment');
      element(by.css('.CommentForm button[type=submit]')).click();

      // TODO add expectations, not possible with actual mock server
    });

    it('should not allow user to add a comment on a task of an archived case', function() {
      // filter done tasks
      element.all(by.css('.TaskFilters li a')).get(2).click();

      // select task associated to an archived case
      element(by.cssContainingText('.TaskTable tbody tr td', 'TaskFromArchivedCase')).click();

      var tab = element(by.css('li[heading=Comments] a'));
      tab.click();

      expect(element(by.css('.CommentForm button[type=submit]')).isEnabled()).toBeFalsy();
      expect(element(by.css('.CommentForm .CommentForm-disabledMsg')).isPresent()).toBeTruthy();
      expect(element(by.css('.CommentForm .CommentForm-disabledMsg')).getText()).toBe('The case is archived. You cannot add comments anymore');
    });

    it('should display archived human comments on a task of an archived case', function() {
      // filter done tasks
      element.all(by.css('.TaskFilters li a')).get(2).click();

      // select task associated to an archived case
      element(by.cssContainingText('.TaskTable tbody tr td', 'TaskFromArchivedCase')).click();

      var tab = element(by.css('li[heading=Comments] a'));
      tab.click();

      var comments = element.all(by.css('.Comment'));
      expect(comments.count()).toBe(2);
      expect(comments.get(0).element(by.css('.Comment-header')).getText()).toBe('Walter Bates Mar 8, 2016 4:26 PM');
      expect(comments.get(0).element(by.css('.Comment-content ')).getText()).toBe('This is an archived human comment');
      expect(comments.get(1).element(by.css('.Comment-header')).getText()).toBe('Hellen Kelly Mar 12, 2016 4:26 PM');
      expect(comments.get(1).element(by.css('.Comment-content')).getText()).toBe('This is another archived human comment');
    });

  });
})();
