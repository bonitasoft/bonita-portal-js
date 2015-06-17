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
});
