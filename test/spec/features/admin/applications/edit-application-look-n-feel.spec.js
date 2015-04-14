describe('Controller: editLooknfeelCtrl', function () {
  'use strict';

  var scope,
    applicationAPI,
    createCtrl,
    spyOnLoad,
    modalInstance,
    loadLayoutRequest;

  beforeEach(module('org.bonitasoft.features.admin.applications.editLookNFeel'));

  beforeEach(inject(function ($controller, $rootScope, _applicationAPI_, store, $q) {
    loadLayoutRequest = $q.defer();

    scope = $rootScope.$new();
    applicationAPI = _applicationAPI_;
    modalInstance = jasmine.createSpyObj('modalInstance', ['dismiss', 'close']);

    spyOnLoad = function (promise) {
      spyOn(store, 'load').and.returnValue(promise);
    };
    createCtrl = function (application) {
      $controller('editLooknfeelCtrl', {
        '$scope': scope,
        'applicationAPI': applicationAPI,
        '$modalInstance': modalInstance,
        'application': application,
        'store': store
      });
    };
  }));

  it('should dismiss modal instance on cancel', function () {
    createCtrl({ profileId: '1', layoutId: '1' });

    scope.cancel();

    expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
  });

  it('should load layout page', function () {
    spyOnLoad(loadLayoutRequest.promise);
    createCtrl({ profileId: '1', layoutId: '1' });

    loadLayoutRequest.resolve(['foo', 'bar']);
    scope.$apply();

    expect(scope.layoutPages).toEqual(['foo', 'bar']);
  });

  describe('in edit mode', function () {

    var updateRequest, application = {model: 'modele'};

    beforeEach(inject(function ($controller, $rootScope, _applicationAPI_, store, $q) {
      loadLayoutRequest = $q.defer();
      spyOnLoad(loadLayoutRequest.promise);

      updateRequest = $q.defer();
      spyOn(applicationAPI, 'update').and.returnValue({$promise: updateRequest.promise});
      createCtrl(application);
    }));

    it('should update application', function () {

      scope.submit({model: 'model'});

      expect(applicationAPI.update).toHaveBeenCalledWith('model');
    });

    it('should close modal on save success', function () {

      scope.submit({ model: '' });
      updateRequest.resolve({});
      scope.$apply();

      expect(modalInstance.close).toHaveBeenCalled();
    });

    it('should add an error on save failure with error 404 response', function () {

      scope.submit({ model: '' });
      scope.application = {form: { token: {}}, model: {}};
      updateRequest.reject({ status: 500,  data: {cause: {exception: 'Exception'}} });

      scope.$apply();

      expect(scope.alerts.length).toBe(1);
    });

  });

});
