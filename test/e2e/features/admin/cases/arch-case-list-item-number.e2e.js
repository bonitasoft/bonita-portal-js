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

    var caseList;

    beforeEach(function () {
      browser.get('#/admin/cases/list/archived');
      caseList = element(by.css('#case-list'));
    });

    afterEach(function () {
      browser.executeScript('window.sessionStorage.clear();');
      browser.executeScript('window.localStorage.clear();');
    });

    describe('case admin displayed items per page', function () {
      it('should change the number of displayed element when settings are changed to 50', function () {
        var caseListSettingsButton = element(by.css('#case-list button.bo-Settings'));
        caseListSettingsButton.click();

        var settingsSection = element.all(by.css('.bo-TableSettings-content div'));
        var pageNumberButtons = settingsSection.get(0).all(by.css('button'));

        pageNumberButtons.get(1).click();
        var caseCheckBoxes50 = element.all(by.css('#case-list tbody tr.case-row td.case-checkbox input'));
        expect(caseCheckBoxes50.count()).toBe(50);

      });

      it('should change the number of displayed element when settings are changed to 100', function () {
        var caseListSettingsButton = element(by.css('#case-list button.bo-Settings'));
        caseListSettingsButton.click();

        var settingsSection = element.all(by.css('.bo-TableSettings-content div'));
        var pageNumberButtons = settingsSection.get(0).all(by.css('button'));

        pageNumberButtons.get(2).click();
        var caseCheckBoxes100 = element.all(by.css('#case-list tbody tr.case-row td.case-checkbox input'));
        expect(caseCheckBoxes100.count()).toBe(100);
      });
    });
  });
})();
