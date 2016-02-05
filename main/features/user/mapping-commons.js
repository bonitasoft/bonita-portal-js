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
  /**
   * org.bonitasoft.features.user.mappings Module
   *
   * defines properties shared between mapping features (actors and process manager currently)
   */
  angular.module('org.bonitasoft.features.user.mappings', ['org.bonitasoft.services.i18n',
    'org.bonitasoft.common.resources.store'])
    .value('MAPPING_PROFILES', {
      USER: 'USER',
      GROUP: 'GROUP',
      ROLE: 'ROLE',
      MEMBERSHIP: 'MEMBERSHIP'
    })
    .value('MANAGER_FILTER', {
      USER: ['user_id=>0', 'group_id=-1', 'role_id=-1'],
      GROUP: ['user_id=-1', 'group_id=>0', 'role_id=-1'],
      ROLE: ['user_id=-1', 'group_id=-1', 'role_id=>0'],
      MEMBERSHIP: ['user_id=-1', 'group_id=>0', 'role_id=>0']
    })
    .value('ACTOR_PROFILES', {
      users: {
        deploy: {
          filter: 'member_type=USER',
          deploy: ['user_id']
        },
        type: 'users',
        name: 'USER'
      },
      groups: {
        deploy: {
          filter: 'member_type=GROUP',
          deploy: ['group_id']
        },
        type: 'groups',
        name: 'GROUP'
      },
      roles: {
        deploy: {
          filter: 'member_type=ROLE',
          deploy: ['role_id']
        },
        type: 'roles',
        name: 'ROLE'
      },
      memberships: {
        deploy: {
          filter: 'member_type=MEMBERSHIP',
          deploy: ['role_id', 'group_id']
        },
        type: 'memberships',
        name: 'MEMBERSHIP'
      }
    })
    .value('userIdAttribute', 'user_id')
    .value('groupIdAttribute', 'group_id')
    .value('roleIdAttribute', 'role_id').service('MappingService', function(i18nService, userIdAttribute, groupIdAttribute, roleIdAttribute, userAPI, groupAPI, roleAPI, MAPPING_PROFILES, store) {
      var mappingService = {};
      /* jshint camelcase: false */
      mappingService.labelFormatter = {
        USER: function(currentMember) {
          var member = currentMember[userIdAttribute] || currentMember;
          return member.firstname + ' ' + member.lastname;
        },
        GROUP: function(currentMember) {
          var member = currentMember[groupIdAttribute] || currentMember;
          return member.displayName;
        },
        ROLE: function(currentMember) {
          var member = currentMember[roleIdAttribute] || currentMember;
          return member.displayName;
        },
        MEMBERSHIP: function(currentMember) {
          return i18nService.getKey('processDetails.actors.memberships.item.label', {
            group: currentMember[groupIdAttribute].displayName,
            role: currentMember[roleIdAttribute].displayName
          });
        }
      };
      var searchMemberParamsValues = {
        USER: {
          deploy: [userIdAttribute],
          o: 'firstname asc',
          actorId: userIdAttribute,
          searchAPI: userAPI
        },
        GROUP: {
          deploy: [groupIdAttribute],
          o: 'displayName asc',
          actorId: groupIdAttribute,
          searchAPI: groupAPI
        },
        ROLE: {
          deploy: [roleIdAttribute],
          o: 'displayName asc',
          actorId: roleIdAttribute,
          searchAPI: roleAPI
        },
        MEMBERSHIP: {
          deploy: [roleIdAttribute, groupIdAttribute],
          o: 'displayName asc',
          actorId: roleIdAttribute,
          actorId2: groupIdAttribute
        }
      };
      mappingService.getSearchMemberParams = function(type) {
        return angular.copy(searchMemberParamsValues[type]);
      };

      mappingService.loadMembers = function(type, searchMemberParams, mappedIds, api) {
        /*jshint camelcase: false */
        return store.load(api, {
          f: searchMemberParams.filters,
          d: searchMemberParams.deploy
        }).then(function success(members) {
          members.forEach(function(currentMember) {
            currentMember.label = mappingService.labelFormatter[type](currentMember);
          });
          if (type !== MAPPING_PROFILES.MEMBERSHIP) {
            members.forEach(function(member) {
              mappedIds.push(member[searchMemberParams.actorId].id);
            });
          }
          return members;
        }, angular.noop);
      };

      mappingService.searchMembers = function searchMembers(type, searchOptions, searchMemberParams) {
        searchOptions = searchOptions || {
          p: 0,
          c: 200
        };
        searchOptions.o = searchMemberParams.o;

        return mappingService.getSearchMemberParams(type).searchAPI.search(searchOptions).$promise.then(function success(response) {
          return response.data;
        });
      };
      return mappingService;
    });
})();
