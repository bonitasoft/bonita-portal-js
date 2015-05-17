(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.details.actorMapping', [
    'ui.bootstrap',
    'ui.router',
    'org.bonitasoft.common.resources',
    'org.bonitasoft.bonitable',
    'org.bonitasoft.bonitable.selectable',
    'org.bonitasoft.bonitable.repeatable',
    'org.bonitasoft.bonitable.sortable',
    'org.bonitasoft.bonitable.settings',
    'org.bonitasoft.common.filters.stringTemplater',
    'xeditable',
    'gettext'
  ])
    .constant('ACTOR_PER_PAGE', 10)
    .constant('MEMBERS_PER_CELL', 5)
    .service('ActorMappingService', function(actorMemberAPI, MEMBERS_PER_CELL){
      var actorMappingService = {};

      actorMappingService.getMembersForAnActor = function(actor, actorProfiles, process) {
        angular.forEach(actorProfiles, function(actorProfile){
          actorMappingService.getMemberForActorProfile(actor, actorProfile, process);
        });
      };

      actorMappingService.getMemberForActorProfile = function(actor, actorProfile, process) {
        actorMappingService.getActorMembers(actor, actorProfile.deploy, process).$promise.then(function mapActorMembers(actors) {
          if (!actorMappingService.actorsMembers[actor.id]) {
            actorMappingService.actorsMembers[actor.id] = {};
          }
          actorMappingService.actorsMembers[actor.id][actorProfile.type] = actors;
        });
      };

      actorMappingService.getActorMembers = function(actor, filterDeploy, process) {
        var filter = ['process_id=' + process.id, 'actor_id=' + actor.id];
        filter = filter.concat(filterDeploy.filter);
        return actorMemberAPI.search({
          'p': 0,
          'c': MEMBERS_PER_CELL,
          'f': filter,
          'd': filterDeploy.deploy
        });
      };
      return actorMappingService;
    })
    .controller('ActorsMappingCtrl', function($scope, $modal, process, actorMemberAPI, actorAPI, ACTOR_PER_PAGE, MEMBERS_PER_CELL, growl, gettextCatalog, $log, $filter, processActors, ActorMappingService) {
      var vm = this;
      var resourceInit = [];
      resourceInit.pagination = {
        currentPage: 1,
        numberPerPage: ACTOR_PER_PAGE
      };
      var growlOptions = {
        ttl: 3000,
        disableCountDown: true,
        disableIcons: true
      };

      vm.actors = processActors;
      vm.actorsMembers = [];
      vm.actorProfiles = {
        users: {
          deploy: {
            filter: 'member_type=USER',
            deploy: ['user_id']
          },
          type: 'users',
          name: 'USER'
        },
        groups:{
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
      };
      vm.actors.forEach(function(actor){
        ActorMappingService.getMembersForAnActor(actor, vm.actorProfiles, process);
      });
      vm.editMapping = function(actor, memberType) {
        $modal.open({
          templateUrl: 'features/admin/processes/details/edit-actor-members.html',
          controller: 'EditActorMembersCtrl',
          controllerAs: 'editActorMembersCtrl',
          size: 'lg',
          resolve: {
            process: function resolveProcess() {
              return process;
            },
            memberType: function resolveMemberType() {
              return vm.actorProfiles[memberType].name;
            },
            actor: function resolveActor() {
              return actor;
            }
          }
        }).result.then(function close(results) {
          results = _.compact(results);
          growl.success($filter('stringTemplater')(gettextCatalog.getString('{} actor mapping updates succeeded'), results.length), growlOptions);
          $scope.$emit('process.refresh');
          ActorMappingService.getMemberForActorProfile(actor, vm.actorProfiles[memberType]);
        }, function cancel(errors) {
          $log.error('Actor mapping errors', errors);
          growl.error($filter('stringTemplater')(gettextCatalog.getString('{} errors on mapping updates'), errors.length), growlOptions);
          $scope.$emit('process.refresh');
          ActorMappingService.getMemberForActorProfile(actor, vm.actorProfiles[memberType]);
        });
      };
    })
    .filter('dateInMillis', function() {
      return function(dateString) {
        return Date.parse(dateString);
      };
    });
})();
