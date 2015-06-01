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
    .value('roleIdAttribute', 'role_id').service('MappingService', function(i18nService, groupIdAttribute, roleIdAttribute) {
      var mappingService = {};
      /* jshint camelcase: false */
      mappingService.labelFormatter = {
        USER: function(currentMember) {
          return currentMember.user_id.firstname + ' ' + currentMember.user_id.lastname;
        },
        GROUP: function(currentMember) {
          return currentMember[groupIdAttribute].displayName;
        },
        ROLE: function(currentMember) {
          return currentMember[roleIdAttribute].displayName;
        },
        MEMBERSHIP: function(currentMember) {
          return i18nService.getKey('processDetails.actors.memberships.item.label', {
            group: currentMember[groupIdAttribute].displayName,
            role: currentMember[roleIdAttribute].displayName
          });
        }
      };
      return mappingService;
    });
})();
