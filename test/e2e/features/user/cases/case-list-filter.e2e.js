/** Copyright (C) 2015 Bonitasoft S.A.
 * BonitaSoft, 31 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/* global element, by, describe*/
(function() {
  'use strict';
  describe('case user filters', function () {
    var caseList,
        caseFilters;

    beforeEach(function(){
      browser.get('#/user/cases/list');
      caseList = element(by.css('#case-list'));
      caseFilters = element(by.css('#case-filters'));
    });

    afterEach(function () {
      browser.executeScript('window.sessionStorage.clear();');
      browser.executeScript('window.localStorage.clear();');
    });

    describe('filters init', function(){
      it('should contains App Name Filter initialized to All Apps', function(){
        var appNamesFilter = caseFilters.all(by.css('#case-app-name-filter'));
        expect(appNamesFilter.all(by.css('button')).getText()).toEqual(['All']);
        expect(appNamesFilter.all(by.css('ul')).count()).toBe(1);
        appNamesFilter.all(by.css('ul')).each(function(column){
          expect(column.isDisplayed()).toBeFalsy();
        });
      });
      it('should contains started by Filter initialized to anyone', function(){
        var startedByFilterButton = caseFilters.all(by.css('#case-app-startedby-filter button'));
        expect(startedByFilterButton.getText()).toEqual(['Anyone']);
      });
    });

    describe('filters should contain all apps names with distinct names', function(){
      it('should display the app names when button filter is clicked and select nothing', function(){
        var appNamesFilter = caseFilters.all(by.css('#case-app-name-filter'));
        appNamesFilter.all(by.css('ul')).each(function(column){
          expect(column.isDisplayed()).toBeFalsy();
        });
        var appFilterButton = caseFilters.all(by.css('#case-app-name-filter button'));
        appFilterButton.click();
        appNamesFilter.all(by.css('ul')).each(function(column){
          expect(column.isDisplayed()).toBeTruthy();
        });
        appFilterButton.click();
        appNamesFilter.all(by.css('li')).each(function(column){
          expect(column.isDisplayed()).toBeFalsy();
        });
        expect(appNamesFilter.all(by.css('button')).getText()).toEqual(['All']);
      });
      it('should display the Poule App and appropriate content when button filter is clicked and select Poule Process', function(){
        var appNamesFilter = caseFilters.all(by.css('#case-app-name-filter'));
        var appFilterButton = caseFilters.all(by.css('#case-app-name-filter button'));
        appFilterButton.click();
        appNamesFilter.all(by.css('ul li')).get(3).click();
        appNamesFilter.all(by.css('ul')).each(function(column){
          expect(column.isDisplayed()).toBeFalsy();
        });
        expect(appNamesFilter.all(by.css('button')).getText()).toEqual(['Poule']);
        element.all(by.xpath('//tbody//td[2]')).each(function(appNameColumn){
          expect(appNameColumn.getText()).toBe('Poule');
        });
        expect(element.all(by.css('#cases-results-size-bottom')).count()).toBe(1);
        expect(element.all(by.css('#cases-results-size-top')).count()).toBe(1);
        expect(element.all(by.css('#cases-results-pages')).count()).toBe(0);

      });
      it('should display the app names and appropriate content when an app is selected and then all apps is reselected', function(){
        var appNamesFilter = caseFilters.all(by.css('#case-app-name-filter'));
        var appNamesFilterButton = caseFilters.all(by.css('#case-app-name-filter button'));
        appNamesFilterButton.click();
        appNamesFilter.all(by.css('ul li')).get(3).click();
        appNamesFilterButton.click();
        appNamesFilter.all(by.css('ul li')).get(0).click();
        expect(appNamesFilterButton.getText()).toEqual(['All']);
        expect(element.all(by.xpath('//tbody//tr')).count()).toBe(25);
        expect(element(by.css('#cases-results-size-top')).getText()).toBe('1-25 of 320');
        expect(element(by.css('#cases-results-size-bottom')).getText()).toBe('1-25 of 320');
      });
      it('should display the Poule App - 2.0 and appropriate content when button filter is clicked and select Poule Process and select started by me', function(){
        var appNamesFilter = caseFilters.all(by.css('#case-app-name-filter'));
        var appNamesFilterButton = caseFilters.all(by.css('#case-app-name-filter button'));
        appNamesFilterButton.click();
        appNamesFilter.all(by.css('ul li')).get(3).click();
        expect(appNamesFilter.all(by.css('button')).getText()).toEqual(['Poule']);
        var startedByFilter = caseFilters.all(by.css('#case-app-startedby-filter'));
        var startedByFilterButton = caseFilters.all(by.css('#case-app-startedby-filter button'));
        expect(startedByFilter.getText()).toEqual(['Anyone']);
        startedByFilterButton.click();
        startedByFilter.all(by.css('ul li')).get(2).click();
        expect(startedByFilter.getText()).toEqual(['Me']);

        expect(element.all(by.css('#cases-results-size')).count()).toBe(0);
      });
    });
  });
})();
