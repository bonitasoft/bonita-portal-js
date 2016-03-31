import TaskList from './tasklist.page.js'

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

      var comments = element.all(by.css('.CaseComments-Comment'));
      expect(comments.count()).toBe(2);
      expect(comments.get(0).element(by.css('.CaseComments-CommentHeader')).getText()).toBe('Walter Bates added a comment - Mar 9, 2016 4:33 PM');
      expect(comments.get(0).element(by.css('.CaseComments-CommentContent ')).getText()).toBe('This is a human comment');
      expect(comments.get(1).element(by.css('.CaseComments-CommentHeader')).getText()).toBe('Hellen Kelly added a comment - Mar 10, 2016 12:22 PM');
      expect(comments.get(1).element(by.css('.CaseComments-CommentContent')).getText()).toBe('This is another human comment');
    });

    it('should allow user to add a comment', function() {
      var tab = element(by.css('li[heading=Comments] a'));
      tab.click();

      element(by.css('.CaseComments-AddComment .form-control')).sendKeys('Here is a new comment');
      element(by.css('.CaseComments-AddComment button[type=submit]')).click();

      // TODO add expectations, not possible with actual mock server
    });

    it('should not allow user to add a comment on a task of an archived case', function() {
      // filter done tasks
      element.all(by.css('.TaskFilters li a')).get(3).click();

      var tab = element(by.css('li[heading=Comments] a'));
      tab.click();

      // select task associated to an archived case
      element(by.cssContainingText('.TaskTable tbody tr td', 'TaskFromArchivedCase')).click();

      expect(element(by.css('.CaseComments-AddComment')).isPresent()).toBeFalsy();
    });

    it('should should display archived human comments on a task of an archived case', function() {
      // filter done tasks
      element.all(by.css('.TaskFilters li a')).get(3).click();

      var tab = element(by.css('li[heading=Comments] a'));
      tab.click();

      // select task associated to an archived case
      element(by.cssContainingText('.TaskTable tbody tr td', 'TaskFromArchivedCase')).click();

      //browser.pause();

      var comments = element.all(by.css('.CaseComments-Comment'));
      expect(comments.count()).toBe(2);
      expect(comments.get(0).element(by.css('.CaseComments-CommentHeader')).getText()).toBe('Walter Bates added a comment - Mar 8, 2016 4:26 PM');
      expect(comments.get(0).element(by.css('.CaseComments-CommentContent ')).getText()).toBe('This is an archived human comment');
      expect(comments.get(1).element(by.css('.CaseComments-CommentHeader')).getText()).toBe('Hellen Kelly added a comment - Mar 12, 2016 4:26 PM');
      expect(comments.get(1).element(by.css('.CaseComments-CommentContent')).getText()).toBe('This is another archived human comment');
      // cannot add a new comment
      expect(element(by.css('.CaseComments-AddComment')).isPresent()).toBeFalsy();
    });

  });
})();
