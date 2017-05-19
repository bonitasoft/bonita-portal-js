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

(function () {
  'use strict';
  describe('In process details actor mapping', function () {

    var processDetails;
    var btnActions;
    beforeEach(function () {
      browser.get('#/admin/processes/details/321');
      processDetails = element(by.css('#process-details'));

      var menuItems;
      menuItems = processDetails.all(by.css('.list-group > a.list-group-item'));

      // click on actor in menu
      menuItems.get(1).click();

      var title = element(by.id('process-details-actors')).element(by.tagName('h2'));
      btnActions = element(by.id('process-details-actors')).all(by.tagName('button'));

      expect(title.getText()).toEqual('Actors');
      expect(btnActions.count()).toBe(4);
    });

    describe('when click on user edit', function () {
      var modal;
      beforeEach(function () {
        btnActions.get(0).click();
        modal = element(by.id('editActorsMembersModal'));
      });
      it('should be display user mapped in label', function () {
        expect(modal.isDisplayed()).toBeTruthy();
        expect(modal.element(by.tagName('h1')).getText()).toEqual('Users mapped to Employee actor');
        expect(modal.all(by.css('.tag')).count()).toBeGreaterThan(0);
        expect(modal.all(by.css('.tag')).getText()).toEqual(['Favio Riviera', 'April Sanchez', 'Anthony Nichols', 'Remove all']);
      });

      it('should be display not mapped user in selecbox', function () {
        modal.element(by.tagName('actors-select-box')).click();
        var checkBoxContainer = element(by.css('.checkBoxContainer'));
        var items = checkBoxContainer.all(by.css('.multiSelectItem '));

        expect(checkBoxContainer.isDisplayed()).toBeTruthy();
        expect(items.count()).toBeGreaterThan(0);
      });

    });

    describe('when click on role edit', function () {
      var modal;
      beforeEach(function () {
        btnActions.get(1).click();
        modal = element(by.id('editActorsMembersModal'));
      });

      it('should be display roles mapped in label ', function () {
        expect(modal.isDisplayed()).toBeTruthy();
        expect(modal.element(by.tagName('h1')).getText()).toEqual('Roles');
        expect(modal.all(by.css('.tag')).count()).toEqual(2);
        expect(modal.all(by.css('.tag')).getText()).toEqual(['Member', 'Remove all']);
      });

      it('should be display not mapped roles in selectbox', function () {
        modal.element(by.tagName('actors-select-box')).click();
        var checkBoxContainer = element(by.css('.checkBoxContainer'));
        var items = checkBoxContainer.all(by.css('.multiSelectItem '));

        expect(checkBoxContainer.isDisplayed()).toBeTruthy();
        expect(items.count()).toBeGreaterThan(0);
      });
    });

    describe('when click on group edit', function () {
      var modal;
      beforeEach(function () {
        btnActions.get(2).click();
        modal = element(by.id('editActorsMembersModal'));
      });

      it('should be display groups mapped in label', function () {
        expect(modal.isDisplayed()).toBeTruthy();
        expect(modal.element(by.tagName('h1')).getText()).toEqual('Groups');
        expect(modal.all(by.css('.tag')).count()).toBeGreaterThan(0);
        expect(modal.all(by.css('.tag')).getText()).toEqual(['Acme', 'Human Resources', 'Finance', 'Infrastructure', 'Marketing', 'Production', 'Research & Development', 'Services', 'Europe', 'Asia', 'Latin America', 'North America', 'Remove all']);
      });

      it('should be display not mapped groups in selectbox', function () {
        modal.element(by.tagName('actors-select-box')).click();

        var checkBoxContainer = element(by.css('.checkBoxContainer'));
        var items = checkBoxContainer.all(by.css('.multiSelectItem '));

        expect(checkBoxContainer.isDisplayed()).toBeTruthy();
        expect(items.count()).toBeGreaterThan(0);
      });
    });


    describe('when click on membership edit', function () {
      var modal;
      beforeEach(function () {
        btnActions.get(3).click();
        modal = element(by.id('editActorsMembersModal'));
      });

      it('should be display mapped membership', function () {
        expect(modal.isDisplayed()).toBeTruthy();
        expect(modal.element(by.tagName('h1')).getText()).toEqual('Memberships mapped to Employee actor');
        expect(modal.all(by.css('.tag')).count()).toBeGreaterThan(0);
        expect(modal.all(by.css('.tag')).getText()).toEqual(['Member of Asia', 'Remove all']);
      });


      it('should be display not mapped groups in group-selectbox', function () {
        var checkBoxs = modal.all(by.tagName('actors-select-box'));
        checkBoxs.get(1).click();

        var checkBoxContainer = element.all(by.css('.checkBoxContainer')).get(1);
        var items = checkBoxContainer.all(by.css('.multiSelectItem '));

        expect(checkBoxContainer.isDisplayed()).toBeTruthy();
        expect(items.count()).toBeGreaterThan(0);
      });
    });

  });
})();
