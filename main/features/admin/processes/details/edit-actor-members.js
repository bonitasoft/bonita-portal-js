(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.editActorMembers', [
    'ui.bootstrap',
    'ui.router',
    'angular-growl',
    'org.bonitasoft.bonitable',
    'org.bonitasoft.bonitable.selectable',
    'org.bonitasoft.bonitable.repeatable',
    'org.bonitasoft.bonitable.sortable',
    'org.bonitasoft.bonitable.settings',
    'org.bonitasoft.common.resources.store',
    'xeditable'
  ])
    .controller('editActorMembersCtrl', function($scope, store, actorMemberAPI, userAPI, groupAPI, roleAPI, actor, memberType, process, growl) {
      var self = this;
      $scope.memberType = memberType;
      $scope.members = {};
      $scope.arrayNewMembers = [];
      var mappedIds = [];
      var userIdAttribute = 'user_id';
      var groupIdAttribute = 'group_id';
      var roleIdAttribute = 'role_id';
      self.initObj = {};
      self.constant = {
        USER: 'USER',
        GROUP: 'GROUP',
        ROLE: 'ROLE',
        MEMBERSHIP: 'MEMBERSHIP'
      };
      $scope.localLang = {
        selectAll: 'Select all',
        selectNone: 'Select none',
        reset: 'Reset',
        search: 'Type here to search...'
      };
      self.initView = function initView() {
        switch (memberType) {
          case self.constant.USER:
            self.initObj = {
              d: [userIdAttribute],
              o: 'firstname asc',
              realId: userIdAttribute,
              saveMethod: self.saveUserMembers,
              searchMethod: self.searchUsers,
              searchAPI: userAPI
            };
            $scope.currentMemberLabel = 'Users';
            break;
          case self.constant.GROUP:
            self.initObj = {
              d: [groupIdAttribute],
              o: 'displayName asc',
              realId: groupIdAttribute,
              saveMethod: self.saveGroupMembers,
              searchMethod: self.searchMembers,
              searchAPI: groupAPI
            };
            $scope.currentMemberLabel = 'Groups';
            break;
          case self.constant.ROLE:
            self.initObj = {
              d: [roleIdAttribute],
              o: 'displayName asc',
              realId: roleIdAttribute,
              saveMethod: self.saveRoleMembers,
              searchMethod: self.searchMembers,
              searchAPI: roleAPI
            };
            $scope.currentMemberLabel = 'Roles';
            break;
          case self.constant.MEMBERSHIP:
            self.initObj = {
              d: [roleIdAttribute, groupIdAttribute],
              o: 'displayName asc'
            };
            $scope.currentMemberLabel = 'Memberships';
            break;
        }
        $scope.localLang.nothingSelected = $scope.currentMemberLabel + ' selection';
        self.initObj.f = ['actor_id=' + actor.id, 'member_type=' + memberType];
        self.loadMembers();
      };

      self.loadMembers = function loadMembers() {
        mappedIds = [];
        store.load(actorMemberAPI, {
          f: self.initObj.f,
          d: self.initObj.d
        }).then(function success(members) {
          $scope.members = members;

          if (memberType !== 'MEMBERSHIP') {
            for (var i = 0; i < members.length; i++) {
              mappedIds.push(members[i][self.initObj.realId].id);
            }
            self.initObj.searchMethod();
          }
        }, function error() {});
      };

      self.deleteMember = function deleteMember(memberId, notify) {
        actorMemberAPI.delete({
          id: memberId
        }).$promise.then(
          function success() {
            if (notify !== false) {
              growl.success('Actor member deleted', {
                ttl: 3000,
                disableCountDown: true,
                disableIcons: true
              });
            }
            self.loadMembers();
          },
          function error() {}
        );
      };

      self.searchUsers = function searchUsers(searchOptions) {
        if (!searchOptions) {
          searchOptions = {
            p: 0,
            c: 200
          };
        }
        searchOptions.o = self.initObj.o;
        var finalArray = [];
        userAPI.search(searchOptions).$promise.then(function success(response) {
          for (var i in response.data) {
            var index = mappedIds.indexOf(response.data[i].id);
            if (index === -1) {
              response.data[i].displayedLabel = response.data[i].firstname + response.data[i].lastname + '<small>(<i>' + response.data[i].userName + '</i>)</small>';
              finalArray.push(response.data[i]);
            }
          }
          $scope.first200members = finalArray;
        });
      };

      self.searchMembers = function searchMembers(searchOptions) {
        if (!searchOptions) {
          searchOptions = {
            p: 0,
            c: 200
          };
        }
        searchOptions.o = self.initObj.o;
        var finalArray = [];
        self.initObj.searchAPI.search(searchOptions).$promise.then(function success(response) {
          for (var i in response.data) {
            var index = mappedIds.indexOf(response.data[i].id);
            if (index === -1) {
              console.log(response.data[i]);
              response.data[i].displayedLabel = response.data[i].displayName;
              finalArray.push(response.data[i]);
            }
          }
          $scope.first200members = finalArray;
        });
      };



      self.multiselectOnSearch = function multiselectOnSearch(search) {
        if (search.keyword !== '') {
          var searchOptions = {
            p: 0,
            c: 200
          };
          searchOptions.s = search.keyword;
          self.searchUsers(searchOptions);
        }
      };

      self.saveSelectedMembers = function saveSelectedMembers() {
        $scope.saveCallFinished = 0;
        for (var i in $scope.arrayNewMembers) {
          var member = $scope.arrayNewMembers[i];
          var saveObj = {
            'actor_id': actor.id
          };
          saveObj[self.initObj.realId] = member.id;
          self.actorMemberAPISave(saveObj);
        }
      };


      self.actorMemberAPISave = function actorMemberAPISave(toSaveObj) {
        actorMemberAPI.save(toSaveObj).$promise.finally(function needToInit() {
          $scope.saveCallFinished++;
          if ($scope.saveCallFinished === $scope.arrayNewMembers.length) {
            self.loadMembers();
          }
        });
      };

      self.removeAll = function removeAll() {
        for (var i in $scope.members) {
          self.deleteMember($scope.members[i].id, false);
        }
      };

    });
})();