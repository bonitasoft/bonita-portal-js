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

    describe('with non editable application', function() {

      beforeEach(function() {
        browser.get('#/admin/applications/999');
      });

      it('should display page and have non editable general information', function() {
        expect(element(by.css('#id-wrong')).isPresent()).toBe(false);
        expect(element(by.css('#id-not-provided')).isPresent()).toBe(false);
        expect(element(by.tagName('back-button')).isDisplayed()).toBe(true);
        expect(element(by.tagName('h1')).getText()).toEqual('My non editable app (999.0)');
        expect(element(by.css('img.bonitasoft-default-logo')).getAttribute('src')).toContain('images/bonitasoftLogo.png');
        expect(element(by.css('img.bonitasoft-default-logo')).getAttribute('title')).toEqual('Core to Bonita platform');
        expect(element(by.css('#app-profile-value-visibility')).getText()).toContain('All profiles');
        expect(element(by.css('#app-profile-value')).isPresent()).toBe(false);
        expect(element(by.css('#app-edit-btn')).isPresent()).toBe(false);
      });

      it('should have non editable page list', function() {
        expect(element(by.css('#page-list-add-button')).isPresent()).toBe(false);
        expect(element(by.css('.btn-action-sethome')).isPresent()).toBe(true);
        expect(element(by.css('.btn-action-sethome.clickable')).isPresent()).toBe(false);
        expect(element(by.css('.btn-action-delete')).isPresent()).toBe(false);
        expect(element.all(by.css('page-list .page-name')).last().getText()).toContain('home - Application home page');
      });

      it('should have non editable menu list', function() {
        expect(element(by.css('#menu-list-add-button')).isPresent()).toBe(false);
        expect(element(by.css('.btn-action-remove')).isPresent()).toBe(false);
        expect(element(by.css('.btn-action-edit')).isPresent()).toBe(false);
        expect(element(by.css('.btn-action-add')).isPresent()).toBe(false);
        expect(element.all(by.css('.list-group-item.menucontainer-no-submenu-items')).first().getText()).toContain('Cases');
        expect(element(by.css('.list-group-item.menucontainer-has-submenu-items')).getText()).toContain('All');
        expect(element(by.css('.menucontainer-submenu-exist action-bar')).getText()).toContain('Cases submenu');
        // Check the menu is not movable
        expect(element(by.css('.container-menubuilder[data-drop-enabled="false"][data-drag-enabled="false"]')).isPresent()).toBe(true);
      });

      it('should have editable look and feel', function() {
        expect(element(by.css('.AvatarUpload-btn')).isDisplayed()).toBe(true);
        expect(element(by.css('.AvatarUpload-btn')).isEnabled()).toBe(true);
        expect(element(by.id('app-layout-value')).isPresent()).toBe(true);
        expect(element(by.id('app-theme-value')).isPresent()).toBe(true);
      });
    });
  });
})();
