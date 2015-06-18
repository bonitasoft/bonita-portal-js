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

  describe('Directive: menuList', function () {

    var $compile, scope, rootScope;

    var prefixUrl = 'features/admin/applications/details/menubuilder-',
        templateUrl = prefixUrl + 'menuList.html',
        templateSubDirective = prefixUrl + 'actionBar.html';

    beforeEach(module('org.bonitasoft.features.admin.applications.details'));
    beforeEach(module('main/' + templateUrl));

    beforeEach(inject(function ($injector, $rootScope, $templateCache) {

      $compile = $injector.get('$compile');
      rootScope = $rootScope;
      scope = $rootScope.$new();

      var template = $templateCache.get('main/' + templateUrl);
      $templateCache.put(templateUrl, template);
      // Angular cannot use empty string
      $templateCache.put(templateSubDirective, '<div></div>');
    }));

    describe('loading the list', function () {

      it('should have a container with the class .container-menubuilder', function () {
        var dom = $compile('<menu-list></menu-list>')(scope);
        scope.$apply();
        expect(dom.find('.container-menubuilder').length).toBe(1);
      });

      it('should have a container with the class .list-group', function () {
        var dom = $compile('<menu-list ng-model="model"></menu-list>')(scope);
        scope.$apply();
        expect(dom.find('.list-group').length).toBe(1);
      });

    });

    describe('Scenario 1: We only items for a first menu level', function () {

      var modelContainer, modelPage, scope;

      beforeEach(function () {
        scope = rootScope.$new();
        modelContainer = {
          displayName: 'Thomas',
          applicationPageId: '-1',
          children: []
        };
        modelPage = {
          displayName: 'Jean charles',
          applicationPageId: 101
        };
        var i = 10;
        scope.model = [];

        while (--i >= 0) {
          modelContainer = angular.copy(modelContainer);
          modelPage = angular.copy(modelPage);
          modelContainer.id = ~~ (Math.random() * 1000) + ~~ (Math.random() * 100);
          modelPage.id = ~~ (Math.random() * 1000) + ~~ (Math.random() * 10000);
          scope.model.push(i % 2 ? modelContainer : modelPage);
        }

      });

      it('should have 10 menu items', function () {
        var dom = $compile('<menu-list ng-model="model"></menu-list>')(scope);
        scope.$apply();
        expect(dom.find('.list-group > .list-group-item').length).toBe(10);
      });

      it('should have 5 menu items with menucontainer-has-submenu-items', function () {
        var dom = $compile('<menu-list ng-model="model"></menu-list>')(scope);
        scope.$apply();
        expect(dom.find('.list-group > .menucontainer-has-submenu-items').length).toBe(5);
      });

      it('should have 5 menu items with menucontainer-no-submenu-items', function () {
        var dom = $compile('<menu-list ng-model="model"></menu-list>')(scope);
        scope.$apply();
        expect(dom.find('.list-group > .menucontainer-no-submenu-items').length).toBe(5);
      });

      it('should have 10 action-bar with all buttons', function () {
        var dom = $compile('<menu-list ng-model="model"></menu-list>')(scope);
        scope.$apply();
        expect(dom.find('.list-group action-bar').length).toBe(10);
        expect(dom.find('.list-group action-bar[add="false"]').length).toBe(0);
        expect(dom.find('.list-group action-bar[edit="false"]').length).toBe(0);
        expect(dom.find('.list-group action-bar[remove="false"]').length).toBe(0);
      });

      it('should have 5 empty submenus', function () {
        var dom = $compile('<menu-list ng-model="model"></menu-list>')(scope);
        scope.$apply();
        expect(dom.find('.list-group ul[ui-tree-nodes=""]').length).toBe(5);
      });

      it('should have 5 empty submenus with the class menucontainer-submenu', function () {
        var dom = $compile('<menu-list ng-model="model"></menu-list>')(scope);
        scope.$apply();
        expect(dom.find('.list-group ul[ui-tree-nodes=""].menucontainer-submenu').length).toBe(5);
      });

    });

    describe('Scenario 2: We have items for 2 levels', function () {

      var modelContainer, modelPage, scope;

      beforeEach(function () {
        scope = rootScope.$new();
        modelContainer = {
          displayName: 'Thomas',
          applicationPageId: '-1',
          children: []
        };
        modelPage = {
          displayName: 'Jean charles',
          applicationPageId: 101
        };
        var i = 10;
        scope.model = [];
        var submenu;

        while (--i >= 0) {
          modelContainer = angular.copy(modelContainer);
          modelPage = angular.copy(modelPage);
          modelContainer.id = ~~ (Math.random() * 1000) + ~~ (Math.random() * 100);
          modelPage.id = ~~ (Math.random() * 1000) + ~~ (Math.random() * 10000);
          scope.model.push(i % 2 ? modelContainer : modelPage);
        }

        scope.model = scope.model.map(function (item, n) {
          if (item.children && n > 3) {
            submenu = angular.copy(modelPage);
            submenu.id = ~~ (Math.random() * 1000);
            item.children.push(submenu);
          }
          return item;
        });

      });

      it('should have 10 menu items', function () {
        var dom = $compile('<menu-list ng-model="model"></menu-list>')(scope);
        scope.$apply();
        expect(dom.find('.list-group > .list-group-item').length).toBe(10);
      });

      it('should have 5 menu items with menucontainer-has-submenu-items', function () {
        var dom = $compile('<menu-list ng-model="model"></menu-list>')(scope);
        scope.$apply();
        expect(dom.find('.list-group > .menucontainer-has-submenu-items').length).toBe(5);
      });

      it('should have 5 menu items with menucontainer-no-submenu-items', function () {
        var dom = $compile('<menu-list ng-model="model"></menu-list>')(scope);
        scope.$apply();
        expect(dom.find('.list-group > .menucontainer-no-submenu-items').length).toBe(5);
      });

      it('should have 13 action-bar', function () {
        var dom = $compile('<menu-list ng-model="model"></menu-list>')(scope);
        scope.$apply();
        expect(dom.find('.list-group action-bar').length).toBe(13);
      });

      it('should have 13 action-bar with 10 with all buttons', function () {
        var dom = $compile('<menu-list ng-model="model"></menu-list>')(scope);
        scope.$apply();
        expect(dom.find('.list-group action-bar:not([add="false"])').length).toBe(10);

        // we remove the add button but we must keep the other
        expect(dom.find('.list-group action-bar:not([edit="false"])').length).toBe(13);
        expect(dom.find('.list-group action-bar:not([remove="false"])').length).toBe(13);
      });

      it('should have 3 actionBars without the add button', function () {
        var dom = $compile('<menu-list ng-model="model"></menu-list>')(scope);
        scope.$apply();
        expect(dom.find('.list-group action-bar[add="false"]').length).toBe(3);
      });

      it('should have 5 submenus container', function () {
        var dom = $compile('<menu-list ng-model="model"></menu-list>')(scope);
        scope.$apply();
        expect(dom.find('.list-group ul[ui-tree-nodes=""]').length).toBe(5);
      });

      it('should have 2 empty submenus with the class menucontainer-submenu', function () {
        var dom = $compile('<menu-list ng-model="model"></menu-list>')(scope);
        scope.$apply();
        expect(dom.find('.list-group ul[ui-tree-nodes=""].menucontainer-submenu').length).toBe(2);
      });

      it('should have 3 submenus with the class menucontainer-submenu-exist', function () {
        var dom = $compile('<menu-list ng-model="model"></menu-list>')(scope);
        scope.$apply();
        expect(dom.find('.list-group ul[ui-tree-nodes=""].menucontainer-submenu-exist').length).toBe(3);
      });

    });


  });
})();
