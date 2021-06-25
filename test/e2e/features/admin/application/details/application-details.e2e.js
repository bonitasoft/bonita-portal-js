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
  describe('application details', function() {

    describe('with no application id', function() {

      beforeEach(function() {
        browser.get('#/admin/applications/');
      });

      it('should display no id message', function() {
        expect(element(by.tagName('back-button')).isDisplayed()).toBe(true);
        expect(element(by.css('#id-not-provided')).isDisplayed()).toBe(true);
        expect(element(by.css('#id-wrong')).isPresent()).toBe(false);
        expect(element(by.css('#app-edit-btn')).isPresent()).toBe(false);
        expect(element(by.css('#app-edit-section')).isPresent()).toBe(false);
        expect(element(by.css('#look-n-feel-edit-section')).isPresent()).toBe(false);
        expect(element(by.css('#application-page-list-section')).isPresent()).toBe(false);
      });
    });

    describe('with wrong application id', function() {

      beforeEach(function() {
        browser.get('#/admin/applications/123');
      });

      it('should display wrong id message', function() {
        expect(element(by.tagName('back-button')).isDisplayed()).toBe(true);
        expect(element(by.css('#id-wrong')).isDisplayed()).toBe(true);
        expect(element(by.css('#id-not-provided')).isPresent()).toBe(false);
        expect(element(by.css('#app-edit-btn')).isPresent()).toBe(false);
        expect(element(by.css('#app-edit-section')).isPresent()).toBe(false);
        expect(element(by.css('#look-n-feel-edit-section')).isPresent()).toBe(false);
        expect(element(by.css('#application-page-list-section')).isPresent()).toBe(false);
      });
    });

    describe('with correct application id', function() {

      beforeEach(function() {
        browser.get('#/admin/applications/456');
      });

      it('should display page', function() {
        expect(element(by.tagName('back-button')).isDisplayed()).toBe(true);
        expect(element(by.css('#app-edit-btn')).isDisplayed()).toBe(true);
        expect(element(by.css('#app-edit-section')).isDisplayed()).toBe(true);
        expect(element(by.css('#look-n-feel-edit-section')).isDisplayed()).toBe(true);
        expect(element(by.css('#application-page-list-section')).isDisplayed()).toBe(true);
        expect(element(by.css('#id-wrong')).isPresent()).toBe(false);
        expect(element(by.css('#id-not-provided')).isPresent()).toBe(false);
      });
    });
  });
})();
