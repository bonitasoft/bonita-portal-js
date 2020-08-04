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

(function() {
  'use strict';

  function mockModal(ctrl, view, size) {

    var modal = {
      templateUrl: 'features/admin/applications/' + view + '-application.html',
      controller: ctrl + 'ApplicationCtrl',
      controllerAs: ctrl + 'ApplicationCtrl',
      size: size || 'sm',
      resolve: {
        application: jasmine.any(Function)
      }
    };

    if('import' === ctrl) {
      delete modal.size;
    }
    return modal;
  }

  /**
   * Mock for the $modal from ui.bootstrap
   * {@link http://stackoverflow.com/questions/21214868/angularjs-ui-bootstrap-mocking-modal-in-unit-test}
   * @type {Object}
   */
  var fakeModal = {
    result: {
      then: function(confirmCallback, cancelCallback) {
        //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
        this.confirmCallBack = confirmCallback || angular.noop;
        this.cancelCallback = cancelCallback || angular.noop;
      }
    },
    close: function(item) {
      //The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
      this.result.confirmCallBack(item);
    },
    dismiss: function(type) {
      //The user clicked cancel on the modal dialog, call the stored cancel callback
      this.result.cancelCallback(type);
    }
  };

  describe('Load the module application-list', function() {

    beforeEach(module('org.bonitasoft.features.admin.applications.list'));

    describe('Controller: applicationsListCtrl', function() {

      var scope, applicationAPI, createCtrl, modal, store, loadRequest, _window, applicationLink;

      beforeEach(inject(function($controller, $rootScope, $injector, $q) {
        loadRequest = $q.defer();
        scope = $rootScope.$new();
        applicationAPI = $injector.get('applicationAPI');
        store = $injector.get('store');
        modal = $injector.get('$modal');
        applicationLink = {isInApps: false};
        _window = {location: {hash: {}}, parent: {location: {hash: {}}}};

        createCtrl = function() {
          return $controller('applicationsListCtrl', {
            '$scope': scope,
            'applicationAPI': applicationAPI,
            'store': store,
            '$modal': modal,
            ApplicationLink: applicationLink,
            $window: _window
          });
        };
        spyOn(store, 'load').and.returnValue(loadRequest.promise);
        spyOn(modal, 'open').and.returnValue(fakeModal);
      }));


      it('should load applications first', function() {
        var dataset = [{
          id: 1
        }, {
          id: 2
        }];

        createCtrl();
        loadRequest.resolve(dataset);
        scope.$apply();

        expect(JSON.stringify(scope.applications)).toBe(JSON.stringify(dataset));
        expect(scope.noData).toBe(false);
      });

      it('should set noData flag if no data have been found', function() {
        var dataset = [];

        createCtrl();
        loadRequest.resolve(dataset);
        scope.$apply();

        expect(scope.noData).toBe(true);
      });

      describe('When we will create something', function() {

        it('should open da modal', function() {
          var Ctrl = createCtrl();
          scope.$apply();
          Ctrl.create('sm');
          expect(modal.open).toHaveBeenCalled();
          expect(modal.open).toHaveBeenCalledWith(mockModal('add', 'edit'));
        });

        it('should reload the data when we close the modal', function() {
          var Ctrl = createCtrl();
          scope.$apply();
          Ctrl.create('sm');

          Ctrl.modalCreate.close();

          expect(store.load).toHaveBeenCalled();
        });

      });

      describe('When we will Import something', function() {

        it('should open da modal', function() {
          var Ctrl = createCtrl();
          scope.$apply();
          Ctrl.importApp('sm');
          expect(modal.open).toHaveBeenCalledWith({
            templateUrl: 'features/admin/applications/import-application.html',
            controller: 'importApplicationCtrl',
            controllerAs: 'importApplicationCtrl',
            backdrop: 'static',
            resolve: {
              application: jasmine.any(Function)
            }
          });
        });

        it('should reload the data when we close the modal', function() {
          var Ctrl = createCtrl();
          scope.$apply();
          Ctrl.importApp('sm');

          Ctrl.modalImport.close();
          expect(store.load).toHaveBeenCalled();
        });

      });

      describe('Url management', function() {
        var manageTopUrl;

        beforeEach(inject(function ($injector) {
          manageTopUrl = $injector.get('manageTopUrl');
          spyOn(manageTopUrl,'addOrReplaceParam');
        }));

        it('should call addOrReplaceParam when we trigger goToDetails', function() {
          var Ctrl = createCtrl();
          Ctrl.goToDetails(1);
          expect(manageTopUrl.addOrReplaceParam).toHaveBeenCalled();
          expect(manageTopUrl.addOrReplaceParam).toHaveBeenCalledWith('_id',1);
        });

        it('should goto application details when we are in an app', function() {
          var Ctrl = createCtrl();
          spyOn(manageTopUrl,'getPath').and.returnValue('/bonita/apps/appName/admin-applications');
          applicationLink.isInApps = true;
          Ctrl.goToApplicationDetails(1);
          expect(manageTopUrl.getPath).toHaveBeenCalled();
          expect(_window.parent.location).toBe('/bonita/apps/appName/admin-applications../admin-application-details?id=1');
        });
      });

      describe('When we will Export something', function() {

        it('should open da modal', function() {
          var Ctrl = createCtrl();
          scope.$apply();
          Ctrl.exportApplication('md');
          expect(modal.open).toHaveBeenCalled();
          expect(modal.open).toHaveBeenCalledWith(mockModal('export', 'export', 'md'));
        });

        it('should reload the data when we close the modal', function() {
          var Ctrl = createCtrl();
          scope.$apply();
          Ctrl.exportApplication('md');

          Ctrl.modalExport.close();
          expect(store.load).toHaveBeenCalled();
        });

      });

      describe('When we will delete something', function() {

        it('should open da modal', function() {
          var Ctrl = createCtrl();
          scope.$apply();
          Ctrl.deleteApplication(null, 'sm');
          expect(modal.open).toHaveBeenCalled();
          expect(modal.open).toHaveBeenCalledWith(mockModal('delete', 'delete'));
        });

        it('should reload the data when we close the modal', function() {
          var Ctrl = createCtrl();
          scope.$apply();
          Ctrl.deleteApplication(null, 'sm');

          Ctrl.modalDelete.close();

          expect(store.load).toHaveBeenCalled();
        });

      });


    });

    describe('exportApplicationCtrl', function() {

      var controller, modalInstance, applicationAPI, loadRequest, createCtrl, scope;

      beforeEach(inject(function($injector, $q, $rootScope) {

        controller = $injector.get('$controller');
        modalInstance = angular.copy(fakeModal);
        applicationAPI = $injector.get('applicationAPI');
        scope = $rootScope.$new();
        loadRequest = $q.defer();

        //@TODO wait for export method
        // spyOn(applicationAPI,'export').and.returnValue({
        //     $promise: loadRequest
        // });

        spyOn(modalInstance, 'dismiss');
        spyOn(modalInstance, 'close');

        createCtrl = function() {
          scope.application = {
            id: 1337
          };
          return controller('exportApplicationCtrl', {
            '$scope': scope,
            'applicationAPI': applicationAPI,
            '$modalInstance': modalInstance,
            'application': {
              id: 1337
            }
          });
        };

      }));

      it('should close the modal when we trigger cancel', function() {
        var Ctrl = createCtrl();
        Ctrl.cancel();

        expect(modalInstance.dismiss).toHaveBeenCalled();
        expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
      });


      it('should try to export an app', function() {
        // var Ctrl = createCtrl();
        // Ctrl.exportApp();

        //@TODO wait for expect method
        // expect(applicationAPI.export).toHaveBeenCalled();
        // expect(applicationAPI.export).toHaveBeenCalledWith({id: 1337});
      });

      it('should try to export an app and close da modal', function() {
        // var Ctrl = createCtrl();
        // Ctrl.exportApp();

        //@TODO wait for expect method
        // loadRequest.resolve();
        // expect(modalInstance.close).toHaveBeenCalled();
      });
    });

    describe('Service templateAppDetailLoader', function() {

      var http,loadRequestService,rootScope,templateAppDetailLoader,templateCache, interpolate;

      beforeEach(inject(function ($injector, $q) {

        http                    = $injector.get('$http');
        rootScope               = $injector.get('$rootScope');
        interpolate             = $injector.get('$interpolate');
        templateCache           = $injector.get('$templateCache');
        templateAppDetailLoader = $injector.get('templateAppDetailLoader');

        loadRequestService = $q.defer();

        spyOn(http,'get').and.returnValue(loadRequestService.promise);
        spyOn(templateCache,'put');
      }));

      it('should have a noop for compile if no template available', function() {
        expect(templateAppDetailLoader.compile).toBe(angular.noop);
      });

      it('should load the template', function() {
        templateAppDetailLoader.load();
        expect(http.get).toHaveBeenCalled();
        expect(http.get).toHaveBeenCalledWith('features/admin/applications/details/application-details-app.html');
      });

      it('should fill the templateCache', function() {
        templateAppDetailLoader.load();
        loadRequestService.resolve({data: '<div>{{name}}</div>'});
        rootScope.$apply();
        expect(templateCache.put).toHaveBeenCalled();
        expect(templateCache.put).toHaveBeenCalledWith('features/admin/applications/details/application-details-app.html', '<div>{{name}}</div>');
      });

      it('should set the $interpolate service with template to service.compile', function() {
        templateAppDetailLoader.load();
        loadRequestService.resolve({data: '<div>{{name}}</div>'});
        rootScope.$apply();
        expect(templateAppDetailLoader.compile).not.toBe(angular.noop);
        expect(templateAppDetailLoader.compile({name: 'toto'})).toBe('<div>toto</div>');
      });

      it('should execute a callback on load if you give one', function() {
        function test(data) {
          expect(data).toBe('<div>{{name}}</div>');
        }
        templateAppDetailLoader.load(test);
        loadRequestService.resolve({data: '<div>{{name}}</div>'});
        rootScope.$apply();
      });
    });


    describe('Directive exportAppButton', function() {

      var $compile,scope,rootScope;

      beforeEach(inject(function ($injector, $rootScope) {

        $compile  = $injector.get('$compile');
        rootScope = $rootScope;
        scope     = $rootScope.$new();

      }));

      it('should have a transclusion activated ', function() {
        var dom = $compile('<export-app-button>Export your application</export-app-button>')(scope);
        scope.$apply();
        expect(dom.html().indexOf('Export your application') > -1).toBeTruthy();
      });

      it('should a replace activated', function() {
        var dom = $compile('<export-app-button>Export your application</export-app-button>')(scope);
        scope.$apply();
        expect(dom.html().indexOf('export-app-button') > -1).toBeFalsy();
      });

      describe('With an attribute title', function() {

        it('should have a title if we give one, empty for no value set - undefined', function() {

          scope.name = undefined;
          var dom = $compile('<export-app-button title="{{name}}">Export your application</export-app-button>')(scope);
          scope.$apply();
          expect(dom.attr('title') === '').toBeTruthy();
        });

        it('should have a title if we give one, empty for no value set - null', function() {

          scope.name = null;
          var dom = $compile('<export-app-button title="{{name}}">Export your application</export-app-button>')(scope);
          scope.$apply();
          expect(dom.attr('title') === '').toBeTruthy();
        });

        it('should have a title if we give one, fill for a value set', function() {

          scope.name = 'test';
          var dom = $compile('<export-app-button title="{{name}}">Export your application</export-app-button>')(scope);
          scope.$apply();
          expect(dom.attr('title') === 'test').toBeTruthy();
        });

        it('should have a title if we give one, fill for a value set', function() {

          scope.name = 42;
          var dom = $compile('<export-app-button title="{{name}}">Export your application</export-app-button>')(scope);
          scope.$apply();
          expect(dom.attr('title') === '42').toBeTruthy();
        });

      });

      describe('With an attribute class', function() {

        it('should have a default one set to btn-export', function() {
          var dom = $compile('<export-app-button>Export your application</export-app-button>')(scope);
          scope.$apply();
          expect(dom.hasClass('btn-export')).toBeTruthy();
        });

        it('should have other class if we give it some classNames', function() {
          var dom = $compile('<export-app-button class="btn btn-test">Export your application</export-app-button>')(scope);
          scope.$apply();
          expect(dom.hasClass('btn-test')).toBeTruthy();
          expect(dom.hasClass('btn')).toBeTruthy();
        });

        it('should have a default one set to btn-export and other oif specify', function() {
          var dom = $compile('<export-app-button class="btn btn-test">Export your application</export-app-button>')(scope);
          scope.$apply();
          expect(dom.hasClass('btn-export')).toBeTruthy();
        });

      });

      describe('Create a download URL', function() {

        it('should have a default url to download', function() {
          var dom = $compile('<export-app-button>Export your application</export-app-button>')(scope);
          scope.$apply();
          expect(dom.attr('href') === '../portal/exportApplications?id=').toBeTruthy();
        });

        it('should have an id in the url', function() {
          var dom = $compile('<export-app-button app-id="42">Export your application</export-app-button>')(scope);
          scope.$apply();
          expect(dom.attr('href') === '../portal/exportApplications?id=42').toBeTruthy();
        });

        it('should custom the url', function() {
          var dom = $compile('<export-app-button url="/export/" app-id="42">Export your application</export-app-button>')(scope);
          scope.$apply();
          expect(dom.attr('href') === '/export/42').toBeTruthy();
        });

      });

    });


  });



})();
