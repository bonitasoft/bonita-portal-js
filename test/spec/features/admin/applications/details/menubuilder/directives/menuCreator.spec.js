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

  describe('Directive: menuCreator', function () {

    var scope, elm, compile, menuFactory, loadRequest, rootScope;

    var prefixUrl = 'features/admin/applications/details/menubuilder-',
        templateUrl = prefixUrl + 'menuCreator.html',
        templateSubDirective = prefixUrl + 'menuList.html';

    beforeEach(module('org.bonitasoft.features.admin.applications.details'));
    beforeEach(module('main/' + templateUrl));

    beforeEach(inject(function ($injector, $rootScope, $compile, $templateCache, $q) {

      rootScope = $rootScope;
      scope = $rootScope.$new();
      compile = $compile;
      loadRequest = $q.defer();
      menuFactory = $injector.get('menuFactory');

      spyOn(menuFactory, 'get').and.returnValue(loadRequest.promise);

      var template = $templateCache.get('main/' + templateUrl);
      $templateCache.put(templateUrl, template);
      // Angular cannot use empty string
      $templateCache.put(templateSubDirective, '<div></div>');

      elm = angular.element('<menu-creator app="app" class="col-md-6"></menu-creator>');
    }));

    describe('Loading the directive', function () {

      var dom;
      beforeEach(function () {
        scope.app = {
          id: 1
        };
        dom = compile(elm)(scope);
        scope.$apply();
      });

      it('should trigger the controller', function () {
        expect(menuFactory.get).toHaveBeenCalled();
        expect(menuFactory.get).toHaveBeenCalledWith(1);
      });

      it('should have some content in the directive', function () {
        expect(dom.find('.page-header').length).toBe(1);
      });

      it('should have a button Add', function () {
        expect(dom.find('#menu-list-add-button').length).toBe(1);
      });

      it('should have a jumbotron if empty', function () {
        expect(dom.find('.jumbotron').length).toBe(1);
      });

      it('should not have a jumbotron if we have some data', function () {
        loadRequest.resolve([{
          id: 1,
          name: 'de'
        }]);
        scope.$apply();
        expect(dom.find('.jumbotron').length).toBe(0);
      });

      it('should have a menu List if we have some data', function () {
        loadRequest.resolve([{
          id: 1,
          name: 'de'
        }]);
        scope.$apply();
        expect(dom.find('menu-list').length).toBe(1);
      });
    });

    describe('the button add', function () {

      var dom;
      beforeEach(function () {
        scope.app = {
          id: 1
        };
        dom = compile(elm)(scope);
        scope.$apply();
      });

      it('should be disabled if we do not have any pages', function () {
        expect(dom.find('[disabled]').length).toBe(1);
      });

      it('should not be disabled if we do have pages', function () {
        rootScope.$emit('page-list:pagesexist', true);
        scope.$apply();
        expect(dom.find('[disabled]').length).toBe(0);
      });

      it('should trigger menuCreatorCtrl.add() if we have pages', function () {
        rootScope.$emit('page-list:pagesexist', true);
        scope.$apply();
        spyOn(dom.controller('menuCreator'), 'add');

        dom.find('#menu-list-add-button').triggerHandler('click');
        expect(dom.controller('menuCreator').add).toHaveBeenCalled();
      });

      it('should not trigger menuCreatorCtrl.add() if we do not have any pages', function () {
        spyOn(dom.controller('menuCreator'), 'add');
        expect(dom.find('[disabled]').length).toBe(1);

        //@todo: Phantom JS seems to click even if the button is disabled
        // dom.find('#menu-list-add-button').click();
        // expect(dom.controller('menuCreator').add).toHaveBeenCalled();
      });

    });

  });
})();
