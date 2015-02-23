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

    var ctrl, scope, applicationAPI, modal, store, $httpBackend;

    beforeEach(module('org.bonitasoft.features.admin.applications.details', 'org.bonitasoft.services.topurl'));

    beforeEach(inject(function ($controller, $injector, $rootScope, manageTopUrl) {

      scope = $rootScope.$new();
      applicationAPI = $injector.get('applicationAPI');
      store = $injector.get('store');
      modal = $injector.get('$modal');
      manageTopUrl =  $injector.get('manageTopUrl');
      $httpBackend = $injector.get('$httpBackend');
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
          .expectGET('../API/living/application/2?d=createdBy&d=updatedBy&d=profileId')
          .respond({
            id: 2
          });
      });

      it('should load application details', function() {
        ctrl(2);
        $httpBackend.flush();
        scope.$apply();
        expect(scope.app.id).toBe(2);
      });

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
      });

    });

    describe('We will update the view thanks to a modal', function() {

      it('should open the modal when we trigger the update() method', function() {
        var Ctrl = ctrl(2);
        Ctrl.update('sm');
        expect(Ctrl.modal).not.toBeNull();
        expect(modal.open).toHaveBeenCalled();
        expect(modal.open).toHaveBeenCalledWith(mockModal);
      });

      it('should trigger the reload method on close', function() {
        var Ctrl = ctrl(2);

        spyOn(Ctrl, 'reload');
        Ctrl.update('sm');
        Ctrl.modal.close();
        expect(Ctrl.reload).toHaveBeenCalled();
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
