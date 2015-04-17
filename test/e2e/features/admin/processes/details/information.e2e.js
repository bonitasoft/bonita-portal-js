/* global element, by */
(function () {
  'use strict';
  xdescribe('process details', function () {

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
          
        });
      });
    });
  });
})();