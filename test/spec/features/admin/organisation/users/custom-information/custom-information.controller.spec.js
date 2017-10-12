(() => {
  'use strict';

  /* jshint camelcase: false */
  describe('user custom info controller', () => {

    let controller, scope, customUserInfoAPI, growl, $q;

    beforeEach(module('org.bonitasoft.features.admin.organisation.users'));

    beforeEach(inject(function ($controller, $rootScope, _$q_) {
      $q = _$q_;

      customUserInfoAPI = jasmine.createSpyObj('customUserInfoAPI', ['update']);
      growl = jasmine.createSpyObj('growl', ['success', 'error']);

      customUserInfoAPI.update.and.returnValue({$promise: $q.when({})});

      scope = $rootScope.$new();

      controller = $controller('UserCustomInfoCtrl', {
        $scope: scope,
        customInformation: [],
        customUserInfoAPI: customUserInfoAPI,
        growl: growl
      });
      scope.$apply();
    }));

    it('should save user\'s custom information', () => {
      let information = [
        {definitionId: {id: 42}, userId: 5, value: 'newValue'},
        {definitionId: {id: 41}, userId: 5, value: 'otherValue'}
      ];

      controller.saveCustomInfo(information);

      expect(customUserInfoAPI.update).toHaveBeenCalledWith({id: 42, userId: 5}, {value: 'newValue'});
      expect(customUserInfoAPI.update).toHaveBeenCalledWith({id: 41, userId: 5}, {value: 'otherValue'});
    });

    it('should toast a success message when all user\'s custom information are successfully updated', () => {
      let firstUpdate = $q.defer();
      let secondUpdate = $q.defer();
      customUserInfoAPI.update
        .and.returnValue({$promise: firstUpdate.promise})
        .and.returnValue({$promise: secondUpdate.promise});
      let information = [
        {definitionId: {id: 42}, userId: 5, value: 'newValue'},
        {definitionId: {id: 41}, userId: 5, value: 'otherValue'}
      ];

      controller.saveCustomInfo(information);

      // first update is resolved but not the second
      firstUpdate.resolve();
      scope.$apply();
      expect(growl.success).not.toHaveBeenCalled();

      // all update are resolved, success message is displayed
      secondUpdate.resolve();
      scope.$apply();
      expect(growl.success).toHaveBeenCalled();
    });

    it('should toast an error message when any user\'s custom information is not successfully updated', () => {
      let firstUpdate = $q.defer();
      let secondUpdate = $q.defer();
      customUserInfoAPI.update
        .and.returnValue({$promise: firstUpdate.promise})
        .and.returnValue({$promise: secondUpdate.promise});
      let information = [
        {definitionId: {id: 42}, userId: 5, value: 'newValue'},
        {definitionId: {id: 41}, userId: 5, value: 'otherValue'}
      ];

      controller.saveCustomInfo(information);

      firstUpdate.resolve();
      secondUpdate.reject();
      scope.$apply();
      expect(growl.error).toHaveBeenCalled();
    });

    it('should not have custom info when it is undefined', () => {
      controller.customInformation = undefined;

      expect(controller.hasCustomInfo()).toBeFalsy();
    });

    it('should not have custom info when it is empty', () => {
      controller.customInformation = [];

      expect(controller.hasCustomInfo()).toBeFalsy();
    });

    it('should have custom info otherwise', () => {
      controller.customInformation = [1, 2];

      expect(controller.hasCustomInfo()).toBeTruthy();
    });
  });

})();
