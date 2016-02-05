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

(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.editActorMembers', [
    'ui.bootstrap',
    'org.bonitasoft.services.i18n',
    'ui.router',
    'angular-growl',
    'isteven-multi-select',
    'org.bonitasoft.common.resources.store',
    'org.bonitasoft.common.properties',
    'org.bonitasoft.features.admin.mappings',
    'org.bonitasoft.common.actors.selectbox'
  ])
    .controller('EditActorMembersCtrl', function($modalInstance, actorMemberAPI, actor, memberProfile, process, i18nService, $q, defaultLocalLang, MAPPING_PROFILES, MappingService) {
      var vm = this;
      vm.memberType = memberProfile.name;
      vm.members = {};
      vm.newMembers = {
        list: [],
        membership: {
          role: {
            list: []
          },
          group: {
            list: []
          }
        }
      };
      vm.actor = actor;
      vm.membersToDelete = [];

      vm.mappedIds = [];
      vm.searchMemberParams = MappingService.getSearchMemberParams(vm.memberType);

      vm.constant = MAPPING_PROFILES;

      vm.localLang = angular.copy(defaultLocalLang);
      vm.localLang.nothingSelected = i18nService.getKey('processDetails.actors.' + memberProfile.type + '.selectHelper');
      vm.localLangRole = angular.copy(defaultLocalLang);
      vm.localLangRole.nothingSelected = i18nService.getKey('processDetails.actors.memberships.selectRoleHelper');
      vm.localLangGroup = angular.copy(defaultLocalLang);
      vm.localLangGroup.nothingSelected = i18nService.getKey('processDetails.actors.memberships.selectGroupHelper');

      vm.currentMemberLabel = i18nService.getKey('processDetails.actors.' + memberProfile.type + '.label');
      vm.title = i18nService.getKey('processDetails.actors.' + memberProfile.type + '.mapping');

      vm.isMembershipEdit = function() {
        return vm.memberType === MAPPING_PROFILES.MEMBERSHIP;
      };
      vm.hasModificationToApply = function() {
        return (vm.newMembers.list.length || !!vm.membersToDelete.length) || (vm.newMembers.membership.group.list.length && vm.newMembers.membership.role.list.length);
      };
      vm.initView = function initView() {
        vm.searchMemberParams.filters = ['actor_id=' + actor.id, 'member_type=' + vm.memberType];
        MappingService.loadMembers(vm.memberType, vm.searchMemberParams, vm.mappedIds, actorMemberAPI).then(function(results) {
          vm.members = results;
        });
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
        vm.newMembers.list.forEach(function(newMember) {
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
        if (vm.newMembers.membership.group.list.length && vm.newMembers.membership.role.list.length) {
          return actorMemberAPI.save({
            'role_id': vm.newMembers.membership.role.list[0].id,
            'group_id': vm.newMembers.membership.group.list[0].id,
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
