(function() {
  'use strict';
  /**
   * org.bonitasoft.features.admin.mappings Module
   *
   * defines properties shared between mapping features (actors and process manager currently)
   */
  angular.module('org.bonitasoft.features.admin.mappings', ['org.bonitasoft.services.i18n'])
    .value('MAPPING_PROFILES', {
      USER: 'USER',
      GROUP: 'GROUP',
      ROLE: 'ROLE',
      MEMBERSHIP: 'MEMBERSHIP'
    })
    .value('userIdAttribute', 'user_id')
    .value('groupIdAttribute', 'group_id')
    .value('roleIdAttribute', 'role_id').service('MappingService', function(i18nService, userIdAttribute, groupIdAttribute, roleIdAttribute, userAPI, groupAPI, roleAPI, MAPPING_PROFILES, store, actorMemberAPI) {
      var mappingService = {};
      /* jshint camelcase: false */
      mappingService.labelFormatter = {
        USER: function(currentMember) {
          var member = currentMember.user_id || currentMember;
          return member.firstname + ' ' + member.lastname;
        },
        GROUP: function(currentMember) {
          var member = currentMember.group_id || currentMember;
          return member.displayName;
        },
        ROLE: function(currentMember) {
          var member = currentMember.role_id || currentMember;
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

      mappingService.loadMembers = function(type, searchMemberParams, mappedIds) {
        var membersResult;
        /*jshint camelcase: false */
        return store.load(actorMemberAPI, {
          f: searchMemberParams.filters,
          d: searchMemberParams.deploy
        }).then(function success(members) {
          members.forEach(function(currentMember, index) {
            members[index].label = mappingService.labelFormatter[type](currentMember);
          });
          membersResult = members;
          if (type !== MAPPING_PROFILES.MEMBERSHIP) {
            members.forEach(function(member) {
              mappedIds.push(member[searchMemberParams.actorId].id);
            });
          }
          return membersResult;
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
