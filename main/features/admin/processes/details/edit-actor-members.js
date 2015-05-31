(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.editActorMembers', [
    'ui.bootstrap',
    'org.bonitasoft.services.i18n',
    'ui.router',
    'angular-growl',
    'isteven-multi-select',
    'org.bonitasoft.bonitable',
    'org.bonitasoft.bonitable.selectable',
    'org.bonitasoft.bonitable.repeatable',
    'org.bonitasoft.bonitable.sortable',
    'org.bonitasoft.bonitable.settings',
    'org.bonitasoft.common.resources.store'
  ])
    .controller('EditActorMembersCtrl', function($scope, $modalInstance, store, actorMemberAPI, userAPI, groupAPI, roleAPI, actor, memberType, process, i18nService, $q) {
      var self = this;
      self.scope = $scope;
      self.scope.memberType = memberType;
      self.scope.members = {};
      self.scope.arrayNewMembers = [];
      self.scope.newMembershipRole = {};
      self.scope.newMembershipGroup = {};
      self.scope.actor = actor;
      self.membersToDelete = [];

      var mappedIds = [];
      var userIdAttribute = 'user_id';
      var groupIdAttribute = 'group_id';
      var roleIdAttribute = 'role_id';
      self.searchMemberParams = {};

      self.constant = {
        USER: 'USER',
        GROUP: 'GROUP',
        ROLE: 'ROLE',
        MEMBERSHIP: 'MEMBERSHIP'
      };

      self.scope.localLang = {
        selectAll: i18nService.getKey('multiSelect.selectAll'),
        selectNone: i18nService.getKey('multiSelect.selectNone'),
        reset: i18nService.getKey('multiSelect.reset'),
        search: i18nService.getKey('multiSelect.search.helper')
      };
      self.scope.localLangRole = angular.copy(self.scope.localLang);
      self.scope.localLangGroup = angular.copy(self.scope.localLang);

      self.isMembershipEdit = function() {
        return self.scope.memberType === self.constant.MEMBERSHIP;
      };
      self.initView = function initView() {
        switch (memberType) {
          case self.constant.USER:
            self.searchMemberParams = {
              deploy: [userIdAttribute],
              o: 'firstname asc',
              actorId: userIdAttribute,
              saveMethod: self.saveUserMembers,
              searchMethod: self.searchMembers,
              searchAPI: userAPI
            };
            self.scope.currentMemberLabel = i18nService.getKey('processDetails.actors.users.label');
            self.title = i18nService.getKey('processDetails.actors.users.mapping');
            self.scope.localLang.nothingSelected = i18nService.getKey('processDetails.actors.users.selectHelper');
            break;

          case self.constant.GROUP:
            self.searchMemberParams = {
              deploy: [groupIdAttribute],
              o: 'displayName asc',
              actorId: groupIdAttribute,
              saveMethod: self.saveGroupMembers,
              searchMethod: self.searchMembers,
              searchAPI: groupAPI
            };
            self.title = i18nService.getKey('processDetails.actors.groups.label');
            self.scope.currentMemberLabel = i18nService.getKey('processDetails.actors.groups.mapping');
            self.scope.localLang.nothingSelected = i18nService.getKey('processDetails.actors.groups.selectHelper');
            break;

          case self.constant.ROLE:
            self.searchMemberParams = {
              deploy: [roleIdAttribute],
              o: 'displayName asc',
              actorId: roleIdAttribute,
              saveMethod: self.saveRoleMembers,
              searchMethod: self.searchMembers,
              searchAPI: roleAPI
            };
            self.title = i18nService.getKey('processDetails.actors.roles.label');
            self.scope.currentMemberLabel = i18nService.getKey('processDetails.actors.roles.mapping');
            self.scope.localLang.nothingSelected = i18nService.getKey('processDetails.actors.roles.selectHelp');
            break;

          case self.constant.MEMBERSHIP:
            self.searchMemberParams = {
              deploy: [roleIdAttribute, groupIdAttribute],
              o: 'displayName asc',
              actorId: roleIdAttribute,
              actorId2: groupIdAttribute
            };
            self.title = i18nService.getKey('processDetails.actors.memberships.mapping');
            self.scope.localLangGroup.nothingSelected = i18nService.getKey('processDetails.actors.memberships.selectGroupHelper');
            self.scope.localLangRole.nothingSelected = i18nService.getKey('processDetails.actors.memberships.selectRoleHelper');
            self.scope.currentMemberLabel = i18nService.getKey('processDetails.actors.memberships.label');
            break;
        }
        self.searchMemberParams.filters = ['actor_id=' + actor.id, 'member_type=' + memberType];
        self.loadMembers();
      };

      self.loadMembers = function loadMembers() {
        /*jshint camelcase: false */
        mappedIds = [];
        store.load(actorMemberAPI, {
          f: self.searchMemberParams.filters,
          d: self.searchMemberParams.deploy
        }).then(function success(members) {
          members.forEach(function(currentMember, index) {
            if (memberType === self.constant.USER) {
              members[index].label = currentMember.user_id.firstname + ' ' + currentMember.user_id.lastname;
            } else {
              members[index].label = currentMember[self.searchMemberParams.actorId].displayName;
              if (self.searchMemberParams.actorId2) {
                members[index].label += i18nService.getKey(' of ') + currentMember[self.searchMemberParams.actorId2].displayName;
              }
            }
          });
          self.scope.members = members;
          if (memberType !== self.constant.MEMBERSHIP) {
            members.forEach(function(member) {
              mappedIds.push(member[self.searchMemberParams.actorId].id);
            });
            self.searchMemberParams.searchMethod({});
          } else {
            self.selectOnSearchGroup('');
            self.selectOnSearchRole('');
          }
        }, function error() {

        });
      };

      self.searchMembers = function searchMembers(searchOptions) {
        if (angular.isUndefined(searchOptions) || (searchOptions.s && self.previousSearchTerm === searchOptions.s)) {
          return;
        } else {
          self.previousSearchTerm = searchOptions.s;
        }
        if (!searchOptions) {
          searchOptions = {
            p: 0,
            c: 200
          };
        }
        searchOptions.o = self.searchMemberParams.o;
        var finalArray = [];
        self.searchMemberParams.searchAPI.search(searchOptions).$promise.then(function success(response) {
          response.data.forEach(function(currentMember) {
            var index = mappedIds.indexOf(currentMember.id);
            if (index === -1) {
              if (self.scope.memberType === self.constant.USER) {
                currentMember.listLabel = currentMember.firstname + ' ' + currentMember.lastname + '<small> (<i>' + currentMember.userName + '</i>)</small>';
                currentMember.buttonLabel = currentMember.firstname + ' ' + currentMember.lastname;
              } else {
                currentMember.listLabel = currentMember.displayName;
                currentMember.buttonLabel = currentMember.displayName;
              }
              finalArray.push(currentMember);
            }
          });
          self.scope.first200members = finalArray;
        });
      };

      self.searchMembership = function searchMembership(searchOptions, resourceAPI) {
        if (angular.isUndefined(searchOptions) || (searchOptions.s && self.previousSearchTerm === searchOptions.s)) {
          return;
        } else {
          self.previousSearchTerm = searchOptions.s;
        }
        if (!searchOptions) {
          searchOptions = {
            p: 0,
            c: 200
          };
        }
        return resourceAPI.search(searchOptions).$promise;
      };

      var searchOptions = {
        p: 0,
        c: 200
      };


      self.multiselectOnSearch = function multiselectOnSearch(search) {
        if (search.keyword !== '') {
          searchOptions.s = search.keyword;
          self.searchMembers(searchOptions);
        }
      };

      self.selectOnSearchGroup = function selectOnSearchGroup(search) {
        if (angular.isDefined(search) || search.keyword !== '') {
          searchOptions.s = search.keyword;
          self.searchMembership(searchOptions, groupAPI).then(function mapGroup(response) {
            self.scope.first200groups = response.data;
          });
        }
      };
      self.selectOnSearchRole = function selectOnSearchRole(search) {
        if (angular.isDefined(search) || search.keyword !== '') {
          searchOptions.s = search.keyword;
          self.searchMembership(searchOptions, roleAPI).then(function mapRole(response) {
            self.scope.first200roles = response.data;
          });
        }
      };

      self.reenableMember = function reenableMember(member) {
        self.membersToDelete.splice(self.membersToDelete.indexOf(member), 1);
        self.scope.members.push(member);
      };
      self.removeMember = function removeMember(member) {
        self.scope.members.splice(self.scope.members.indexOf(member), 1);
        self.membersToDelete.push(member);
      };

      self.removeAll = function removeAll() {
        self.scope.members.forEach(function(member) {
          self.membersToDelete.push(member);
        });
        self.scope.members.length = 0;
      };

      self.reenableAll = function reenableAll() {
        self.membersToDelete.forEach(function(member) {
          self.scope.members.push(member);
        });
        self.membersToDelete.length = 0;
      };

      self.apply = function() {
        var promises = [];
        promises = promises.concat(saveSelectedMembers());
        promises = promises.concat(saveSelectedMembership());
        promises = promises.concat(deleteMembers(self.membersToDelete));
        $q.all(promises).then($modalInstance.close, self.cancel);
      };

      function deleteMembers(membersToDelete) {
        var promises = [];
        membersToDelete.forEach(function(member) {
          promises.push(actorMemberAPI.delete({
            id: member.id
          }).$promise);
        });
        return promises;
      }

      function saveSelectedMembers() {
        var promises = [];
        self.scope.arrayNewMembers.forEach(function(newMember) {
          var actorMapping = {
            'actor_id': actor.id
          };
          actorMapping[self.searchMemberParams.actorId] = newMember.id;
          promises.push(self.actorMemberAPISave(actorMapping).$promise);
        });
        return promises;
      }

      function saveSelectedMembership() {
        self.saveCallFinished = 0;
        if (self.scope.newMembershipRole.length === 1 && self.scope.newMembershipGroup.length === 1) {
          return actorMemberAPI.save({
            'role_id': self.scope.newMembershipRole[0].id,
            'group_id': self.scope.newMembershipGroup[0].id,
            'actor_id': actor.id
          }).$promise;
        }
      }


      self.actorMemberAPISave = function actorMemberAPISave(actorMapping) {
        return actorMemberAPI.save(actorMapping);
      };

      self.cancel = function() {
        $modalInstance.dismiss();
      };

    });
})();
