/* global element, by */
(function () {
  'use strict';
  describe('process details', function () {

    var processDetails,
      width = 1280,
      height = 800;
    browser.driver.manage().window().setSize(width, height);

    describe('Resolved Process', function(){

      beforeEach(function () {
        browser.get('#/admin/processes/details/321');
        processDetails = element(by.css('#process-details'));
        //browser.debugger(); //launch protractor with debug option and use 'c' in console to continue test execution
      });

      describe('main elements', function() {
        it('should display main action button', function() {
          var mainActionButtons = processDetails.all(by.css('.actions .btn'));
          expect(mainActionButtons.count()).toBe(2);
          expect(processDetails.all(by.css('h1')).getText()).toEqual(['SupportProcess (1.0)']);
          expect(processDetails.all(by.css('.panel-danger > div')).count()).toBe(0);
        });
      });

    });
    describe('Resolved Process', function(){

      beforeEach(function () {
        browser.get('#/admin/processes/details/789');
        processDetails = element(by.css('#process-details'));
        //browser.debugger(); //launch protractor with debug option and use 'c' in console to continue test execution
      });

      describe('main elements', function() {
        it('should display main action button', function() {
          var mainActionButtons = processDetails.all(by.css('.actions .btn'));
          expect(mainActionButtons.count()).toBe(2);
          expect(processDetails.all(by.css('h1')).getText()).toEqual(['Rock\'N\'Roll Process (6.6.6)']);
          expect(processDetails.all(by.css('.panel-danger > div')).getText()).toEqual(['The Process cannot be enabled','Entity Mapping must be resolved before enabling the Process.']);
        });
      });
    });
  });
})();