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

  var mockApiApp = JSON.parse('[{"id":"1","creationDate":"1413791312250","iconPath":"","createdBy":{"last_connection":"2014-10-21 10:38:44.650","created_by_user_id":"-1","creation_date":"2014-10-20 09:33:35.195","id":"1","icon":"/default/icon_user.png","enabled":"true","title":"","manager_id":"0","job_title":"","userName":"walter.bates","lastname":"bates","firstname":"walter","password":"","last_update_date":"2014-10-20 09:33:35.195"},"token":"toto-mange","profileId":"1","description":"","state":"DEACTIVATED","displayName":"Toto mange","updatedBy":{"last_connection":"2014-10-21 10:38:44.650","created_by_user_id":"-1","creation_date":"2014-10-20 09:33:35.195","id":"1","icon":"/default/icon_user.png","enabled":"true","title":"","manager_id":"0","job_title":"","userName":"walter.bates","lastname":"bates","firstname":"walter","password":"","last_update_date":"2014-10-20 09:33:35.195"},"lastUpdateDate":"1413791312277","version":"1.0"}]');

  var mockModal = {
    templateUrl: 'features/admin/applications/edit-application.html',
    controller: 'addApplicationCtrl',
    size: 'sm',
    resolve: {
      application: jasmine.any(Function)
    }
  };

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


  describe('Controller: applicationDetailsCtrl', function() {

    var ctrl, scope, applicationAPI, modal, store, $httpBackend, $q;

    beforeEach(module('org.bonitasoft.features.admin.applications.details', 'org.bonitasoft.services.topurl'));

    beforeEach(inject(function ($controller, $injector, $rootScope, manageTopUrl, _$q_) {

      scope = $rootScope.$new();
      applicationAPI = $injector.get('applicationAPI');
      store = $injector.get('store');
      modal = $injector.get('$modal');
      manageTopUrl =  $injector.get('manageTopUrl');
      $httpBackend = $injector.get('$httpBackend');
      $q = _$q_;
      spyOn(modal, 'open').and.returnValue(fakeModal);

      ctrl = function(id) {
        scope.app = mockApiApp;
        return $controller('applicationDetailsCtrl', {
          '$scope': scope,
          'applicationAPI': applicationAPI,
          'store': store,
          '$stateParams': {
            id: id
          }
        });
      };

    }));

    describe('Load some data for the application', function() {

      beforeEach(function() {
        $httpBackend
          .expectGET('../API/portal/page?c=0&f=contentType%3Dlayout&p=0')
          .respond([],{'Content-Range': '0-3/3'});
        $httpBackend
          .expectGET('../API/portal/page?c=0&f=contentType%3Dtheme&p=0')
          .respond([],{'Content-Range': '0-3/3'});
        $httpBackend
          .expectGET('../API/living/application/2?d=createdBy&d=updatedBy&d=profileId&d=layoutId&d=themeId')
          .respond({
            id: 2
          });
        $httpBackend
          .expectGET('../API/portal/page?c=3&f=contentType%3Dlayout&p=0')
          .respond([{id: 1},{id: 2},{id: 3}]);
        $httpBackend
          .expectGET('../API/portal/page?c=3&f=contentType%3Dtheme&p=0')
          .respond([{id: 1},{id: 2},{id: 3}]);
      });

      it('should load application details', function() {
        ctrl(2);
        $httpBackend.flush();
        scope.$apply();
        expect(scope.app.id).toBe(2);
      });
      it('should load custom pages', function() {
        ctrl(2);
        $httpBackend.flush();
        scope.$apply();
        expect(scope.layoutPages.length).toBe(3);
      });

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation(false);
      });

    });

    describe('We will update the view thanks to a modal', function() {

      it('should open the modal when we trigger the update() method', function() {
        var Ctrl = ctrl(2);
        Ctrl.update('sm');
        expect(modal.open).toHaveBeenCalled();
        expect(modal.open).toHaveBeenCalledWith(mockModal);
      });

      it('should trigger the reload method on close', function() {
        var Ctrl = ctrl(2);

        spyOn(Ctrl, 'reload');
        Ctrl.update('sm');
        fakeModal.close();
        expect(Ctrl.reload).toHaveBeenCalled();
      });
    });

    describe('We will update the layout thanks to an edit in line', function() {
      var Ctrl;
      beforeEach(function() {
        spyOn(applicationAPI, 'get').and.returnValue({ $promise: $q.when({}) });
        spyOn(store, 'load').and.returnValue($q.when({}));
        Ctrl = ctrl(2);

      });

      it('should updateLayout method reload application on success', function() {
        spyOn(applicationAPI, 'update').and.returnValue({ $promise: $q.when({id: 2, layoutId: 3}) });
        spyOn(Ctrl, 'reload');

        Ctrl.updateLayout({'id':'2'},{'id':'3'});
        scope.$apply();

        expect(Ctrl.reload).toHaveBeenCalledWith({id: 2, layoutId: 3});

      });

      it('should updateLayout method handleErrors on error', function() {

        spyOn(applicationAPI, 'update').and.returnValue({ $promise: $q.reject({response: {data: {message: 'Erreur 500'}}}) });
        spyOn(Ctrl, 'handleErrors');

        Ctrl.updateLayout({'id':'2'},{'id':'3'});
        scope.$apply();

        expect(Ctrl.handleErrors).toHaveBeenCalledWith({response: {data: {message: 'Erreur 500'}}});

      });

      it('should updateTheme method reload application on success', function() {
        spyOn(applicationAPI, 'update').and.returnValue({ $promise: $q.when({id: 2, themeId: 3}) });
        spyOn(Ctrl, 'reload');

        Ctrl.updateTheme({'id':'2'},{'id':'3'});
        scope.$apply();

        expect(Ctrl.reload).toHaveBeenCalledWith({id: 2, themeId: 3});

      });

      it('should updateTheme method handleErrors on error', function() {

        spyOn(applicationAPI, 'update').and.returnValue({ $promise: $q.reject({response: {data: {message: 'Erreur 500'}}}) });
        spyOn(Ctrl, 'handleErrors');

        Ctrl.updateTheme({'id':'2'},{'id':'3'});
        scope.$apply();

        expect(Ctrl.handleErrors).toHaveBeenCalledWith({response: {data: {message: 'Erreur 500'}}});

      });

      it('should handleErrors return error message', function() {
        expect(Ctrl.handleErrors({data: {message: 'Erreur 500'}})).toEqual('Erreur 500');
      });
    });

  });

  describe('Application details icon', function() {

    var ctrl, scope, applicationAPI, modal, store, $httpBackend, $q, $state;

    beforeEach(module('org.bonitasoft.features.admin.applications.details', 'org.bonitasoft.services.topurl'));

    beforeEach(inject(function ($controller, $injector, $rootScope, manageTopUrl, _$q_) {

      scope = $rootScope.$new();
      applicationAPI = jasmine.createSpyObj('applicationAPI', ['get', 'update', 'search']);
      store = $injector.get('store');
      modal = $injector.get('$modal');
      manageTopUrl =  $injector.get('manageTopUrl');
      $httpBackend = $injector.get('$httpBackend');
      $q = _$q_;
      spyOn(modal, 'open').and.returnValue(fakeModal);
      $state = jasmine.createSpyObj('$state', ['reload']);

      ctrl = function(id) {
        scope.app = mockApiApp;
        return $controller('applicationDetailsCtrl', {
          '$scope': scope,
          'applicationAPI': applicationAPI,
          'store': store,
          '$stateParams': {
            id: id
          },
          '$state': $state
        });
      };

    }));

    describe('uploader', function() {

      beforeEach(function() {
        $httpBackend
          .expectGET('../API/portal/page?c=0&f=contentType%3Dlayout&p=0')
          .respond([],{'Content-Range': '0-3/3'});
        $httpBackend
          .expectGET('../API/portal/page?c=0&f=contentType%3Dtheme&p=0')
          .respond([],{'Content-Range': '0-3/3'});
        $httpBackend
          .expectGET('../API/portal/page?c=3&f=contentType%3Dlayout&p=0')
          .respond([{id: 1},{id: 2},{id: 3}]);
        $httpBackend
          .expectGET('../API/portal/page?c=3&f=contentType%3Dtheme&p=0')
          .respond([{id: 1},{id: 2},{id: 3}]);
      });

      it('should create an uploader for user avatar upload', () => {
        expect(ctrl(2).uploader.url).toBe('../portal/imageUpload');
        $httpBackend.flush();
      });

      it('should update user on upload success', () => {
        applicationAPI.update.and.returnValue({$promise: $q.when({})});

        ctrl(2).uploader.onSuccessItem({}, 'tmp_123445656.png');
        $httpBackend.flush();
        scope.$apply();

        expect(applicationAPI.update).toHaveBeenCalled();
        expect($state.reload).toHaveBeenCalled();
      });

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation(false);
      });

    });
  });

  describe('Directive: backButton', function() {

    var $compile,
      scope,
      modal,
      $window,
      manageTopUrl;

    beforeEach(module('org.bonitasoft.features.admin.applications.details', 'org.bonitasoft.services.topurl'));

    beforeEach(inject(function($injector, $rootScope) {
      $compile = $injector.get('$compile');
      scope = $rootScope.$new();
      $window = $injector.get('$window');
      modal = $injector.get('$modal');
      manageTopUrl = $injector.get('manageTopUrl');

      spyOn(manageTopUrl, 'addOrReplaceParam');
    }));

    it('should be a button', function() {
      var dom = $compile('<back-button></back-button>')(scope);
      scope.$apply();

      expect(dom.find('button').hasClass('btn btn-default')).toBe(true);
    });

    it('should have back name', function() {
      var dom = $compile('<back-button></back-button>')(scope);
      scope.$apply();

      expect(dom.find('button').text()).toBe('back');
    });

    it('should call back history on click', function() {
      $window.history = jasmine.createSpyObj('history', ['back']);
      var dom = $compile('<back-button></back-button>')(scope);
      scope.$apply();

      dom.find('button').triggerHandler('click');

      expect($window.history.back).toHaveBeenCalled();
    });

  });

})();
