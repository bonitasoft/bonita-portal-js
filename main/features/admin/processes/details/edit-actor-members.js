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
    .controller('EditActorMembersCtrl', function($modalInstance, store, actorMemberAPI, userAPI, groupAPI, roleAPI, actor, memberType, process, i18nService, $q) {
      var vm = this;
      vm.memberType = memberType;
      vm.members = {};
      vm.arrayNewMembers = [];
      vm.newMembershipRole = {};
      vm.newMembershipGroup = {};
      vm.actor = actor;
      vm.membersToDelete = [];

      var mappedIds = [];
      var userIdAttribute = 'user_id';
      var groupIdAttribute = 'group_id';
      var roleIdAttribute = 'role_id';
      vm.searchMemberParams = {};

      vm.constant = {
        USER: 'USER',
        GROUP: 'GROUP',
        ROLE: 'ROLE',
        MEMBERSHIP: 'MEMBERSHIP'
      };

      vm.localLang = {
        selectAll: i18nService.getKey('multiSelect.selectAll'),
        selectNone: i18nService.getKey('multiSelect.selectNone'),
        reset: i18nService.getKey('multiSelect.reset'),
        search: i18nService.getKey('multiSelect.search.helper')
      };
      vm.localLangRole = angular.copy(vm.localLang);
      vm.localLangGroup = angular.copy(vm.localLang);

      vm.isMembershipEdit = function() {
        return vm.memberType === vm.constant.MEMBERSHIP;
      };
      vm.initView = function initView() {
        switch (memberType) {
          case vm.constant.USER:
            vm.searchMemberParams = {
              deploy: [userIdAttribute],
              o: 'firstname asc',
              actorId: userIdAttribute,
              saveMethod: vm.saveUserMembers,
              searchMethod: vm.searchMembers,
              searchAPI: userAPI
            };
            vm.currentMemberLabel = i18nService.getKey('processDetails.actors.users.label');
            vm.title = i18nService.getKey('processDetails.actors.users.mapping');
            vm.localLang.nothingSelected = i18nService.getKey('processDetails.actors.users.selectHelper');
            break;

          case vm.constant.GROUP:
            vm.searchMemberParams = {
              deploy: [groupIdAttribute],
              o: 'displayName asc',
              actorId: groupIdAttribute,
              saveMethod: vm.saveGroupMembers,
              searchMethod: vm.searchMembers,
              searchAPI: groupAPI
            };
            vm.title = i18nService.getKey('processDetails.actors.groups.label');
            vm.currentMemberLabel = i18nService.getKey('processDetails.actors.groups.mapping');
            vm.localLang.nothingSelected = i18nService.getKey('processDetails.actors.groups.selectHelper');
            break;

          case vm.constant.ROLE:
            vm.searchMemberParams = {
              deploy: [roleIdAttribute],
              o: 'displayName asc',
              actorId: roleIdAttribute,
              saveMethod: vm.saveRoleMembers,
              searchMethod: vm.searchMembers,
              searchAPI: roleAPI
            };
            vm.title = i18nService.getKey('processDetails.actors.roles.label');
            vm.currentMemberLabel = i18nService.getKey('processDetails.actors.roles.mapping');
            vm.localLang.nothingSelected = i18nService.getKey('processDetails.actors.roles.selectHelp');
            break;

          case vm.constant.MEMBERSHIP:
            vm.searchMemberParams = {
              deploy: [roleIdAttribute, groupIdAttribute],
              o: 'displayName asc',
              actorId: roleIdAttribute,
              actorId2: groupIdAttribute
            };
            vm.title = i18nService.getKey('processDetails.actors.memberships.mapping');
            vm.localLangGroup.nothingSelected = i18nService.getKey('processDetails.actors.memberships.selectGroupHelper');
            vm.localLangRole.nothingSelected = i18nService.getKey('processDetails.actors.memberships.selectRoleHelper');
            vm.currentMemberLabel = i18nService.getKey('processDetails.actors.memberships.label');
            break;
        }
        vm.searchMemberParams.filters = ['actor_id=' + actor.id, 'member_type=' + memberType];
        vm.loadMembers();
      };

      vm.loadMembers = function loadMembers() {
        /*jshint camelcase: false */
        mappedIds = [];
        store.load(actorMemberAPI, {
          f: vm.searchMemberParams.filters,
          d: vm.searchMemberParams.deploy
        }).then(function success(members) {
          members.forEach(function(currentMember, index) {
            if (memberType === vm.constant.USER) {
              members[index].label = currentMember.user_id.firstname + ' ' + currentMember.user_id.lastname;
            } else {
              members[index].label = currentMember[vm.searchMemberParams.actorId].displayName;
              if (vm.searchMemberParams.actorId2) {
                members[index].label += i18nService.getKey(' of ') + currentMember[vm.searchMemberParams.actorId2].displayName;
              }
            }
          });
          vm.members = members;
          if (memberType !== vm.constant.MEMBERSHIP) {
            members.forEach(function(member) {
              mappedIds.push(member[vm.searchMemberParams.actorId].id);
            });
            vm.searchMemberParams.searchMethod({});
          } else {
            vm.selectOnSearchGroup('');
            vm.selectOnSearchRole('');
          }
        }, function error() {

        });
      };

      vm.searchMembers = function searchMembers(searchOptions) {
        if (angular.isUndefined(searchOptions) || (searchOptions.s && vm.previousSearchTerm === searchOptions.s)) {
          return;
        } else {
          vm.previousSearchTerm = searchOptions.s;
        }
        if (!searchOptions) {
          searchOptions = {
            p: 0,
            c: 200
          };
        }
        searchOptions.o = vm.searchMemberParams.o;
        var finalArray = [];
        vm.searchMemberParams.searchAPI.search(searchOptions).$promise.then(function success(response) {
          response.data.forEach(function(currentMember) {
            var index = mappedIds.indexOf(currentMember.id);
            if (index === -1) {
              if (vm.memberType === vm.constant.USER) {
                currentMember.listLabel = currentMember.firstname + ' ' + currentMember.lastname + '<small> (<i>' + currentMember.userName + '</i>)</small>';
                currentMember.buttonLabel = currentMember.firstname + ' ' + currentMember.lastname;
              } else {
                currentMember.listLabel = currentMember.displayName;
                currentMember.buttonLabel = currentMember.displayName;
              }
              finalArray.push(currentMember);
            }
          });
          vm.first200members = finalArray;
        });
      };

      vm.searchMembership = function searchMembership(searchOptions, resourceAPI) {
        if (angular.isUndefined(searchOptions) || (searchOptions.s && vm.previousSearchTerm === searchOptions.s)) {
          return;
        } else {
          vm.previousSearchTerm = searchOptions.s;
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


      vm.multiselectOnSearch = function multiselectOnSearch(search) {
        if (search.keyword !== '') {
          searchOptions.s = search.keyword;
          vm.searchMembers(searchOptions);
        }
      };

      vm.selectOnSearchGroup = function selectOnSearchGroup(search) {
        if (angular.isDefined(search) || search.keyword !== '') {
          searchOptions.s = search.keyword;
          vm.searchMembership(searchOptions, groupAPI).then(function mapGroup(response) {
            vm.first200groups = response.data;
          });
        }
      };
      vm.selectOnSearchRole = function selectOnSearchRole(search) {
        if (angular.isDefined(search) || search.keyword !== '') {
          searchOptions.s = search.keyword;
          vm.searchMembership(searchOptions, roleAPI).then(function mapRole(response) {
            vm.first200roles = response.data;
          });
        }
      };

      vm.reenableMember = function reenableMember(member) {
        vm.membersToDelete.splice(vm.membersToDelete.indexOf(member), 1);
        vm.members.push(member);
      };
      vm.removeMember = function removeMember(member) {
        vm.members.splice(vm.members.indexOf(member), 1);
        vm.membersToDelete.push(member);
      };

      vm.removeAll = function removeAll() {
        vm.members.forEach(function(member) {
          vm.membersToDelete.push(member);
        });
        vm.members.length = 0;
      };

      vm.reenableAll = function reenableAll() {
        vm.membersToDelete.forEach(function(member) {
          vm.members.push(member);
        });
        vm.membersToDelete.length = 0;
      };

      vm.apply = function() {
        var promises = [];
        promises = promises.concat(saveSelectedMembers());
        promises = promises.concat(saveSelectedMembership());
        promises = promises.concat(deleteMembers(vm.membersToDelete));
        $q.all(promises).then($modalInstance.close, vm.cancel);
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
        vm.arrayNewMembers.forEach(function(newMember) {
          var actorMapping = {
            'actor_id': actor.id
          };
          actorMapping[vm.searchMemberParams.actorId] = newMember.id;
          promises.push(vm.actorMemberAPISave(actorMapping).$promise);
        });
        return promises;
      }

      function saveSelectedMembership() {
        vm.saveCallFinished = 0;
        if (vm.newMembershipRole.length === 1 && vm.newMembershipGroup.length === 1) {
          return actorMemberAPI.save({
            'role_id': vm.newMembershipRole[0].id,
            'group_id': vm.newMembershipGroup[0].id,
            'actor_id': actor.id
          }).$promise;
        }
      }


      vm.actorMemberAPISave = function actorMemberAPISave(actorMapping) {
        return actorMemberAPI.save(actorMapping);
      };

      vm.cancel = function() {
        $modalInstance.dismiss();
      };

    });
})();
