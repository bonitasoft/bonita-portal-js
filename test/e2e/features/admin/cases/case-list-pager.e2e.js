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
  describe('case admin list', function () {

    var caseList;

    beforeEach(function () {
      browser.get('#/admin/cases/list');
      caseList = element(by.css('#case-list'));
    });

    afterEach(function () {
      browser.executeScript('window.sessionStorage.clear();');
      browser.executeScript('window.localStorage.clear();');
    });

    describe('case admin pager', function () {
      it('should display the list of the 25 first cases and navigate using pager', function () {
        var caseList = element(by.css('#case-list'));
        expect(caseList).toBeDefined();
        // check how many lines there are in the table
        // by default it is the first value of the item number (25)
        var caseCheckBoxes = element.all(by.css('#case-list tbody tr.case-row td.case-checkbox input'));
        expect(caseCheckBoxes.count()).toBe(25);
        // retrieve pager links
        var pagination = caseList.all(by.css('.pagination li a'));
        // before clicking the pager is : |<<|<|1|2|3|4|5|>|>>|
        // click on the 6th element, the 4th page
        pagination.get(5).click();
        // now it must be |<<|<|2|3|4|5|6|>|>>| because we display 5 page links
        var paginationListElementP4 = element.all(by.css('.pagination li'));
        //check if the 4th page has active class
        expect(paginationListElementP4.get(4).getAttribute('class')).toContain('active');
        // check if we have 25 results because 4*25 < 300
        var caseCheckBoxesP4 = element.all(by.css('#case-list tbody tr.case-row td.case-checkbox input'));
        expect(caseCheckBoxesP4.count()).toBe(25);
        expect(paginationListElementP4.getText()).toEqual(['«', '‹', '2', '3', '4', '5', '6', '›', '»']);

        //return to the first page using the first pager link
        paginationListElementP4.get(0).element(by.css('a')).click();
        // now pager it must be |<<|<|1|2|3|4|5>|>>|
        var paginationListElementsP1 = caseList.all(by.css('.pagination li'));
        //check if the first page is the active
        expect(paginationListElementsP1.get(2).getAttribute('class')).toContain('active');
        //click on last page
        paginationListElementsP1.get(8).element(by.css('a')).click();
        // now pager it must be |<<|<|9|10|11|12|13>|>>|
        var paginationListElementsP8 = caseList.all(by.css('.pagination li'));
        //check if the last page is the last element before the > and >>
        expect(paginationListElementsP8.get(6).getAttribute('class')).toContain('active');
        // check if the last element is 13 => 320 / 25 = 13
        expect(paginationListElementsP8.get(6).getText()).toBe('13');
        // in last page we must have only 20 elements displayed 320 = 25*12 + 20
        var caseCheckBoxesP13 = element.all(by.css('#case-list tbody tr.case-row td.case-checkbox input'));
        expect(caseCheckBoxesP13.count()).toBe(20);
      });

      it('should reset the pager when item displayed number is clicked', function () {
        var caseList = element(by.css('#case-list'));
        //browser.debugger();
        // |<<|<|1|2|3|4|5>|>>|
        //click on the 4th page
        var pagination = caseList.all(by.css('.pagination li a'));
        pagination.get(5).click();
        // get the fourth page pager
        var paginationP4 = caseList.all(by.css('.pagination li'));

        expect(paginationP4.get(4).getAttribute('class')).toContain('active');
        // click on the third number of page size buttons
        var caseListSettingsButton = element(by.css('#case-list button.bo-Settings'));
        caseListSettingsButton.click();

        var settingsSection = element.all(by.css('.bo-TableSettings-content div'));
        settingsSection.get(0).all(by.css('button')).get(2).click();
        // 1st page must be the active
        expect(caseList.all(by.css('.pagination li')).get(2).getAttribute('class')).toContain('active');
      });
    });
  });
})();
