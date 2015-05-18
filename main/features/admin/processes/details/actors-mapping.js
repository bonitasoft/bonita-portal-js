(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.details.actorMapping', [
    'ui.bootstrap',
    'ui.router',
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
    .controller('ActorsMappingCtrl', function($scope, $modal, process, actorMemberAPI, actorAPI, ACTOR_PER_PAGE, MEMBERS_PER_CELL, growl, gettextCatalog, $log, $filter, processActors) {
      var self = this;
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

      $scope.membersPerCell = MEMBERS_PER_CELL;
      $scope.actors = processActors;
      $scope.actorsMembers = [];
      var actorProfiles = {
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

      self.getMembersForAnActor = function getMembersForAnActor(actor) {
        angular.forEach(actorProfiles, function(actorProfile){
          getMemberForActorProfile(actor, actorProfile);
        });
      };

      function getMemberForActorProfile(actor, actorProfile) {
        self.getActorMembers(actor, actorProfile.deploy).$promise.then(function mapActorMembers(actorMembers) {
          if (!$scope.actorsMembers[actor.id]) {
            $scope.actorsMembers[actor.id] = {};
          }
          $scope.actorsMembers[actor.id][actorProfile.type] = actorMembers;
        });
      }

      self.getActorMembers = function getActorMembers(actor, filterDeploy) {
        var filter = ['process_id=' + process.id, 'actor_id=' + actor.id];
        filter = filter.concat(filterDeploy.filter);
        return actorMemberAPI.search({
          'p': 0,
          'c': $scope.membersPerCell,
          'f': filter,
          'd': filterDeploy.deploy
        });
      };
      $scope.editMapping = function editMapping(actor, memberType) {
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
              return actorProfiles[memberType].name;
            },
            actor: function resolveActor() {
              return actor;
            }
          }
        }).result.then(function close(results) {
          results = _.compact(results);
          $log.debug('Actor mapping results', results);
          growl.success($filter('stringTemplater')(gettextCatalog.getString('{} actor mapping updates succeeded'), results.length), growlOptions);
        }, function cancel(errors) {
          $log.error('Actor mapping errors', errors);
          growl.error($filter('stringTemplater')(gettextCatalog.getString('{} errors on mapping updates'), errors.length), growlOptions);
        }).finally(function() {
          $scope.$emit('process.refresh');
          getMemberForActorProfile(actor, actorProfiles[memberType]);
        });
      };
    })
    .filter('dateInMillis', function() {
      return function(dateString) {
        return Date.parse(dateString);
      };
    });
})();
