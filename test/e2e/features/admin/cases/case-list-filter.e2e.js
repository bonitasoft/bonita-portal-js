/* global element, by */
(function() {
  'use strict';
  describe('case admin filters', function () {
    var caseList,
        caseFilters,
       width = 1920,
       height = 1080;
    browser.driver.manage().window().setSize(width, height);

    beforeEach(function(){
      browser.get('#/admin/cases/list');
      caseList = element(by.css('#case-list'));
      caseFilters = element(by.css('#case-filters'));
      browser.debugger(); //launch protractor with debug option and use 'c' in console to continue test execution
    });

    describe('filters init', function(){
      it('should contains App Name Filter initialized to All Apps', function(){
        var appNamesFilter = caseFilters.all(by.css('#case-app-name-filter'));
        expect(appNamesFilter.all(by.css('button')).getText()).toEqual(['All apps']);
        expect(appNamesFilter.all(by.css('ul')).count()).toBe(1);
        appNamesFilter.all(by.css('ul')).each(function(column){
          expect(column.getWebElement().isDisplayed()).toBeFalsy();
        });
      });
      it('should contains deactivated App Version Filter initialized to All Version', function(){
        var versionFilterButton = caseFilters.all(by.css('#case-app-version-filter button'));
        expect(versionFilterButton.getText()).toEqual(['All versions']);
        expect(versionFilterButton.getAttribute('disabled')).toEqual(['true']);
      });
    });

    describe('filters should contain all apps names with distinct names', function(){
      it('should display the app names when button filter is clicked and select nothing', function(){
        var appNamesFilter = caseFilters.all(by.css('#case-app-name-filter'));
        appNamesFilter.all(by.css('ul')).each(function(column){
          expect(column.getWebElement().isDisplayed()).toBeFalsy();
        });
        appNamesFilter.click();
        appNamesFilter.all(by.css('ul')).each(function(column){
          expect(column.getWebElement().isDisplayed()).toBeTruthy();
        });
        appNamesFilter.click();
        appNamesFilter.all(by.css('ul')).each(function(column){
          expect(column.getWebElement().isDisplayed()).toBeFalsy();
        });
        expect(appNamesFilter.all(by.css('button')).getText()).toEqual(['All apps']);
      });
      it('should display the Poule App and appropriate content when button filter is clicked and select Poule Process', function(){
        var appNamesFilter = caseFilters.all(by.css('#case-app-name-filter'));
        appNamesFilter.click();
        appNamesFilter.all(by.css('ul li')).get(3).click();
        appNamesFilter.all(by.css('ul')).each(function(column){
          expect(column.getWebElement().isDisplayed()).toBeFalsy();
        });
        expect(appNamesFilter.all(by.css('button')).getText()).toEqual(['Poule']);
        element.all(by.xpath('//tbody//td[2]')).each(function(appNameColumn){
          expect(appNameColumn.getText()).toBe('Poule');
        });
        expect(element(by.css('#cases-results-size')).getText()).toBe('Results: 1 to 11 of 11');
      });
      it('should display the ProcessX and the only version it has and appropriate content when button filter is clicked and select ProcessX', function(){
        var appNamesFilter = caseFilters.all(by.css('#case-app-name-filter'));
        appNamesFilter.click();
        appNamesFilter.all(by.css('ul li')).get(4).click();
        expect(appNamesFilter.all(by.css('button')).getText()).toEqual(['ProcessX']);
        element.all(by.xpath('//tbody//td[2]')).each(function(appNameColumn){
          expect(appNameColumn.getText()).toBe('ProcessX');
        });
        element.all(by.xpath('//tbody//td[3]')).each(function(appNameColumn){
          expect(appNameColumn.getText()).toBe('2.0');
        });
        var versionFilterButton = caseFilters.all(by.css('#case-app-version-filter button'));
        expect(versionFilterButton.getText()).toEqual(['2.0']);
        expect(element.all(by.css('#case-app-version-filter button')).getAttribute('disabled')).toEqual([null]);
        expect(element(by.css('#cases-results-size')).getText()).toBe('Results: 1 to 11 of 11');
      });
      it('should display the app names and appropriate content when an app is selected and then all apps is reselected', function(){
        var appNamesFilter = caseFilters.all(by.css('#case-app-name-filter'));
        appNamesFilter.click();
        appNamesFilter.all(by.css('ul li')).get(3).click();
        appNamesFilter.click();
        appNamesFilter.all(by.css('ul li')).get(0).click();
        expect(appNamesFilter.all(by.css('button')).getText()).toEqual(['All apps']);
        expect(element.all(by.xpath('//tbody//tr')).count()).toBe(25);
        expect(element(by.css('#cases-results-size')).getText()).toBe('Results: 1 to 25 of 28');
      });
      it('should display the Poule App - 2.0 and appropriate content when button filter is clicked and select Poule Process and select 2.0 version', function(){
        var appNamesFilter = caseFilters.all(by.css('#case-app-name-filter'));
        appNamesFilter.click();
        appNamesFilter.all(by.css('ul li')).get(3).click();
        expect(appNamesFilter.all(by.css('button')).getText()).toEqual(['Poule']);
        var versionFilter = caseFilters.all(by.css('#case-app-version-filter'));
        expect(versionFilter.getText()).toEqual(['All versions']);
        expect(element.all(by.css('#case-app-version-filter button')).getAttribute('disabled')).toEqual([null]);
        versionFilter.click();
        versionFilter.all(by.css('ul li')).get(3).click();
        expect(versionFilter.getText()).toEqual(['2.0']);

        expect(element(by.css('#cases-results-size')).getText()).toBe('Results: 1 to 7 of 7');
      });
      it('should display the All apps and appropriate content when button filter is clicked and select Poule Process and select 2.0 version and select all apps', function(){
        var appNamesFilter = caseFilters.all(by.css('#case-app-name-filter'));
        appNamesFilter.click();
        appNamesFilter.all(by.css('ul li')).get(3).click();
        var versionFilter = caseFilters.all(by.css('#case-app-version-filter'));
        versionFilter.click();
        versionFilter.all(by.css('ul li')).get(3).click();
        appNamesFilter.click();
        appNamesFilter.all(by.css('ul li')).get(0).click();

        expect(versionFilter.getText()).toEqual(['All versions']);
        expect(element.all(by.css('#case-app-version-filter button')).getAttribute('disabled')).toEqual(['true']);
        expect(appNamesFilter.all(by.css('button')).getText()).toEqual(['All apps']);

        expect(element(by.css('#cases-results-size')).getText()).toBe('Results: 1 to 25 of 28');
      });
    });
  });
})();
