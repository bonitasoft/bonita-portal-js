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

  describe('Controller: addCustomMenuCtrl', function () {

    var createController, scope, applicationPageAPI, store, loadRequest, modalInstance = {};
    beforeEach(module('org.bonitasoft.features.admin.applications.details'));
    beforeEach(inject(function ($controller, $rootScope, $q, $injector) {

      scope = $rootScope.$new();
      applicationPageAPI = $injector.get('applicationPageAPI');
      store = {
        load: jasmine.any(Function)
      };

      modalInstance = angular.copy(window.fakeModal);

      loadRequest = $q.defer();
      spyOn(store, 'load').and.returnValue(loadRequest.promise);
      spyOn(modalInstance, 'close');
      spyOn(modalInstance, 'dismiss');

      createController = function createController() {
        scope.pages = [];
        return $controller('addCustomMenuCtrl', {
          $scope: scope,
          $modalInstance: modalInstance,
          store: store,
          applicationPageAPI: applicationPageAPI,
          AppID: 1,
          customDataModal: {}
        });
      };
    }));

    it('should create a new controller', function () {
      var Ctrl = createController();
      expect(Ctrl).not.toBeUndefined();
    });

    it('should load some data when we open the modal', function () {
      createController();
      scope.$apply();
      expect(store.load).toHaveBeenCalled();
      expect(store.load).toHaveBeenCalledWith(applicationPageAPI, {
        d: ['pageId'],
        f: 'applicationId=1'
      });

      expect(Array.isArray(scope.pages)).toBeTruthy();
      expect(scope.pages.length).toBe(0);
    });

    it('should load some data and add them to scope.pages', function () {
      createController();

      loadRequest.resolve([{
        id: 1
      },
      {
        id: 2
      }]);

      expect(scope.pages.length).toBe(0);
      scope.$apply();
      expect(scope.pages.length).toBe(2);
    });

    it('should close the modal when we add something', function () {

      var Ctrl = createController();
      scope.$apply();
      Ctrl.saveModal({
        model: {
          name: 'de',
          page: 2
        }
      });
      expect(modalInstance.close).toHaveBeenCalled();
      expect(modalInstance.close).toHaveBeenCalledWith({
        name: 'de',
        page: {},
        raw: {
          name: 'de',
          page: 2
        }
      });
    });

    it('should close the modal when we trigger dismiss', function () {
      var Ctrl = createController();
      scope.$apply();
      Ctrl.cancel();
      expect(modalInstance.dismiss).toHaveBeenCalled();
    });



    describe('Scenario with customDataModal', function () {

      var createController;

      beforeEach(inject(function ($controller) {


        createController = function createController(opt, name, parentMenuId, applicationPageId) {

          opt = opt || [];
          var dataCtrl = {
            displayName: name || '',
            applicationPageId: applicationPageId,
            parentMenuId: parentMenuId || '-1'
          };
          scope.pages = [];

          return $controller('addCustomMenuCtrl', {
            $scope: scope,
            $modalInstance: modalInstance,
            store: store,
            applicationPageAPI: applicationPageAPI,
            AppID: 1,
            customDataModal: {
              isEdition: opt.indexOf('edit') > -1,
              isAddition: opt.indexOf('add') > -1,
              isEditionParentMenu: opt.indexOf('parent') > -1,
              data: dataCtrl
            }
          });
        };

      }));

      describe('we create a menu level 1', function () {

        it('Should not be an isAddition', function () {
          createController(['parent']);
          expect(scope.isAddition).toBeFalsy();
        });

        it('Should not be an isEdition', function () {
          createController(['parent']);
          expect(scope.isEdition).toBeFalsy();
        });

        it('Should not be a isLabelOnly', function () {
          createController(['parent']);
          expect(scope.isLabelOnly).toBe('inactive');
        });

        it('Should not be a isEditionParentMenu', function () {
          createController(['parent']);
          expect(scope.isEditionParentMenu).toBeTruthy();
        });

        it('Should not have a currentSelectedPageId', function () {
          createController(['parent']);
          expect(scope.currentSelectedPageId).toBeUndefined();
        });

        it('Should not have a menu', function () {
          createController(['parent']);
          expect(scope.menu).toBeUndefined();
        });

      });



      describe('we update a menu level 1', function () {

        it('Should be an isAddition', function () {
          createController(['edit', 'parent'], 'item1', null, 12);
          expect(scope.isAddition).toBeFalsy();
        });

        it('Should be an isEdition', function () {
          createController(['parent', 'edit'], 'item1', null, 12);
          expect(scope.isEdition).toBeTruthy();
        });

        it('Should not be a isLabelOnly', function () {
          createController(['parent', 'edit'], 'item1', null, 12);
          expect(scope.isLabelOnly).toBe('inactive');
        });

        it('Should not be a isLabelOnly if is a container', function () {
          createController(['parent', 'edit'], 'item1');
          expect(scope.isLabelOnly).toBeTruthy();
        });

        it('Should not be a isEditionParentMenu', function () {
          createController(['parent', 'edit'], 'item1', null, 12);
          expect(scope.isEditionParentMenu).toBeTruthy();
        });

        it('Should have a currentSelectedPageId', function () {
          createController(['parent', 'edit'], 'item1', null, 12);
          expect(scope.currentSelectedPageId).toBe(12);
        });


        it('Should not have a currentSelectedPageId if is a container', function () {
          createController(['parent', 'edit'], 'item1', null);
          expect(scope.currentSelectedPageId).toBe(0);
        });

        it('Should not have a menu', function () {
          createController(['parent', 'edit'], 'item1', null, 12);
          expect(scope.menu).toBeDefined();
        });

        it('should have only empty keys in the menu model', function () {
          createController(['parent', 'edit'], 'item1', null, 12);
          expect(scope.menu.model.name).toBe('item1');
          expect(scope.menu.model.page.id).toBe(12);
        });

        it('should have a parent key set', function () {
          createController(['parent', 'edit'], 'item1', null, 12);
          expect(scope.menu.parent).toBeNull();
        });

      });


      describe('we create a menu level 2', function () {

        it('Should be an isAddition', function () {
          createController(['add'], 'item1', 1, 12);
          expect(scope.isAddition).toBeTruthy();
        });

        it('Should not be an isEdition', function () {
          createController(['add'], 'item1', 1, 12);
          expect(scope.isEdition).toBeFalsy();
        });

        it('Should not be a isLabelOnly', function () {
          createController(['add'], 'item1', 1, 12);
          expect(scope.isLabelOnly).toBe('inactive');
        });

        it('Should not be a isEditionParentMenu', function () {
          createController(['add'], 'item1', 1, 12);
          expect(scope.isEditionParentMenu).toBeFalsy();
        });

        it('Should not have a currentSelectedPageId', function () {
          createController(['add'], 'item1', 1, 12);
          // Select a page works only in editon
          expect(scope.currentSelectedPageId).toBe(0);
        });

        it('Should not have a menu', function () {
          createController(['add'], 'item1', 1, 12);
          expect(scope.menu).toBeDefined();
        });

        it('should have only empty keys in the menu model', function () {
          createController(['add'], 'item1', 1, 12);
          expect(scope.menu.model.name).toBe('');
          expect(scope.menu.model.page).toBe('');
        });

        it('should have a parent key set', function () {
          createController(['add'], 'item1', 1, 12);
          expect(scope.menu.parent).not.toBeNull();
          expect(scope.menu.parent.displayName).toBe('item1');
        });

      });


      describe('we update a menu level 2', function () {

        it('Should not be an isAddition', function () {
          createController(['edit'], 'item1', 1, 12);
          expect(scope.isAddition).toBeFalsy();
        });

        it('Should be an isEdition', function () {
          createController(['edit'], 'item1', 1, 12);
          expect(scope.isEdition).toBeTruthy();
        });

        it('Should not be a isLabelOnly', function () {
          createController(['edit'], 'item1', 1, 12);
          expect(scope.isLabelOnly).toBe('inactive');
        });

        it('Should not be a isEditionParentMenu', function () {
          createController(['edit'], 'item1', 1, 12);
          expect(scope.isEditionParentMenu).toBeFalsy();
        });

        it('Should have a currentSelectedPageId', function () {
          createController(['edit'], 'item1', 1, 12);
          expect(scope.currentSelectedPageId).toBe(12);
        });

        it('Should not have a menu', function () {
          createController(['edit'], 'item1', 1, 12);
          expect(scope.menu).toBeDefined();
        });

        it('should have only empty keys in the menu model', function () {
          createController(['add', 'edit'], 'item1', 1, 12);
          expect(scope.menu.model.name).toBe('item1');
          expect(scope.menu.model.page.id).toBe(12);
        });

        it('should have a parent key set', function () {
          createController(['edit'], 'item1', 1, 12);
          expect(scope.menu.parent).toBeNull();
        });

      });

    });


  });
})();
