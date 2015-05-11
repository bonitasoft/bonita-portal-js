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
    'xeditable',
    'gettext'
  ])
    .constant('ACTOR_PER_PAGE', 10)
    .constant('MEMBERS_PER_CELL', 5)
    .controller('ActorsMappingCtrl', function($scope, $modal, process, actorMemberAPI, actorAPI, ACTOR_PER_PAGE, MEMBERS_PER_CELL) {
      var self = this;
      var resourceInit = [];
      resourceInit.pagination = {
        currentPage: 1,
        numberPerPage: ACTOR_PER_PAGE
      };

      $scope.membersPerCell = MEMBERS_PER_CELL;
      self.init = function init() {
        self.getProcessActors();
      };

      $scope.actors = {
        resource: resourceInit
      };
      $scope.actorsMembers = [];
      var actorUserFilterDeploy = {
        filter: 'member_type=USER',
        deploy: ['user_id']
      };
      var actorGroupFilterDeploy = {
        filter: 'member_type=GROUP',
        deploy: ['group_id']
      };
      var actorRoleFilterDeploy = {
        filter: 'member_type=ROLE',
        deploy: ['role_id']
      };
      var actorMembershipFilterDeploy = {
        filter: 'member_type=MEMBERSHIP',
        deploy: ['role_id', 'group_id']
      };

      self.getMembersForAnActor = function getMembersForAnActor(actor) {
        self.getActorMembers(actor, actorUserFilterDeploy);
        self.getActorMembers(actor, actorGroupFilterDeploy);
        self.getActorMembers(actor, actorRoleFilterDeploy);
        self.getActorMembers(actor, actorMembershipFilterDeploy);
      };

      self.getActorMembers = function getActorMembers(actor, filterDeploy) {
        var filter = ['process_id=' + process.id, 'actor_id=' + actor.id];
        filter = filter.concat(filterDeploy.filter);
        actorMemberAPI.search({
          'p': 0,
          'c': $scope.membersPerCell,
          'f': filter,
          'd': filterDeploy.deploy
        }).$promise.then(function mapActorMembers(actorMembers) {
          if (!$scope.actorsMembers[actor.id]) {
            $scope.actorsMembers[actor.id] = {};
          }
          switch (filterDeploy) {
            case actorUserFilterDeploy:
              $scope.actorsMembers[actor.id].users = actorMembers;
              break;
            case actorGroupFilterDeploy:
              $scope.actorsMembers[actor.id].groups = actorMembers;
              break;
            case actorRoleFilterDeploy:
              $scope.actorsMembers[actor.id].roles = actorMembers;
              break;
            case actorMembershipFilterDeploy:
              $scope.actorsMembers[actor.id].memberships = actorMembers;
              break;
          }
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
              return memberType;
            },
            actor: function resolveActor() {
              return actor;
            }
          }
        }).result.then(function close() {
          $scope.$emit('process.refresh');
          self.init();
        }, function cancel() {
          $scope.$emit('process.refresh');
          self.init();
        });
      };

      self.getProcessActors = function getProcessActors() {
        actorAPI.search({
          'p': $scope.actors.resource.pagination.currentPage - 1,
          'c': $scope.actors.resource.pagination.numberPerPage,
          'o': 'name ASC',
          'f': 'process_id=' + process.id,
          'n': ['users', 'groups', 'roles', 'memberships']
        }).$promise.then(function mapProcessActors(actorsResponse) {
          $scope.actors = actorsResponse;
        });
      };
    })
    .filter('dateInMillis', function() {
      return function(dateString) {
        return Date.parse(dateString);
      };
    });
})();