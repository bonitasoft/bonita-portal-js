/** Copyright (C) 2020 Bonitasoft S.A.
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

(function() {
  'use strict';
  describe('application list', function() {

    beforeEach(function() {
      browser.get('#/admin/applications');
    });

    it('should display the list of applications', function() {
      expect(element.all(by.css('.application-display-name')).count()).toBe(4);
      expect(element.all(by.css('.btn-action-edit')).count()).toBe(4);
      expect(element.all(by.css('.btn-action-export')).count()).toBe(4);
      expect(element.all(by.css('.btn-action-delete')).count()).toBe(2);
      expect(element.all(by.css('.application-display-name')).first().getText()).toContain('Bonita Super Administrator Application');
    });

    it('should display actions with correct attributes', function() {
      expect(element(by.css('.btn-action-edit')).getAttribute('title')).toContain('View application details');

      element(by.css('.btn-action-export')).click();
      expect(element(by.className('modal')).isDisplayed()).toBe(true);
      expect(element(by.className('modal-title')).getText()).toContain('Export application descriptor');

      element(by.css('#cancel')).click();
      expect(element(by.className('modal')).isPresent()).toBe(false);

      element(by.css('.btn-action-delete')).click();
      expect(element(by.className('modal')).isDisplayed()).toBe(true);
      expect(element(by.className('modal-title')).getText()).toContain('Delete');

      element(by.css('#cancel')).click();
      expect(element(by.className('modal')).isPresent()).toBe(false);
    });
  });
})();
