(() => {
  'use strict';

  /* jshint camelcase: false */
  describe('profiles controller', () => {

    let controller, scope, $modal, membershipAPI, growl, $q, user, $state;

    beforeEach(module('org.bonitasoft.features.admin.organisation.users'));

    beforeEach(inject(function ($controller, $rootScope, _$q_, _$modal_) {
      $q = _$q_;
      $modal = _$modal_;

      membershipAPI = jasmine.createSpyObj('membershipAPI', ['save', 'delete']);
      growl = jasmine.createSpyObj('growl', ['success', 'error', 'warning']);
      $state = jasmine.createSpyObj('$state', ['reload']);

      scope = $rootScope.$new();

      spyOn($modal, 'open').and.returnValue(window.fakeModal);

      user = {};
      controller = $controller('UserProfiles', {
        $scope: scope,
        user: {id: 4},
        profiles: [],
        memberships: [],
        $modal: $modal,
        membershipAPI: membershipAPI,
        growl: growl,
        $state: $state
      });
      scope.$apply();
    }));

    it('should open an add membership popup', () => {

      controller.openAddPopup();

      expect($modal.open).toHaveBeenCalledWith({
        templateUrl: 'features/admin/organisation/users/details/profiles/add-membership-popup.html',
        controller: jasmine.any(Function),
        controllerAs: 'vm',
        size: 'lg',
        backdrop: false
      });
    });

    it('should add a membership when closing the add membership popup', () => {
      let modalInstance = controller.openAddPopup();
      membershipAPI.save.and.callFake(membership => {
        return {$promise: $q.when(membership)};
      });

      modalInstance.close({role: {id: 42}, group: {id: 41}});

      expect(membershipAPI.save).toHaveBeenCalledWith({
        'role_id': 42,
        'group_id': 41,
        'user_id': controller.user.id
      });
    });

    it('should do nothing when dismissing the add membership popup', () => {
      let modalInstance = controller.openAddPopup();

      modalInstance.dismiss();
      scope.$apply();

      expect(membershipAPI.save).not.toHaveBeenCalled();
      expect(growl.success).not.toHaveBeenCalled();
      expect(growl.error).not.toHaveBeenCalled();
      expect(growl.warning).not.toHaveBeenCalled();
    });

    it('should toast a success message and reload current state when membership is successfully added', () => {
      let modalInstance = controller.openAddPopup();
      membershipAPI.save.and.callFake(membership => {
        return {$promise: $q.when(membership)};
      });

      modalInstance.close({role: {id: 42}, group: {id: 41}});
      scope.$apply();

      expect(growl.success).toHaveBeenCalled();
      expect($state.reload).toHaveBeenCalled();
    });

    it('should toast an error message when membership is NOT successfully added', () => {
      let modalInstance = controller.openAddPopup();
      membershipAPI.save.and.returnValue({$promise: $q.reject({status: 500})});

      modalInstance.close({role: {id: 42}, group: {id: 41}});
      scope.$apply();

      expect(growl.error).toHaveBeenCalled();
    });

    it('should toast a warning message when adding an already existing membership', () => {
      let modalInstance = controller.openAddPopup();
      controller.user = {
        id: 4,
        firstname: 'Walter',
        lastname: 'Bates'
      };
      let error = {
        status: 403,
        data: {
          exception: 'class org.bonitasoft.web.toolkit.client.common.exception.api.APIForbiddenException',
          message: 'This membership is already added to user',
          cause: {
            exception: 'class org.bonitasoft.engine.exception.AlreadyExistsException',
            message: 'USERNAME=walter.bates | A userMembership with userId \u00224\u0022, groupId \u00229\u0022 and roleId \u00221\u0022 already exists'
          },
          api: 'identity', 'resource': 'membership'
        }
      };
      membershipAPI.save.and.returnValue({$promise: $q.reject(error)});

      modalInstance.close({role: {name: 'Member'}, group: {name: 'HR'}});
      scope.$apply();

      expect(growl.warning).toHaveBeenCalledWith('Membership [Member of HR] is already added to the user Walter Bates');
    });

    it('should open a delete pop up', () => {

      controller.openDeletePopUp();

      expect($modal.open).toHaveBeenCalledWith({
        templateUrl: 'features/admin/organisation/users/details/profiles/delete-membership-popup.html',
        controller: jasmine.any(Function),
        controllerAs: 'vm'
      });
    });

    it('should delete a membership when closing the delete membership popup', () => {
      let modalInstance = controller.openDeletePopUp();
      membershipAPI.delete.and.callFake(membership => {
        return {$promise: $q.when(membership)};
      });

      modalInstance.close({role_id: {id: 42}, group_id: {id: 41}});

      expect(membershipAPI.delete).toHaveBeenCalledWith({
        userId: controller.user.id,
        groupId: 41,
        roleId: 42
      });
    });

    it('should do nothing when dismissing the delete membership popup', () => {
      let modalInstance = controller.openDeletePopUp();
      membershipAPI.delete.and.returnValue({$promise: $q.when({})});

      modalInstance.dismiss();
      scope.$apply();

      expect(membershipAPI.delete).not.toHaveBeenCalled();
      expect(growl.success).not.toHaveBeenCalled();
      expect(growl.error).not.toHaveBeenCalled();
      expect(growl.warning).not.toHaveBeenCalled();
    });

    it('should toast a success message and reload current state when membership is successfully deleted', () => {
      let modalInstance = controller.openDeletePopUp();
      membershipAPI.delete.and.callFake(membership => {
        return {$promise: $q.when(membership)};
      });

      modalInstance.close({role_id: {id: 42}, group_id: {id: 41}});
      scope.$apply();

      expect(growl.success).toHaveBeenCalled();
      expect($state.reload).toHaveBeenCalled();
    });

    it('should toast an error message when membership is NOT successfully deleted', () => {
      let modalInstance = controller.openDeletePopUp();
      membershipAPI.delete.and.returnValue({$promise: $q.reject({status: 500})});

      modalInstance.close({role_id: {id: 42}, group_id: {id: 41}});
      scope.$apply();

      expect(growl.error).toHaveBeenCalled();
    });

  });

})();
