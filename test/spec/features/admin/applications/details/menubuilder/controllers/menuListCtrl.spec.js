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

  describe('Controller: menuListCtrl', function () {

    var createController, scope, loadRequest, menuFactory;


    beforeEach(module('org.bonitasoft.features.admin.applications.details'));

    beforeEach(inject(function ($controller, $rootScope, $q, $injector) {

      scope = $rootScope.$new();
      menuFactory = $injector.get('menuFactory');

      loadRequest = $q.defer();
      spyOn(menuFactory, 'update').and.returnValue(loadRequest.promise);

      createController = function createController() {
        scope.model = [{
          id: 1,
          displayName: 'toto'
        },
        {
          id: 2,
          displayName: 'robert'
        }];
        return $controller('menuListCtrl', {
          $scope: scope,
          menuFactory: menuFactory
        });
      };
    }));

    it('should create a new controller', function () {
      var Ctrl = createController();
      expect(Ctrl).not.toBeUndefined();
    });

    it('should have some options to configure the directive ui.tree', function () {
      createController();
      scope.$apply();
      expect('dragStop' in scope.treeOptions).toBeTruthy();
      expect(typeof scope.treeOptions.dragStop).toBe('function');
    });

    it('should call the method update from the factory when the dragEnd is triggered for a submenu', function () {
      createController();
      scope.$apply();

      scope.treeOptions.dragStop({
        source: {
          nodeScope: {
            subItem: {
              id: 1,
              applicationId: 150,
              parentMenuId: 42
            }
          }
        }
      });
      expect(menuFactory.update).toHaveBeenCalled();
    });


    it('should call the method update from the factory when the dragEnd is triggered for a menu', function () {
      createController();
      scope.$apply();

      scope.treeOptions.dragStop({
        source: {
          nodeScope: {
            menu: {
              id: 1
            }
          }
        }
      });
      expect(menuFactory.update).toHaveBeenCalled();
      expect(menuFactory.update).toHaveBeenCalledWith({
        id: 1,
        displayName: 'toto',
        menuIndex: 1,
        parentMenuId: '-1'
      });
    });


    it('should update the model with data after an update', function () {
      createController();
      scope.$apply();

      scope.treeOptions.dragStop({
        source: {
          nodeScope: {
            menu: {
              id: 1
            }
          }
        }
      });

      expect(scope.model.length).toBe(2);
      loadRequest.resolve([{
        id: 42,
        displayName: 'de'
      }]);
      scope.$apply();
      expect(scope.model.length).toBe(1);
    });

    describe('trying to drag&drop an item', function () {

      describe('When we try a top-level menu and it is a container', function () {

        var opt = {
          sourceNode: {
            $modelValue: {}
          },
          destNodes: {
            $element: {}
          },
          className: 'menucontainer-submenu'
        };


        beforeEach(function () {

          // Set the model for a top level item
          opt.sourceNode.$modelValue = {
            applicationId: 1,
            applicationPageId: '-1',
            displayName: 'container',
            id: 7,
            menuIndex: 4,
            parentMenuId: '-1'
          };

          opt.destNodes.$element.hasClass = function (str) {
            return opt.className === str;
          };
        });

        it('should not allow us to drag&drop the menuItem on a container without children', function () {
          createController();
          expect(scope.treeOptions.accept(opt.sourceNode, opt.destNodes)).toBeFalsy();
        });

        it('should not allow us to drag&drop the menuItem on a container with children', function () {
          createController();
          opt.className = 'menucontainer-submenu-exist';
          expect(scope.treeOptions.accept(opt.sourceNode, opt.destNodes)).toBeFalsy();
        });


        it('should allow us to drag&drop the menuItem in the menu', function () {
          createController();
          opt.className = '';
          expect(scope.treeOptions.accept(opt.sourceNode, opt.destNodes)).toBeTruthy();
        });


      });


      describe('When we try for a menu with a page', function () {
        var opt = {
          sourceNode: {
            $modelValue: {}
          },
          destNodes: {
            $element: {}
          },
          className: 'menucontainer-submenu'
        };


        beforeEach(function () {

          // Set the model for a top level item
          opt.sourceNode.$modelValue = {
            applicationId: 1,
            applicationPageId: 1,
            displayName: 'vdsvsds',
            id: 6,
            menuIndex: 3,
            parentMenuId: '-1'
          };

          opt.destNodes.$element.hasClass = function (str) {
            return opt.className === str;
          };
        });

        it('should accept to drag&drop the menuItem', function () {
          createController();
          expect(scope.treeOptions.accept(opt.sourceNode, opt.destNodes)).toBeTruthy();
        });

      });


    });

  });
})();
