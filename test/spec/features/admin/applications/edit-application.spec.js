describe('Controller: addApplicationCtrl', function () {
  'use strict';

  var scope,
    applicationAPI,
    createCtrl,
    modalInstance,
    loadProfilesRequest;

  beforeEach(module('com.bonita.features.admin.applications.edit'));

  beforeEach(inject(function ($controller, $rootScope, _applicationAPI_, store, $q) {
    loadProfilesRequest = $q.defer();

    scope = $rootScope.$new();
    applicationAPI = _applicationAPI_;
    spyOn(store, 'load').and.returnValue(loadProfilesRequest.promise);
    modalInstance = jasmine.createSpyObj('modalInstance', ['dismiss', 'close']);

    createCtrl = function (application) {
      $controller('addApplicationCtrl', {
        '$scope': scope,
        'applicationAPI': applicationAPI,
        '$modalInstance': modalInstance,
        'application': application,
        'store': store
      });
    };
  }));

  it('should dismiss modal instance on cancel', function () {
    createCtrl();

    scope.cancel();

    expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
  });

  it('should load profiles on creation', function () {
    createCtrl();

    loadProfilesRequest.resolve(['foo', 'bar']);
    scope.$apply();

    expect(scope.profiles).toEqual(['foo', 'bar']);
  });

  describe('in creation mode', function() {

    var saveRequest;

    beforeEach(inject(function ($controller, $rootScope, _applicationAPI_, store, $q) {
      saveRequest = $q.defer();
      spyOn(applicationAPI, 'save').and.returnValue({ $promise: saveRequest.promise });
      createCtrl();
    }));

    it('should save application', function () {

      scope.submit({model: 'model'});

      expect(applicationAPI.save).toHaveBeenCalledWith('model');
    });

    it('should close modal on save success', function () {

      scope.submit({ model: '' });
      saveRequest.resolve({});
      scope.$apply();

      expect(modalInstance.close).toHaveBeenCalled();
    });

    it('should add an error on save failure with error 404 response', function () {

      scope.submit({ model: '' });
      saveRequest.reject({ status: 404 });
      scope.$apply();

      expect(scope.alerts.length).toBe(1);
    });

    it('should add an error on save failure with error different than 404 or 500 response', function () {

      scope.submit({ model: '' });
      scope.application = {form: { name: {}}, model: {}};
      saveRequest.reject({ data: {cause: {exception: 'AlreadyExistsException'}} });

      scope.$apply();

      expect(scope.alerts.length).toBe(1);
    });

    it('should turn duplicate to true on save failure with 500 response', function () {

      scope.submit({ model: '' });
      scope.application = {form: { token: {}}, model: {}};
      saveRequest.reject({ status: 500,  data: {cause: {exception: 'AlreadyExistsException'}} });

      scope.$apply();

      expect(scope.application.form.token.$duplicate).toBe(true);
    });

  });

  describe('in edit mode', function() {

    var updateRequest, application = { model: 'model' };

    beforeEach(inject(function ($controller, $rootScope, _applicationAPI_, store, $q) {
      updateRequest = $q.defer();
      spyOn(applicationAPI, 'update').and.returnValue({$promise: updateRequest.promise});
      createCtrl(application);
    }));

    it('should call Update application API when edition mode is true', function () {

      scope.submit(application);

      expect(applicationAPI.update).toHaveBeenCalledWith('model');
    });
  });
});
