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

  /**
   * Mock for the $modal from ui.bootstrap
   * {@link http://stackoverflow.com/questions/21214868/angularjs-ui-bootstrap-mocking-modal-in-unit-test}
   * @type {Object}
   */
  var fakeModal = {
    result: {
      then: function (confirmCallback, cancelCallback) {
        //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
        this.confirmCallBack = confirmCallback || angular.noop;
        this.cancelCallback = cancelCallback || angular.noop;
      }
    },
    close: function (item) {
      //The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
      this.result.confirmCallBack(item);
    },
    dismiss: function (type) {
      //The user clicked cancel on the modal dialog, call the stored cancel callback
      this.result.cancelCallback(type);
    }
  };

  describe('Module page list', function () {

    beforeEach(module('org.bonitasoft.features.admin.applications.details.page-list'));


    describe('Factory pageModel', function () {

      var rootScope, loadRequest, applicationAPI, applicationPageAPI, store, pageModel;

      beforeEach(inject(function ($q, $injector) {

        loadRequest = $q.defer();
        rootScope = $injector.get('$rootScope');
        applicationAPI = $injector.get('applicationAPI');
        applicationPageAPI = $injector.get('applicationPageAPI');
        store = $injector.get('store');
        pageModel = $injector.get('pageModel');

        spyOn(store, 'load').and.returnValue(loadRequest.promise);
        spyOn(applicationPageAPI, 'delete').and.returnValue({
          $promise: loadRequest.promise
        });
        spyOn(applicationAPI, 'update').and.returnValue({
          $promise: loadRequest.promise
        });
        spyOn(rootScope, '$emit');

      }));

      describe('We check if a page exist in a collection', function () {

        it('should emit page-list:pagesexist with arg true if it is the first time and we have pages', function () {
          pageModel.exist([
            {
              id: 21,
              name: 'de'
            }
          ]);
          expect(rootScope.$emit).toHaveBeenCalled();
          expect(rootScope.$emit).toHaveBeenCalledWith('page-list:pagesexist', true);
        });

        it('should emit page-list:pagesexist with arg false if it is the first time and no pages', function () {
          pageModel.exist([]);
          expect(rootScope.$emit).toHaveBeenCalled();
          expect(rootScope.$emit).toHaveBeenCalledWith('page-list:pagesexist', false);
        });

        it('should emit page-list:pagesexist if no pages event if it is not the first time if no pages', function () {
          pageModel.loadedPagesEventTriggered = true;
          pageModel.exist([]);
          expect(rootScope.$emit).toHaveBeenCalled();
          expect(rootScope.$emit).toHaveBeenCalledWith('page-list:pagesexist', false);
        });

        it('should not emit page-list:pagesexist if it is not the first time', function () {
          pageModel.loadedPagesEventTriggered = true;
          pageModel.exist([
            {
              id: 21,
              name: 'de'
            }
          ]);
          expect(rootScope.$emit).not.toHaveBeenCalled();
        });

      });


      describe('We load the application', function () {

        beforeEach(function () {
          spyOn(pageModel, 'exist');
        });

        it('should reset the loaded page event if we specify it is the first load', function () {
          pageModel.loadedPagesEventTriggered = true;
          pageModel.load(1, true);
          expect(pageModel.loadedPagesEventTriggered).toBeFalsy();
        });

        it('should not reset the loaded page event if we do not specify it is the first load', function () {
          pageModel.loadedPagesEventTriggered = true;
          pageModel.load(1);
          expect(pageModel.loadedPagesEventTriggered).not.toBeFalsy();
        });

        it('should trigger store.load', function () {
          pageModel.load(1);
          expect(store.load).toHaveBeenCalled();
          expect(store.load).toHaveBeenCalledWith(jasmine.any(Function), {
            d: ['pageId'],
            f: 'applicationId=1'
          });
        });

        it('should trigger pageModel.exist on resolve', function () {
          pageModel.load(1);
          loadRequest.resolve([
            {
              id: 21,
              name: 'de'
            }
          ]);
          rootScope.$apply();
          expect(pageModel.exist).toHaveBeenCalled();
          expect(pageModel.exist).toHaveBeenCalledWith([
            {
              id: 21,
              name: 'de'
            }
          ]);
        });

      });

      describe('Remove a page', function () {

        it('should trigger delete from applicationPageAPI', function () {
          pageModel.remove({
            id: 14
          });
          expect(applicationPageAPI.delete).toHaveBeenCalled();
          expect(applicationPageAPI.delete).toHaveBeenCalledWith({
            id: 14
          });
        });

        it('should emit page-list:update', function () {
          pageModel.remove({
            id: 14
          });
          loadRequest.resolve();
          rootScope.$apply();
          expect(rootScope.$emit).toHaveBeenCalled();
          expect(rootScope.$emit).toHaveBeenCalledWith('page-list:update');
        });

      });

      describe('Set a page as the home page', function () {

        var app = {
          id: 1,
          profileId: {
            id: 42
          },
          layoutId: {
            id: 39
          },
          themeId: {
            id: 40
          },
          createdBy: {
            id: 69
          },
          updatedBy: {
            id: 1337
          }
        };

        var appUpdate = {
          homePageId: 24,
          layoutId: 39,
          themeId: 40,
          profileId: 42,
          createdBy: 69,
          updatedBy: 1337
        };

        it('should trigger an update of the applicationAPI', function () {
          pageModel.setHome({
            id: 24
          }, app);
          expect(applicationAPI.update).toHaveBeenCalled();
          expect(applicationAPI.update).toHaveBeenCalledWith({
            id: 1
          }, angular.extend({}, app, appUpdate));
        });

        it('should add a debug log on resolve', function () {

          spyOn(console, 'debug');
          pageModel.setHome({
            id: 24,
            pageId: {
              displayName: 'toto'
            }
          }, app);

          loadRequest.resolve();
          rootScope.$apply();

          expect(console.debug).toHaveBeenCalled();
          expect(console.debug).toHaveBeenCalledWith('[pageModel@setHome] Set the page:toto as the Home Page');
        });

      });


    });


    describe('Controller: pageListCtrl', function () {
      var createController,
        scope,
        pageModel,
        loadRequest,
        modal;

      beforeEach(module('org.bonitasoft.features.admin.applications.details.page-list'));

      beforeEach(inject(function ($controller, $rootScope, $injector, $q) {

        scope = $rootScope.$new();

        modal = $injector.get('$modal');
        pageModel = $injector.get('pageModel');
        loadRequest = $q.defer();

        spyOn(modal, 'open').and.returnValue(fakeModal);
        spyOn(pageModel, 'exist').and.returnValue(loadRequest.promise);
        spyOn(pageModel, 'load').and.returnValue(loadRequest.promise);
        spyOn(pageModel, 'remove').and.returnValue(loadRequest.promise);
        spyOn(pageModel, 'setHome').and.returnValue(loadRequest.promise);


        createController = function (application) {
          scope.application = application;
          return $controller('pageListCtrl', {
            $scope: scope,
            $modal: modal,
            pageModel: pageModel
          });
        };
      }));

      it('should create a new controller', function () {
        var Ctrl = createController({
          id: 1
        });
        expect(Ctrl).not.toBeUndefined();
      });


      describe('when we load the application', function () {

        it('should load application pages on creation', function () {
          createController({
            id: 1
          });

          scope.$apply();
          expect(pageModel.load).toHaveBeenCalled();
          expect(pageModel.load).toHaveBeenCalledWith(1, true);
        });


        it('should add pages onresolve', function () {
          createController({
            id: 1
          });

          loadRequest.resolve([
            {
              id: 1
            },
            {
              id: 2
            }
          ]);
          scope.$apply();
          expect(scope.pages.length).toBe(2);
        });

      });


      describe('We want to add a new page', function () {

        it('should open the modal when we trigger the add() method', function () {
          var Ctrl = createController({
            id: 1
          });

          Ctrl.add();
          scope.$apply();
          expect(modal.open).toHaveBeenCalled();
          expect(modal.open).toHaveBeenCalledWith({
            templateUrl: 'features/admin/applications/details/page-list-addPageModal.html',
            controller: 'addPageCtrl',
            size: 'lg',
            resolve: {
              application: jasmine.any(Function)
            }
          });

        });

        it('should reload the pages when we close da modal', function () {
          var Ctrl = createController({
            id: 1
          });

          spyOn(Ctrl, 'loadPages');

          Ctrl.add();
          Ctrl.modal.close();
          expect(Ctrl.loadPages).toHaveBeenCalled();
          expect(Ctrl.loadPages).toHaveBeenCalledWith(void 0);

        });


      });

      describe('We remove a page', function () {

        it('should call the factory pageModel', function () {
          var Ctrl = createController({
            id: 1
          });
          Ctrl.remove({
            id: 333
          });
          expect(pageModel.remove).toHaveBeenCalled();
          expect(pageModel.remove).toHaveBeenCalledWith({
            id: 333
          });

        });

        it('should reload da pages on resolve', function () {
          var Ctrl = createController({
            id: 1
          });

          spyOn(Ctrl, 'loadPages');
          Ctrl.remove({
            id: 333
          });
          loadRequest.resolve();
          scope.$apply();
          expect(Ctrl.loadPages).toHaveBeenCalled();
          //because we bind -> arguments so it's not the same
          expect(Ctrl.loadPages).toHaveBeenCalledWith(void 0);

        });

      });

      describe('We want to specify a page as the home page', function () {

        it('should call the factory', function () {
          var Ctrl = createController({
            id: 1
          });
          Ctrl.setAsHomePage({
            id: 333
          });
          expect(pageModel.setHome).toHaveBeenCalled();
          expect(pageModel.setHome).toHaveBeenCalledWith({
            id: 333
          }, {
            id: 1
          });
        });

        it('should reload pages on resolve', function () {
          var Ctrl = createController({
            id: 1
          });

          spyOn(Ctrl, 'loadPages');
          Ctrl.setAsHomePage({
            id: 333
          });

          loadRequest.resolve();
          scope.$apply();

          expect(Ctrl.loadPages).toHaveBeenCalled();
          expect(Ctrl.loadPages).toHaveBeenCalledWith();
        });

        it('should change the current homePageId from the application on resolve', function () {
          var Ctrl = createController({
            id: 1
          });

          Ctrl.setAsHomePage({
            id: 333
          });
          loadRequest.resolve();
          scope.$apply();

          expect(scope.application.homePageId).toBe(333);
        });

      });


    });


    describe('Controller: addPageCtrl', function () {


      var createController, scope, application, customPageAPI, applicationPageAPI, loadRequest, saveRequest, modalInstance = {}, store;


      beforeEach(module('org.bonitasoft.features.admin.applications.details.page-list', 'org.bonitasoft.common.resources.store'));

      beforeEach(inject(function ($controller, $rootScope, $q, $injector) {

        scope = $rootScope.$new();
        application = {
          id: 1
        };
        customPageAPI = $injector.get('customPageAPI');
        applicationPageAPI = $injector.get('applicationPageAPI');
        store = $injector.get('store');

        modalInstance = angular.copy(fakeModal);
        loadRequest = $q.defer();
        saveRequest = $q.defer();

        spyOn(applicationPageAPI, 'save')
          .and.returnValue({
            $promise: saveRequest.promise
          });

        spyOn(modalInstance, 'close');
        spyOn(modalInstance, 'dismiss');

        spyOn(store, 'load').and.returnValue(loadRequest.promise);

        createController = function createController() {
          scope.customPages = [];
          scope.alerts = [];

          return $controller('addPageCtrl', {
            $scope: scope,
            customPageAPI: customPageAPI,
            $modalInstance: modalInstance,
            application: application,
            store: store
          });
        };
      }));

      it('should create a new controller', function () {
        var Ctrl = createController();
        expect(Ctrl).not.toBeUndefined();
      });


      it('should remove an alert when we trigger closeAlert', function () {
        createController({
          id: 1
        });
        scope.$apply();
        scope.alerts.push({
          name: 'de'
        }, {
          name: 'wqd'
        });
        expect(scope.alerts.length).toBe(2);
        scope.closeAlert(1);
        expect(scope.alerts.length).toBe(1);
        scope.closeAlert(0);
        expect(scope.alerts.length).toBe(0);
        scope.closeAlert(0);
        expect(scope.alerts.length).toBe(0);
      });


      it('should load some data when we open the modal', function () {
        createController();
        scope.$apply();
        expect(store.load).toHaveBeenCalledWith(customPageAPI, {f: 'contentType=page'});
      });

      it('should add pages to customPages on resolve', function () {

        expect(scope.customPages).toBeUndefined();

        createController();
        loadRequest.resolve(['de']);
        scope.$apply();
        expect(Array.isArray(scope.customPages)).toBe(true);
      });

      it('should save application page', function () {
        createController();
        scope.page = {form: {token: {}}};
        scope.$apply();

        scope.add({
          model: {token: ''}
        });

        expect(applicationPageAPI.save).toHaveBeenCalledWith({ token: '', applicationId: 1 });
      });

      it('should close modal on save success', function () {
        createController();
        scope.page = {form: {token: {}}};
        scope.add({
          model: {token: ''}
        });
        saveRequest.resolve({});
        scope.$apply();
        expect(modalInstance.close).toHaveBeenCalled();
      });

      it('should add an error on save failure with error 404 response', function () {
        createController();
        scope.page = {form: {token: {}}};
        scope.add({
          model: {token: ''}
        });
        saveRequest.reject({
          status: 404,
          data: {}
        });
        scope.$apply();

        expect(scope.alerts.length).toBe(1);
      });

      it('should add an error on save failure with error different than 404 or 500 response', function () {
        createController();
        scope.page = {form: {token: {}}};
        scope.add({
          model: {token: ''}
        });
        saveRequest.reject({
          data: {}
        });

        scope.$apply();

        expect(scope.alerts.length).toBe(1);
      });

      it('should turn duplicate to true on save failure with 500 response', function () {
        createController();
        scope.page = {form: {token: {}}};
        scope.add({
          model: {token: ''}
        });
        scope.page = {
          form: {
            token: {}
          },
          model: {}
        };
        saveRequest.reject({
          status: 500,
          data: {
            cause: {
              exception: 'AlreadyExistsException'
            }
          }
        });

        scope.$apply();

        expect(scope.page.form.token.$duplicate).toBe(true);
      });


      it('should turn reservedToken to true on save with "API" token', function () {
        createController();
        scope.page = {form: { token: {}}};
        scope.add({model: {token: 'api'}});
        scope.$apply();
        expect(scope.page.form.token.$reservedToken).toBe(true);
      });

      it('should turn reservedToken to true on save with "content" token', function () {
        createController();
        scope.page = {form: { token: {}}};
        scope.add({model: {token: 'content'}});
        scope.$apply();
        expect(scope.page.form.token.$reservedToken).toBe(true);
      });

      it('should turn reservedToken to true on save with "theme" token', function () {
        createController();
        scope.page = {form: { token: {}}};
        scope.add({model: {token: 'theme'}});
        scope.$apply();
        expect(scope.page.form.token.$reservedToken).toBe(true);
      });

      it('When we close the modal we should call dismiss', function () {
        createController();
        scope.$apply();
        scope.cancel();
        expect(modalInstance.dismiss).toHaveBeenCalled();
      });

    });
  });


})();
