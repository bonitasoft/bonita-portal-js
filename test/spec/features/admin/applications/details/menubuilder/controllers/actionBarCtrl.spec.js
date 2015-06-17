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

  describe('Controller: actionBarCtrl', function () {

    var menubuilderMocks = window.menubuilderMocks;

    var createController, scope, loadRequest, $modal, factory;

    var items = {
      scope: {
        application: {
          id: 1
        }
      },
      menuItemNoPage: {
        id: 15,
        name: 'menu without page',
        applicationId: 1,
        children: []
      },
      menuItemPage: {
        id: 18,
        name: 'menu with a page',
        applicationId: 1,
        applicationPageId: 101
      },

      record: {
        page: {
          displayName: 'menu with a page',
          applicationId: 1,
          applicationPageId: 101,
          parentMenuId: 18
        },
        noPage: {
          displayName: 'menu without page',
          applicationId: 1,
          applicationPageId: '-1',
          parentMenuId: 15
        }
      },

      answerNoPage: {
        displayName: 'menu without page',
        applicationId: 1,
        applicationPageId: null,
        parentMenuId: '-1',
        children: []
      },
      answerPage: {
        displayName: 'menu with a page',
        applicationId: 1,
        applicationPageId: 101,
        parentMenuId: 15
      },
      closeModal: {
        page: {}
      }
    };

    items.closeModalNoPage = angular.extend({}, items.closeModal, {
      name: items.menuItemNoPage.name
    });
    items.closeModalPage = angular.extend({}, items.closeModal, {
      name: items.menuItemPage.name,
      page: {
        id: items.menuItemPage.applicationPageId
      }
    });

    beforeEach(module('org.bonitasoft.features.admin.applications.edit'));
    beforeEach(module('org.bonitasoft.common.resources'));
    beforeEach(module('org.bonitasoft.features.admin.applications.details'));

    beforeEach(function () {
      // spyOn(console, 'debug');
      console.debug = angular.noop;
    });

    beforeEach(inject(function ($controller, $rootScope, $q, $injector) {

      scope = $rootScope.$new();
      $modal = $injector.get('$modal');
      factory = $injector.get('menuFactory');

      loadRequest = $q.defer();
      spyOn(factory, 'update');
      spyOn(factory, 'remove');
      spyOn(factory, 'create').and.returnValue(loadRequest.promise);
      spyOn($modal, 'open').and.returnValue(window.fakeModal);

      createController = function createController(o) {
        scope.pages = [];
        scope.application = {
          id: 1
        };
        scope.menu = {
          applicationId: 1
        };
        scope.data = {
          menubuilder: [],
          menuItemBuilder: []
        };
        return $controller('actionBarCtrl', {
          $scope: o || scope,
          $modal: $modal,
          menuFactory: factory
        });
      };
    }));

    it('should create a new controller', function () {
      var Ctrl = createController();
      expect(Ctrl).not.toBeUndefined();
    });


    describe('scenario: we will remove an item', function () {

      it('should have an removeItem method', function () {
        var Ctrl = createController();
        expect(Ctrl.removeItem).toBeDefined();
        expect(typeof Ctrl.removeItem).toBe('function');
      });

      it('should trigger the remove method from factory when we remove an item', function () {
        var action = {
          $parent: {
            $parent: {
              remove: angular.noop
            }
          }
        };
        var Ctrl = createController();

        Ctrl.removeItem(action, {
          id: 15
        });
        expect(factory.remove).toHaveBeenCalled();
        expect(factory.remove).toHaveBeenCalledWith(15);
      });

    });


    describe('scenario: we will open the modal to add', function () {

      it('should have an addItem method', function () {
        var Ctrl = createController();
        expect(Ctrl.addItem).toBeDefined();
        expect(typeof Ctrl.addItem).toBe('function');
      });

      it('should open the modal when we call that method', function () {
        var Ctrl = createController();
        Ctrl.addItem(items.scope, items.menuItemNoPage);
        expect($modal.open).toHaveBeenCalled();
        expect($modal.open).toHaveBeenCalledWith(menubuilderMocks.mockModalDirective);
      });

      it('should fill the modal ref in the controller', function () {
        var Ctrl = createController();
        Ctrl.addItem(items.scope, items.menuItemNoPage);
        expect(Ctrl.modal).not.toBeNull();
      });

      it('should trigger the menuFactory save when we close the modal', function () {
        var Ctrl = createController();
        Ctrl.addItem(items.scope, items.menuItemNoPage);
        Ctrl.modal.close(items.closeModalNoPage);

        expect(factory.create).toHaveBeenCalled();
        expect(factory.create).toHaveBeenCalledWith(items.record.noPage);
      });

      it('should have a applicationPageId and a parent id if we have a page when we close the modal', function () {
        var Ctrl = createController();
        Ctrl.addItem(items.scope, items.menuItemPage);
        Ctrl.modal.close(items.closeModalPage);

        expect(factory.create).toHaveBeenCalled();
        expect(factory.create).toHaveBeenCalledWith(items.record.page);
      });


      it('should push some item in the parent', function () {
        var Ctrl = createController();
        Ctrl.addItem(items.scope, items.menuItemNoPage);
        Ctrl.modal.close(items.closeModalNoPage);
        expect(items.menuItemNoPage.children.length).toBe(0);
        loadRequest.resolve({
          item: {
            toJSON: function () {
              return {
                name: 'toto'
              };
            }
          }
        });
        scope.$apply();
        expect(items.menuItemNoPage.children.length).toBe(1);
      });


      it('should push some item in the parent even if we forget to specify the children key', function () {
        var Ctrl = createController();
        var withoutChildrenKey = angular.copy(items.menuItemNoPage);
        delete withoutChildrenKey.children;

        Ctrl.addItem(items.scope, withoutChildrenKey);
        Ctrl.modal.close(items.closeModalNoPage);
        expect(withoutChildrenKey.children).toBeUndefined();
        loadRequest.resolve({
          item: {
            toJSON: function () {
              return {
                name: 'toto'
              };
            }
          }
        });
        scope.$apply();
        expect(items.menuItemNoPage.children.length).toBe(1);
      });


    });


    describe('scenario: we will open the modal to edit', function () {

      var records = {},
          data = {};

      beforeEach(function () {

        data = {
          menuItemNoPage: {
            id: 15,
            displayName: 'menu without page',
            applicationId: 1,
            children: []
          },
          menuItemPage: {
            id: 18,
            displayName: 'menu with a page',
            applicationId: 1,
            applicationPageId: 101,
            parentMenuId: 15
          }
        };
        records = {
          cb: {
            page: {
              name: 'menu with a page',
              page: {
                id: 101
              }
            },
            noPage: {
              name: 'menu without a page',
              page: {}
            }
          },
          page: {
            id: 18,
            displayName: 'menu with a page',
            applicationId: 1,
            applicationPageId: 101,
            parentMenuId: 15
          },
          noPage: {
            id: 15,
            displayName: 'menu without a page',
            applicationId: 1,
            applicationPageId: '-1',
            children: []
          }
        };

      });

      it('should have an editItem method', function () {
        var Ctrl = createController();
        expect(Ctrl.editItem).toBeDefined();
        expect(typeof Ctrl.editItem).toBe('function');
      });

      it('should open the modal when we call that method', function () {
        var Ctrl = createController();
        Ctrl.editItem(items.scope, data.menuItemNoPage);
        expect($modal.open).toHaveBeenCalled();
        expect($modal.open).toHaveBeenCalledWith(menubuilderMocks.mockModalDirective);
      });

      it('should fill the modal ref in the controller', function () {
        var Ctrl = createController();
        Ctrl.addItem(items.scope, data.menuItemNoPage);
        expect(Ctrl.modal).not.toBeNull();
      });

      it('should trigger the menuFactory save when we close the modal', function () {
        var Ctrl = createController();
        Ctrl.editItem(items.scope, data.menuItemNoPage);
        Ctrl.modal.close(records.cb.noPage);

        expect(factory.update).toHaveBeenCalled();
        expect(factory.update).toHaveBeenCalledWith(records.noPage);
      });


      it('should have a applicationPageId if we associate a page when we close the modal', function () {
        var Ctrl = createController();
        Ctrl.editItem(items.scope, data.menuItemPage);
        Ctrl.modal.close(records.cb.page);

        expect(factory.update).toHaveBeenCalled();
        expect(factory.update).toHaveBeenCalledWith(records.page);
      });

    });

  });
})();
