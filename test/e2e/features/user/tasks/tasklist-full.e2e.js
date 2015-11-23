'use strict';

describe('tasklist custom page', function() {

  beforeEach(function(){
    browser.manage().deleteAllCookies();
    browser.get('#/user/tasks/list');
    browser.waitForAngular();
  });

  describe('Full list', function(){
    beforeEach(function(){
      element.all(by.model('value')).last().click();
    });

    it('should display buttons on the selected Line', function() {
      var actions = element.all(by.css('.Line.info .Cell--with-actions button'));

      expect(actions.count()).toBe(2);
    });

    describe('Do task', function(){
      it('should open a popup with a form', function(){
        var actions = element.all(by.css('.Line.info .Cell--with-actions button'));
        actions.first().click();

        browser.wait(function() {
          var popup = element(by.css('.modal'));
          return popup.isPresent();
        }, 500);

        var formViewer = element(by.css('.modal .FormViewer'));
        expect(formViewer.isPresent()).toBe(true);
      });

      it('should not be displayed for done tasks', function() {
        var titleRxp = /done/i;
        element.all(by.css('.TaskFilters li a')).get(3).click();

        var title = element(by.binding('app.request.taskFilter.title'))
          .getWebElement()
          .getText();
        expect(title).toMatch(titleRxp);

        var actions = element.all(by.css('.Line.info .Cell--with-actions button'));

        expect(actions.count()).toBe(1);
        var buttonTitle = actions.first()
          .getWebElement()
          .getAttribute('title');
        expect(buttonTitle).toMatch(/view/i);
      });
    });

    describe('View task', function(){

      beforeEach(function(){
        var actions = element.all(by.css('.Line.info .Cell--with-actions button'));
        actions.last().click();
      });

      it('should open a popup with a taskDetail', function(){

        var popup = element(by.css('.modal'));
        expect(popup.isPresent()).toBe(true);

        var iframe = element(by.css('task-details'));
        expect(iframe.isPresent()).toBe(true);
      });

      it('should allow user to take unassigned task', function(){
        // take the task
        element(by.id('ButtonTakeDetailsColumn')).click();

        var releaseButton = element(by.id('ButtonReleaseDetailsColumn'));
        expect(releaseButton.isPresent()).toBe(true);

      });

      it('should allow user to release unassigned task', function(){
         // close the popup task (cf beforeEach)
        element(by.css('.modal .close')).click();

        //select last line (an assigned task with mock PUT)
        element.all(by.css('.Line')).click();
        element.all(by.css('.Line.info .Cell--with-actions button')).last().click();

        // take the task
        element(by.id('ButtonReleaseDetailsColumn')).click();

        var releaseButton = element(by.id('ButtonTakeDetailsColumn'));
        expect(releaseButton.isPresent()).toBe(true);

      });
    });
  });
});
