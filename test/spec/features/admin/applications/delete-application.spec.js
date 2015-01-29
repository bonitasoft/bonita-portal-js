describe('Controller: deleteApplicationCtrl', function () {
  'use strict';

  var scope,
    applicationAPI,
    createCtrl,
    modalInstance,
    deleteRequest;

  beforeEach(module('com.bonita.features.admin.applications.delete'));

  beforeEach(inject(function ($controller, $rootScope, _applicationAPI_, $q) {
    scope = $rootScope.$new();
    applicationAPI = _applicationAPI_;
    deleteRequest = $q.defer();
    spyOn(applicationAPI, 'delete').and.returnValue({$promise: deleteRequest.promise});
    modalInstance = jasmine.createSpyObj('modalInstance', ['dismiss', 'close']);

    createCtrl = function (application) {
      $controller('deleteApplicationCtrl', {
        '$scope': scope,
        'applicationAPI': applicationAPI,
        '$modalInstance': modalInstance,
        'application': application
      });
    };
  }));

  it('should delete the application', function () {
    createCtrl({id: '1'});
    scope.confirmDelete();
    deleteRequest.resolve({});
    scope.$apply();

    expect(applicationAPI.delete).toHaveBeenCalledWith({id: '1'});
  });

  it('should close modal on delete success', function () {
    createCtrl({id: '1'});
    scope.confirmDelete({model: 'model'});
    deleteRequest.resolve({});
    scope.$apply();

    expect(modalInstance.close).toHaveBeenCalled();
  });

  it('should dismiss modal instance on cancel', function () {
    createCtrl();

    scope.cancel();

    expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
  });
});
