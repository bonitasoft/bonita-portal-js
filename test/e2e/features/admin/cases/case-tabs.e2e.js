/** Copyright (C) 2015 Bonitasoft S.A.
 * Bonitasoft, 32 rue Gustave Eiffel - 38000 Grenoble
 * This library is free software; you can redistribute it and/or modify it under the terms
 * of the GNU Lesser General Public License as published by the Free Software Foundation
 * version 2.1 of the License.
 * This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public License along with this
 * program; if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth
 * Floor, Boston, MA 02110-1301, USA.
 */

(function () {
  'use strict';
  describe('case admin tabs', function () {

    var activeCaseTab,
      archivedCaseTab,
      width = 1280,
      height = 800;
    browser.driver.manage().window().setSize(width, height);

    beforeEach(function () {
      browser.get('#/admin/cases/list');

      activeCaseTab = element(by.xpath('//li[a/@id="TabActiveCases"]'));
      archivedCaseTab = element(by.xpath('//li[a/@id="TabArchivedCases"]'));
      //browser.debugger(); //launch protractor with debug option and use 'c' in console to continue test execution
    });

    it('should navigate between tabs', function(){
      expect(activeCaseTab.getAttribute('class')).toContain('active');
      expect(archivedCaseTab.getAttribute('class')).not.toContain('active');
      browser.setLocation('/admin/cases/list/archived');
      expect(activeCaseTab.getAttribute('class')).not.toContain('active');
      expect(archivedCaseTab.getAttribute('class')).toContain('active');
      browser.setLocation('/admin/cases/list/archived');
      expect(activeCaseTab.getAttribute('class')).not.toContain('active');
      expect(archivedCaseTab.getAttribute('class')).toContain('active');
      browser.setLocation('/admin/cases/list');
      expect(activeCaseTab.getAttribute('class')).toContain('active');
      expect(archivedCaseTab.getAttribute('class')).not.toContain('active');

    });
  });
})();
