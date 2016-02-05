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

  describe('Directive: ActionBar', function () {

    var $compile, scope, rootScope;

    beforeEach(module('org.bonitasoft.features.admin.applications.details'));

    beforeEach(module('main/features/admin/applications/details/menubuilder-actionBar.html'));

    beforeEach(inject(function ($injector, $rootScope, $templateCache) {

      $compile = $injector.get('$compile');
      rootScope = $rootScope;
      scope = $rootScope.$new();

      var templateUrl = 'features/admin/applications/details/menubuilder-actionBar.html',
          template = $templateCache.get('main/' + templateUrl);

      $templateCache.put(templateUrl, template);

    }));

    it('should have the text inside', function () {
      var dom = $compile('<action-bar>toto</action-bar>')(scope);
      scope.$apply();
      expect(dom.html().indexOf('toto') > -1).toBe(true);
    });

    describe('we have some buttons', function () {

      it('should have a remove button', function () {
        var dom = $compile('<action-bar>toto</action-bar>')(scope);
        scope.$apply();
        expect(dom.get(0).querySelector('.btn-action-remove')).not.toBeNull();
      });

      it('should not have a remove button', function () {
        var dom = $compile('<action-bar remove="false">toto</action-bar>')(scope);
        scope.$apply();
        expect(dom.get(0).querySelector('.btn-action-remove')).toBeNull();
      });

      it('should have an add button', function () {
        var dom = $compile('<action-bar>toto</action-bar>')(scope);
        scope.$apply();
        expect(dom.get(0).querySelector('.btn-action-add')).not.toBeNull();
      });

      it('should not have an add button', function () {
        var dom = $compile('<action-bar add="false">toto</action-bar>')(scope);
        scope.$apply();
        expect(dom.get(0).querySelector('.btn-action-add')).toBeNull();
      });

      it('should have an edit button', function () {
        var dom = $compile('<action-bar>toto</action-bar>')(scope);
        scope.$apply();
        expect(dom.get(0).querySelector('.btn-action-edit')).not.toBeNull();
      });

      it('should not have an edit button', function () {
        var dom = $compile('<action-bar edit="false">toto</action-bar>')(scope);
        scope.$apply();
        expect(dom.get(0).querySelector('.btn-action-edit')).toBeNull();
      });

    });

    describe('The circle indicator', function () {

      beforeEach(function () {
        var scope;
        scope = rootScope.$new();
      });

      it('should be displayed for a parentMenu', function () {
        scope.menu = {
          parentMenuId: '-1'
        };
        var dom = $compile('<action-bar menu="menu">toto</action-bar>')(scope);
        scope.$apply();
        expect(dom.get(0).querySelector('.circle-indicator')).not.toBeNull();
      });

      it('should be displayed for a parentMenu (1)', function () {
        scope.menu = {
          parentMenuId: 0
        };
        var dom = $compile('<action-bar menu="menu">toto</action-bar>')(scope);
        scope.$apply();
        expect(dom.get(0).querySelector('.circle-indicator')).not.toBeNull();
      });

      it('should not be displayed for a child', function () {
        scope.menu = {
          parentMenuId: 12
        };
        var dom = $compile('<action-bar menu="menu">toto</action-bar>')(scope);
        scope.$apply();
        expect(dom.get(0).querySelector('.circle-indicator')).toBeNull();
      });

    });

    describe('we can trigger an action on each button', function () {

      it('should trigger removeItem on remove button', function () {
        var dom = $compile('<action-bar>toto</action-bar>')(scope);
        scope.$apply();
        spyOn(dom.controller('actionBar'), 'removeItem').and.returnValue('test');
        dom.find('.btn-action-remove').triggerHandler('click');
        scope.$apply();

        expect(dom.controller('actionBar').removeItem).toHaveBeenCalled();
      });


      it('should trigger addItem on add button', function () {
        var dom = $compile('<action-bar>toto</action-bar>')(scope);
        scope.$apply();
        spyOn(dom.controller('actionBar'), 'addItem').and.returnValue('test');
        angular.element(dom.find('.btn-action-add')).triggerHandler('click');
        expect(dom.controller('actionBar').addItem).toHaveBeenCalled();
      });


      it('should trigger editItem on edit button', function () {
        var dom = $compile('<action-bar>toto</action-bar>')(scope);
        scope.$apply();
        spyOn(dom.controller('actionBar'), 'editItem').and.returnValue('test');
        angular.element(dom.find('.btn-action-edit')).triggerHandler('click');
        expect(dom.controller('actionBar').editItem).toHaveBeenCalled();
      });

    });


  });
})();
