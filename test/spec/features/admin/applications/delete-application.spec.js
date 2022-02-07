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

describe('Controller: deleteApplicationCtrl', function () {
  'use strict';

  var scope,
    applicationAPI,
    createCtrl,
    modalInstance,
    deleteRequest;

  beforeEach(module('org.bonitasoft.features.admin.applications.delete'));

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

  it('should add an error on delete failure with error 403 response', function () {
    createCtrl({id: '1'});
    scope.confirmDelete({model: {token: ''}});
    deleteRequest.reject({ status: 403 });
    scope.$apply();

    expect(applicationAPI.delete).toHaveBeenCalledWith({id: '1'});
    expect(scope.errorMessage).toBe('Access denied. For more information, check the log file.');
  });

  it('should add an error on delete failure with error 404 response', function () {
    createCtrl({id: '1'});
    scope.confirmDelete({model: {token: ''}});
    deleteRequest.reject({ status: 404 });
    scope.$apply();

    expect(applicationAPI.delete).toHaveBeenCalledWith({id: '1'});
    expect(scope.errorMessage).toBe('The application does not exist. Reload the page to see the new list of applications.');
  });

  it('should add an error on delete failure with error 500 response', function () {
    createCtrl({id: '1'});
    scope.confirmDelete({model: {token: ''}});
    deleteRequest.reject({ status: 500 });
    scope.$apply();

    expect(applicationAPI.delete).toHaveBeenCalledWith({id: '1'});
    expect(scope.errorMessage).toBe('An error has occurred. For more information, check the log file.');
  });

  it('should add an error on delete failure with error XXX response', function () {
    createCtrl({id: '1'});
    scope.confirmDelete({model: {token: ''}});
    deleteRequest.reject({ status: 501 });
    scope.$apply();

    expect(applicationAPI.delete).toHaveBeenCalledWith({id: '1'});
    expect(scope.errorMessage).toBe('Something went wrong during the deletion. You might want to cancel and try again.');
  });

});
