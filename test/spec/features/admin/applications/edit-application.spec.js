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

describe('Controller: addApplicationCtrl', function () {
  'use strict';

  var scope,
    applicationAPI,
    createCtrl,
    spyOnLoad,
    modalInstance,
    loadProfilesRequest;

  beforeEach(module('org.bonitasoft.features.admin.applications.edit'));

  beforeEach(inject(function ($controller, $rootScope, _applicationAPI_, store, $q) {
    loadProfilesRequest = $q.defer();

    scope = $rootScope.$new();
    applicationAPI = _applicationAPI_;
    modalInstance = jasmine.createSpyObj('modalInstance', ['dismiss', 'close']);


    spyOnLoad = function (promise) {
      spyOn(store, 'load').and.returnValue(promise);
    };
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
    spyOnLoad(loadProfilesRequest.promise);
    createCtrl();

    loadProfilesRequest.resolve(['foo', 'bar']);
    scope.$apply();

    expect(scope.profiles).toEqual(['foo', 'bar']);
  });

  describe('in creation mode', function () {

    var saveRequest;

    beforeEach(inject(function ($controller, $rootScope, _applicationAPI_, store, $q) {
      saveRequest = $q.defer();
      loadProfilesRequest = $q.defer();
      spyOnLoad(loadProfilesRequest.promise);
      spyOn(applicationAPI, 'save').and.returnValue({ $promise: saveRequest.promise });
      createCtrl();
    }));

    it('should save application', function () {
      scope.application = {form: {token: ''}};
      scope.submit({model: {token: ''}});

      expect(applicationAPI.save).toHaveBeenCalledWith({token: ''});
    });

    it('should close modal on save success', function () {
      scope.application = {form: {token: ''}};
      scope.submit({model: {token: ''}});
      saveRequest.resolve({});
      scope.$apply();

      expect(modalInstance.close).toHaveBeenCalled();
    });

    it('should add an error on save failure with error 404 response', function () {
      scope.application = {form: {token: ''}};
      scope.submit({model: {token: ''}});
      saveRequest.reject({ status: 404 });
      scope.$apply();

      expect(scope.alerts.length).toBe(1);
    });

    it('should add an error on save failure with error different than 404 or 500 response', function () {
      scope.application = {form: {token: ''}};
      scope.submit({model: {token: ''}});
      scope.application = {form: { name: {}}, model: {}};
      saveRequest.reject({ data: {cause: {exception: 'AlreadyExistsException'}} });

      scope.$apply();

      expect(scope.alerts.length).toBe(1);
    });

    it('should turn duplicate to true on save failure with 500 response', function () {
      scope.application = {form: {token: ''}};
      scope.submit({ model: {token: ''}});
      scope.application = {form: { token: {}}, model: {}};
      saveRequest.reject({ status: 500, data: {cause: {exception: 'AlreadyExistsException'}} });

      scope.$apply();

      expect(scope.application.form.token.$duplicate).toBe(true);
    });

    it('should turn reservedToken to true on save with "API" token', function () {
      scope.application = {form: { token: {}}};
      scope.submit({ model: {token: 'API'} });
      scope.$apply();
      expect(scope.application.form.token.$reservedToken).toBe(true);
    });

    it('should turn reservedToken to true on save with "content" token', function () {
      scope.application = {form: { token: {}}};
      scope.submit({ model: {token: 'content'} });
      scope.$apply();
      expect(scope.application.form.token.$reservedToken).toBe(true);
    });

    it('should turn reservedToken to true on save with "theme" token', function () {
      scope.application = {form: { token: {}}};
      scope.submit({ model: {token: 'theme'} });
      scope.$apply();
      expect(scope.application.form.token.$reservedToken).toBe(true);
    });

  });

  describe('in edit mode', function () {

    var updateRequest, application = { model: {token: ''}};

    beforeEach(inject(function ($controller, $rootScope, _applicationAPI_, store, $q) {
      updateRequest = $q.defer();
      spyOn(applicationAPI, 'update').and.returnValue({$promise: updateRequest.promise});
      createCtrl(application);
    }));

    it('should call Update application API when edition mode is true', function () {
      scope.application = {form: {token: ''}};
      scope.submit(application);

      expect(applicationAPI.update).toHaveBeenCalledWith({token: ''});
    });
  });
});
