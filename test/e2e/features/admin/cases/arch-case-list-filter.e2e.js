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
  describe('archived case admin filters', function () {
    var caseList,
        caseFilters;

    beforeEach(function(){
      browser.get('#/admin/cases/list/archived');
      caseList = element(by.css('#case-list'));
      caseFilters = element(by.css('#case-filters'));
    });

    afterEach(function () {
      browser.executeScript('window.sessionStorage.clear();');
      browser.executeScript('window.localStorage.clear();');
    });

    describe('filters init', function(){
      it('should contains App Name Filter initialized-All Apps', function(){
        var processNamesFilter = caseFilters.all(by.css('#case-process-name-filter'));
        expect(processNamesFilter.all(by.css('button')).getText()).toEqual(['All']);
        expect(processNamesFilter.all(by.css('ul')).count()).toBe(1);
        processNamesFilter.all(by.css('ul')).each(function(column){
          expect(column.isDisplayed()).toBeFalsy();
        });
      });
      it('should contains deactivated App Version Filter initialized-All Version', function(){
        var versionFilterButton = caseFilters.all(by.css('#case-process-version-filter button'));
        expect(versionFilterButton.getText()).toEqual(['All']);
        expect(versionFilterButton.getAttribute('disabled')).toEqual(['true']);
      });
    });

    describe('filters should contain all processes names with distinct names', function(){
      it('should display the process names when button filter is clicked and select nothing', function(){
        var processNamesFilter = caseFilters.all(by.css('#case-process-name-filter'));
        processNamesFilter.all(by.css('ul')).each(function(column){
          expect(column.isDisplayed()).toBeFalsy();
        });
        var processFilterButton = caseFilters.all(by.css('#case-process-name-filter button'));
        processFilterButton.click();
        processNamesFilter.all(by.css('ul')).each(function(column){
          expect(column.isDisplayed()).toBeTruthy();
        });
        processFilterButton.click();
        processNamesFilter.all(by.css('li')).each(function(column){
          expect(column.isDisplayed()).toBeFalsy();
        });
        expect(processNamesFilter.all(by.css('button')).getText()).toEqual(['All']);
      });
      it('should display the Poule App and appropriate content when button filter is clicked and select Poule Process', function(){
        var processNamesFilter = caseFilters.all(by.css('#case-process-name-filter'));
        var processFilterButton = caseFilters.all(by.css('#case-process-name-filter button'));
        processFilterButton.click();
        processNamesFilter.all(by.css('ul li')).get(3).click();
        processNamesFilter.all(by.css('ul')).each(function(column){
          expect(column.isDisplayed()).toBeFalsy();
        });
        expect(processNamesFilter.all(by.css('button')).getText()).toEqual(['Poule']);
        element.all(by.xpath('//tbody//td[3]')).each(function(processNameColumn){
          expect(processNameColumn.getText()).toBe('Poule');
        });
        element.all(by.xpath('//tbody//td[4]')).each(function(appNameColumn){
          expect(appNameColumn.getText()).toBe('Poule');
        });
        expect(element.all(by.css('#cases-results-size-top')).count()).toBe(1);
        expect(element.all(by.css('#cases-results-size-bottom')).count()).toBe(1);
      });
      it('should display the ProcessX and the only version it has and appropriate content when button filter is clicked and select ProcessX', function(){
        var processNamesFilter = caseFilters.all(by.css('#case-process-name-filter'));
        var processFilterButton = caseFilters.all(by.css('#case-process-name-filter button'));
        processFilterButton.click();
        processNamesFilter.all(by.css('ul li')).get(4).click();
        expect(processNamesFilter.all(by.css('button')).getText()).toEqual(['ProcessX']);
        element.all(by.xpath('//tbody//td[3]')).each(function(processNameColumn){
          expect(processNameColumn.getText()).toBe('ProcessX');
        });
        element.all(by.xpath('//tbody//td[5]')).each(function(processNameColumn){
          expect(processNameColumn.getText()).toBe('2.0');
        });
        var versionFilterButton = caseFilters.all(by.css('#case-process-version-filter button'));
        expect(versionFilterButton.getText()).toEqual(['2.0']);
        expect(element.all(by.css('#case-process-version-filter button')).getAttribute('disabled')).toEqual([null]);
        expect(element.all(by.css('#cases-results-size-top')).count()).toBe(1);
        expect(element.all(by.css('#cases-results-size-bottom')).count()).toBe(1);
        expect(element.all(by.css('#cases-results-pages')).count()).toBe(0);
      });
      it('should display the process names and appropriate content when a process is selected and then all processes is reselected', function(){
        var processNamesFilter = caseFilters.all(by.css('#case-process-name-filter'));
        var processNamesFilterButton = caseFilters.all(by.css('#case-process-name-filter button'));
        processNamesFilterButton.click();
        processNamesFilter.all(by.css('ul li')).get(3).click();
        processNamesFilterButton.click();
        processNamesFilter.all(by.css('ul li')).get(0).click();
        expect(processNamesFilterButton.getText()).toEqual(['All']);
        expect(element.all(by.xpath('//tbody//tr')).count()).toBe(25);
        expect(element(by.css('#cases-results-size-top')).getText()).toBe('1-25 of 320');
        expect(element(by.css('#cases-results-size-bottom')).getText()).toBe('1-25 of 320');
      });
      it('should display the Poule App - 2.0 and appropriate content when button filter is clicked and select Poule Process and select 2.0 version', function(){
        var processNamesFilter = caseFilters.all(by.css('#case-process-name-filter'));
        var processNamesFilterButton = caseFilters.all(by.css('#case-process-name-filter button'));
        processNamesFilterButton.click();
        processNamesFilter.all(by.css('ul li')).get(3).click();
        expect(processNamesFilter.all(by.css('button')).getText()).toEqual(['Poule']);
        var versionFilter = caseFilters.all(by.css('#case-process-version-filter'));
        var versionFilterButton = caseFilters.all(by.css('#case-process-version-filter button'));
        expect(versionFilter.getText()).toEqual(['All']);
        expect(element.all(by.css('#case-process-version-filter button')).getAttribute('disabled')).toEqual([null]);
        versionFilterButton.click();
        versionFilter.all(by.css('ul li')).get(3).click();
        expect(versionFilter.getText()).toEqual(['2.0']);

        expect(element.all(by.css('#cases-results-size-top')).count()).toBe(1);
        expect(element.all(by.css('#cases-results-size-bottom')).count()).toBe(1);
      });
      it('should display the All processes and appropriate content when button filter is clicked and select Poule Process and select 2.0 version and select all processes', function(){
        var processNamesFilter = caseFilters.all(by.css('#case-process-name-filter'));
        var processNamesFilterButton = caseFilters.all(by.css('#case-process-name-filter button'));
        processNamesFilterButton.click();
        processNamesFilter.all(by.css('ul li')).get(3).click();
        var versionFilter = caseFilters.all(by.css('#case-process-version-filter'));
        var versionFilterButton = caseFilters.all(by.css('#case-process-version-filter button'));
        versionFilterButton.click();
        versionFilter.all(by.css('ul li')).get(3).click();
        processNamesFilterButton.click();
        processNamesFilter.all(by.css('ul li')).get(0).click();

        expect(versionFilter.getText()).toEqual(['All']);
        expect(element.all(by.css('#case-process-version-filter button')).getAttribute('disabled')).toEqual(['true']);
        expect(processNamesFilter.all(by.css('button')).getText()).toEqual(['All']);

        expect(element(by.css('#cases-results-size-top')).getText()).toBe('1-25 of 320');
        expect(element(by.css('#cases-results-size-bottom')).getText()).toBe('1-25 of 320');
      });
    });
  });
})();
