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

/* global element, by */
(function () {
  'use strict';

  describe('archived case admin list', function () {

    var caseList,
      nbColumnsDiplayed = 9,
      nbTotalcolumns = 13;

    beforeEach(function () {
      browser.get('#/admin/cases/list/archived');
      caseList = element(by.css('#case-list'));
    });

    afterEach(function () {
      browser.executeScript('window.sessionStorage.clear();');
      browser.executeScript('window.localStorage.clear();');
    });

    describe('table surroundings ', function () {
      it('should contains table headers', function () {
        var columnList = element.all(by.css('#case-list tr:last-child th'));
        expect(columnList.count()).toBe(nbColumnsDiplayed+2);
        expect(columnList.get(1).getText()).toContain('ID');
        expect(columnList.get(2).getText()).toContain('Process name');
        expect(columnList.get(3).getText()).toContain('Display name');
        expect(columnList.get(4).getText()).toContain('Version');
        expect(columnList.get(5).getText()).toContain('Start date');
        expect(columnList.get(6).getText()).toContain('Started by');
        expect(columnList.get(7).getText()).toContain('End date');
        expect(columnList.get(8).getText()).toContain('State');
        expect(columnList.get(9).getText()).toContain('Search Key 1');
      });
      it('should contains page size selection', function () {
        var caseListSettingsButton = element(by.css('#case-list button.bo-Settings'));
        caseListSettingsButton.click();
        expect(element(By.css('.bo-TableSettings-content button.active')).getText()).toBe('25');
      });
      it('should contains column selection button', function () {
        var caseListSettingsButton = element(by.css('#case-list button.bo-Settings'));
        caseListSettingsButton.click();
      });
      it('should contains table header with result number', function () {
        var resultsInfo = caseList.all(by.css('#cases-results-size-top'));
        expect(resultsInfo.count()).toBe(1);
        expect(resultsInfo.get(0).getText()).toBe('1-25 of 320');
      });
      it('should contains table footer with result number', function () {
        var resultsInfo = caseList.all(by.css('#cases-results-size-bottom'));
        expect(resultsInfo.count()).toBe(1);
        expect(resultsInfo.get(0).getText()).toBe('1-25 of 320');
      });
      it('should contains table footer with pagination', function () {
        var pagination = caseList.all(by.css('.pagination'));
        expect(pagination.count()).toBe(1);
        expect(pagination.all(by.css('li')).getText()).toEqual(['«', '‹', '1', '2', '3', '4', '5', '›', '»']);
        expect(pagination.all(by.css('li.disabled')).getText()).toEqual(['«', '‹']);
      });
    });

    describe('column selection', function () {
      it('should display all columns when dropdown is clicked', function () {
        var caseListSettingsButton = element(by.css('#case-list button.bo-Settings'));

        caseListSettingsButton.click();
        var columnToShowList = element.all(by.css('.bo-TableSettings-columns li'));
        expect(columnToShowList.count()).toBe(nbTotalcolumns);
        expect(element.all(by.css('.bo-TableSettings-columns li input:checked')).count()).toBe(nbColumnsDiplayed);

        caseListSettingsButton.click();
        columnToShowList = element.all(by.css('.bo-TableSettings-columns li'));
        expect(columnToShowList.count()).toBe(nbTotalcolumns);
        columnToShowList.each(function (column) {
          expect(column.isDisplayed()).toBeFalsy();
        });
      });
      it('should hide a column when an item is unselected in dropdown and make it reappeared when clicked', function () {
        var caseListSettingsButton = element(by.css('#case-list button.bo-Settings'));
        caseListSettingsButton.click();
        var columnToShowNameList = element.all(by.css('.bo-TableSettings-columns li input'));

        expect(element.all(by.css('.bo-TableSettings-columns input')).get(0).isSelected()).toBeTruthy();
        columnToShowNameList.get(0).click();
        expect(element.all(by.css('.bo-TableSettings-columns input')).get(0).isSelected()).toBeFalsy();
        var columnHeaders = element.all(by.css('th.case-column'));
        expect(columnHeaders.count()).toBe(nbColumnsDiplayed-1);
        expect(columnHeaders.getText()).not.toContain('Process Name');
        expect(caseList.all(by.css('#caseId-1 td.case-detail')).count()).toBe(nbColumnsDiplayed-1);

        var nextCheckedElement = element.all(by.css('.bo-TableSettings-columns input:checked'));
        expect(nextCheckedElement.count()).toBe(nbColumnsDiplayed-1);
        nextCheckedElement.get(0).click();

        expect(element.all(by.css('.bo-TableSettings-columns input')).count()).toBe(nbTotalcolumns);
        expect(element.all(by.css('.bo-TableSettings-columns input')).get(1).isSelected()).toBeFalsy();
        expect(caseList.all(by.css('th.case-column')).count()).toBe(nbColumnsDiplayed-2);
        columnHeaders = caseList.all(by.css('th.case-column'));
        expect(columnHeaders.getText()).not.toContain(nextCheckedElement.get(0).getText());
        expect(caseList.all(by.css('#caseId-1 td.case-detail')).count()).toBe(nbColumnsDiplayed-2);

        nextCheckedElement = element.all(by.css('.bo-TableSettings-columns input'));
        nextCheckedElement.get(2).click();
        expect(element.all(by.css('.bo-TableSettings-columns input')).get(2).isSelected()).toBeFalsy();
        columnHeaders = caseList.all(by.css('th.case-column'));
        expect(columnHeaders.getText()).not.toContain('ID');
        expect(caseList.all(by.css('th.case-column')).count()).toBe(nbColumnsDiplayed-3);
        expect(caseList.all(by.css('#caseId-1 td.case-detail')).count()).toBe(nbColumnsDiplayed-3);

        columnToShowNameList.get(2).click();
        expect(element.all(by.css('.bo-TableSettings-columns input')).get(2).isSelected()).toBeTruthy();
        columnHeaders = caseList.all(by.css('th.case-column'));
        expect(columnHeaders.getText()).toContain('Version');
        expect(caseList.all(by.css('th.case-column')).count()).toBe(nbColumnsDiplayed-2);
        expect(caseList.all(by.css('#caseId-1 td.case-detail')).count()).toBe(nbColumnsDiplayed-2);
      });
    });

    describe('column resize', function () {
      var resizeBars;
      beforeEach(function () {
        resizeBars = element.all(by.css('.rc-handle'));
      });

      it('should change increase started Date and Started By column sizes', function () {
        var startedByColumnBar = resizeBars.get(4);
        var formerStartedByColumnLocation = element.all(by.css('table th')).get(5).getLocation();
        var formerStartDateColumnLocation = element.all(by.css('table th')).get(4).getLocation();
        //var formerStateColumnLocation = element.all(by.css('table th')).get(6).getLocation();
        browser.driver.actions().mouseDown(startedByColumnBar).mouseMove(startedByColumnBar, {
          x: 100,
          y: 50
        }).mouseUp().perform();
        var newStartedByColumnLocation = element.all(by.css('table th')).get(5).getLocation();
        formerStartedByColumnLocation.then(function (oldPosition) {
          newStartedByColumnLocation.then(function (newPosition) {
            //move is not very accurate, for instance, offset of 50 changed position of 53px
            expect(oldPosition.x - newPosition.x).toBeLessThan(75);
            expect(oldPosition.y - newPosition.y).toBe(0);
          });
        });
        var newStartDateColumnLocation = element.all(by.css('table th')).get(4).getLocation();
        formerStartDateColumnLocation.then(function (oldPosition) {
          newStartDateColumnLocation.then(function (newPosition) {
            expect(oldPosition.x - newPosition.x).toBeGreaterThan(-5);
            expect(oldPosition.x - newPosition.x).toBeLessThan(32);
            expect(oldPosition.y - newPosition.y).toBe(0);
          });
        });
        /*var newStateColumnLocation = element.all(by.css('table th')).get(6).getLocation();
        formerStateColumnLocation.then(function (oldPosition) {
          newStateColumnLocation.then(function (newPosition) {
            expect(oldPosition.x - newPosition.x).toBeLessThan(1);
            expect(oldPosition.y - newPosition.y).toBe(0);
          });
        });*/
      });
    });

    describe('sort', function () {
      var tableHeader;
      beforeEach(function () {
        tableHeader = element.all(by.css('table th[bo-sorter] button'));
      });
      it('should order by date asc', function () {
        tableHeader.get(2).click();
        tableHeader.get(2).click();
        expect(tableHeader.get(2).getText()).toContain('Start date');
        expect(caseList.all(by.css('tbody tr')).get(0).all(by.css('td')).getText()).toEqual(['', '1', 'Pool', 'Pool', '1.0', '10/16/2014 4:05 PM', 'William Jobs', '11/02/2014 10:07 AM', 'started', 'No value', '']);
      });
      it('should order by date desc', function () {
        tableHeader.get(2).click();
        expect(caseList.all(by.css('tbody tr')).get(0).all(by.css('td')).getText()).toEqual(['', '1', 'ProcessX', 'ProcessX', '2.0', '10/20/2014 10:08 AM', 'System', '11/02/2014 10:07 AM', 'started', 'No value', '']);
      });
      it('should order by id desc', function () {
        tableHeader.get(0).click();
        expect(caseList.all(by.css('tbody tr')).get(0).all(by.css('td')).getText()).toEqual(['', '1', 'Leave Request', 'Leave Request', '1.0', '10/17/2014 4:05 PM', 'Walter Bates', '11/02/2014 10:07 AM', 'started', 'No value', '']);
      });
    });

    describe('case admin list content', function () {
      it('should display the list of the 25 first cases and check the specific content of the first row', function () {
        expect(element.all(by.css('#case-list tr.case-row')).count()).toBe(25);

        caseList.all(by.css('#caseId-1 td')).then(function (poolCaseDetails) {
          expect(poolCaseDetails[1].getText()).toContain('1');
          expect(poolCaseDetails[1].element(by.css('a')).getAttribute('href')).toContain('#?id=1&_p=archivedcasemoredetailsadmin&');
          expect(poolCaseDetails[2].getText()).toContain('Leave Request');
          expect(poolCaseDetails[2].element(by.css('a')).getAttribute('href')).toContain('#?id=7626384556180392799&_p=processmoredetailsadmin&');
          expect(poolCaseDetails[3].getText()).toContain('Leave Request');
          expect(poolCaseDetails[4].getText()).toContain('1.0');
          expect(poolCaseDetails[5].getText()).toContain('10/17/2014 4:05 PM');
          expect(poolCaseDetails[6].getText()).toContain('Walter Bates');
          expect(poolCaseDetails[7].getText()).toContain('11/02/2014 10:07 AM');
          expect(poolCaseDetails[8].getText()).toContain('started');
          expect(poolCaseDetails[9].getText()).toContain('No value');
          expect(poolCaseDetails[nbColumnsDiplayed+1].element(by.id('case-detail-btn-1')).getAttribute('href')).toContain('#?id=1&_p=archivedcasemoredetailsadmin&');
        });
      });

      it('should display the list of the 25 first cases and check its content', function () {
        var caseList = element(by.css('#case-list'));
        expect(caseList).toBeDefined();

        element.all(by.css('#case-list tbody tr.case-row')).each(function (caseRow) {
          var caseColumnList = caseRow.all(by.css('td'));
          expect(caseColumnList.count()).toBe(nbColumnsDiplayed + 2);
        });
        var caseCheckBoxes = element.all(by.css('#case-list tbody tr.case-row td.case-checkbox input'));
        expect(caseCheckBoxes.count()).toBe(25);
        /*caseCheckBoxes.getText().then(function (checkboxTextArray) {
          checkboxTextArray.forEach(function (checkboxText) {
            expect(checkboxText).toBeFalsy();
          });
        });*/
        var caseColumns = element.all(by.css('#case-list tbody tr.case-row td.case-detail'));
        expect(caseColumns.count()).toBe(nbColumnsDiplayed * 25);
        /*caseColumns.getText().then(function (caseColumnsTextArray) {
          caseColumnsTextArray.forEach(function (caseColumnsText) {
            expect(caseColumnsText).toBeTruthy();
          });
        });*/
      });

      it('should generate a good case link on the eye', function() {
        var caseList = element(by.css('#case-list'));
        var linkList = element.all(by.css('#case-detail-btn-1', caseList));
        var firstElt = linkList.get(0);
        firstElt.getAttribute('href').then(function(href) {
          expect(typeof href).toBe('string');
          expect(href).toContain('/#?id=1&_p=archivedcasemoredetailsadmin&');
        });
      });

    });

    describe('case admin select all buttons', function () {
      it('should select all checkboxes when selectAllCB is clicked', function () {
        var selectAllCB = element(by.css('th.case-checkbox input'));
        selectAllCB.click();
        var checkedCasesCB = element.all(by.css('td.case-checkbox input:checked'));
        expect(checkedCasesCB.count()).toBe(25);
        checkedCasesCB.get(0).click();
        checkedCasesCB = element.all(by.css('td.case-checkbox input:checked'));
        expect(checkedCasesCB.count()).toBe(24);
        selectAllCB.click();
        checkedCasesCB = element.all(by.css('td.case-checkbox input:checked'));
        expect(checkedCasesCB.count()).toBe(25);
      });
    });
  });
})();
