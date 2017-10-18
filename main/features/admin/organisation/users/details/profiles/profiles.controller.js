(function () {
  'use strict';

  angular
    .module('org.bonitasoft.features.admin.organisation.users')
    .controller('UserProfiles', UserProfiles);

  function UserProfiles(user, profiles, memberships, $modal, membershipAPI, growl, gettextCatalog, $state) {
    var vm = this;
    vm.profiles = profiles;
    vm.memberships = memberships;
    vm.user = user;

    vm.openDeletePopUp = function (membership) {
      var modalInstance = $modal.open({
        templateUrl: 'features/admin/organisation/users/details/profiles/delete-membership-popup.html',
        controller: function () {
          this.membership = membership;
        },
        controllerAs: 'vm'
      });

      modalInstance.result
        .then(function (membership) {
          deleteMembership(membership)
            .then(function () {
              growl.success(gettextCatalog.getString('Membership successfully removed'));
            }, function () {
              growl.error(gettextCatalog.getString(
                'Membership has not been removed. Please retry later or contact an administrator'));
            })
            .then(reloadCurrentState);
        });

      return modalInstance;
    };

    function deleteMembership(membership) {
      /* jshint camelcase: false */
      return membershipAPI.delete({
        userId: user.id,
        groupId: membership.group_id.id,
        roleId: membership.role_id.id
      }).$promise;
    }

    function reloadCurrentState() {
      $state.reload($state.current);
    }

    vm.openAddPopup = function () {
      var modalInstance = $modal.open({
        templateUrl: 'features/admin/organisation/users/details/profiles/add-membership-popup.html',
        controller: function () {
          this.membership = {group: {list: []}, role: {list: []}};
          this.mappedIds = [];
          this.localeLangRole = {nothingSelected: gettextCatalog.getString('Select a role...')};
          this.localeLangGroup = {nothingSelected: gettextCatalog.getString('Select a group...')};

          this.isButtonEnabled = function () {
            return this.membership.group.list.length > 0 && this.membership.role.list.length > 0;
          };

          this.mapMembershipObject = function(m) {
            return {
              role: {
                id: m.role.list[0].id,
                name: m.role.list[0].displayName ||  m.role.list[0].name
              },
              group: {
                id: m.group.list[0].id,
                name: m.group.list[0].displayName ||  m.group.list[0].name
              }
            };
          };
        },
        controllerAs: 'vm',
        size: 'lg',
        backdrop: false
      });

      modalInstance.result
        .then(function (membership) {
          addMembership(membership)
            .then(function () {
              growl.success(gettextCatalog.getString('Membership successfully added'));
            }, function (response) {
              var error = new MembershipErrorResponse(response);
              if (error.isAlreadyExistsException()) {
                growl.warning(gettextCatalog.getString(
                  '{{firstname}} {{lastname}} already has the membership <b>{{role}} of {{group}}</b>', {
                    role: membership.role.name,
                    group: membership.group.name,
                    firstname: vm.user.firstname,
                    lastname: vm.user.lastname,
                  }
                ))
                ;
              } else {
                growl.error(gettextCatalog.getString(
                  'Membership has not been added. Please retry later or contact an administrator'));
              }
            })
            .then(reloadCurrentState);
        });

      return modalInstance;
    };

    function addMembership(membership) {
      return membershipAPI.save({
        'role_id': membership.role.id,
        'group_id': membership.group.id,
        'user_id': vm.user.id
      }).$promise;
    }

    function MembershipErrorResponse(response) {
      this.response = response;

      this.isAlreadyExistsException = function () {
        return this.response.status === 403 && this.response.data.cause.exception.indexOf('AlreadyExistsException') !== -1;
      };
    }
  }
})();
