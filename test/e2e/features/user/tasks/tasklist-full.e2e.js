import TaskList from './tasklist.page.js';

(function() {

  'use strict';

  describe('tasklist custom page', function () {

    beforeEach(() = > TaskList.get()
    )
    ;

    afterEach(function () {
      browser.executeScript('window.localStorage.clear();');
    });

    describe('Full list', function () {
      beforeEach(function () {
        element(by.css('.TaskDetails .SizeBar-reduce')).click();
      });

      it('should display buttons on the selected Line', function () {
        var actions = element.all(by.css('.Line.info .Cell--with-actions button'));

        expect(actions.count()).toBe(2);
      });

      describe('Do task', function () {
        it('should open a popup with a form', function () {
          var actions = element.all(by.css('.Line.info .Cell--with-actions button'));
          actions.first().click();

          browser.wait(function () {
            var popup = element(by.css('.modal'));
            return popup.isPresent();
          }, 500);

          var formViewer = element(by.css('.modal .FormViewer'));
          expect(formViewer.isPresent()).toBe(true);
        });

        it('should not be displayed for done tasks', function () {
          element(by.css('.TaskFilters li a#done-tasks')).click();

          var actions = element.all(by.css('.Line.info .Cell--with-actions button'));

          expect(actions.count()).toBe(1);
          var buttonTitle = actions.first()
            .getWebElement()
            .getAttribute('title');
          expect(buttonTitle).toMatch(/view/i);
        });
      });

      describe('View task', function () {

        beforeEach(function () {
          var actions = element.all(by.css('.Line.info .Cell--with-actions button'));
          actions.last().click();
        });

        it('should open a popup with a case overview', function () {

          var popup = element(by.css('.modal'));
          expect(popup.isPresent()).toBe(true);

          var iframe = element(by.css('.CaseViewer'));
          expect(iframe.isPresent()).toBe(true);
        });
      });
    });
  });
})();
