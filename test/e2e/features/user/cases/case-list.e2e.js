/** Copyright (C) 2016 Bonitasoft S.A.
 * BonitaSoft, 32 rue Gustave Eiffel - 38000 Grenoble
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
  describe('user case list', function () {

    var caseList,
      width = 1280,
      height = 800;
    browser.driver.manage().window().setSize(width, height);

    beforeEach(function () {
      browser.get('#/user/cases/list');
      caseList = element(by.css('#case-list'));
      browser.executeScript('window.sessionStorage.clear();');
      browser.executeScript('window.localStorage.clear();');
      //browser.debugger(); //launch protractor with debug option and use 'c' in console to continue test execution
    });

    afterEach(function () {
      browser.executeScript('window.sessionStorage.clear();');
      browser.executeScript('window.localStorage.clear();');
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
        expect(caseList.all(by.css('tbody tr')).get(0).all(by.css('td')).getText()).toEqual(['2', 'Pool', '1.0', '10/16/2014 4:05 PM', 'William Jobs', '', '']);
      });
      it('should order by date desc', function () {
        tableHeader.get(2).click();
        expect(caseList.all(by.css('tbody tr')).get(0).all(by.css('td')).getText()).toEqual(['1022', 'ProcessX', '2.0', '10/20/2014 10:08 AM', 'System', '', '']);
      });
    });

  });
})();
