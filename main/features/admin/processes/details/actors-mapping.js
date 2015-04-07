(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.details.actorMapping', [
    'ui.bootstrap',
    'ui.router',
    'angular-growl',
    'org.bonitasoft.bonitable',
    'org.bonitasoft.bonitable.selectable',
    'org.bonitasoft.bonitable.repeatable',
    'org.bonitasoft.bonitable.sortable',
    'org.bonitasoft.bonitable.settings',
    'xeditable'
  ])
    .controller('actorsMappingCtrl', function($scope, $modal, process, actorMemberAPI, actorAPI, growl, $state) {
      var self = this;
      var resourceInit = [];
      $scope.membersPerCell = 5;
      self.init = function init() {
        self.getActors();
      };

      resourceInit.pagination = {
        currentPage: 1,
        numberPerPage: 10
      };

      $scope.actors = {
        resource: resourceInit
      };
      $scope.actorsMember = [];
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


      self.getActors = function getProcessActors() {
        actorAPI.search({
          'p': $scope.actors.resource.pagination.currentPage - 1,
          'c': $scope.actors.resource.pagination.numberPerPage,
          'o': 'name ASC',
          'f': 'process_id=' + process.id,
          'n': ['users', 'groups', 'roles', 'memberships']
        }).$promise.then(function mapProcess(actorsResponse) {
          $scope.actors = actorsResponse;
        });
      };


      self.deleteMember = function deleteMember(memberId) {
        actorMemberAPI.delete({
          id: memberId
        }).$promise.then(
          function success() {
            growl.success('Actor member deleted', {
              ttl: 3000,
              disableCountDown: true,
              disableIcons: true
            });
            self.getActors();
          },
          function error() {}
        );
      };

      $scope.editMapping = function editMapping(actor, memberType) {
        $modal.open({
          templateUrl: 'features/admin/processes/details/edit-actor-members.html',
          controller: 'editActorMembersCtrl',
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
        }).result.then(function close(){
          $state.go($state.current, {}, {reload: true});
          self.init();
        },function cancel(){
          $state.go($state.current, {}, {reload: true});
          self.init();
        });
      };




    })
    .filter('dateInMillis', function() {
      return function(dateString) {
        return Date.parse(dateString);
      };
    })
    .config(['growlProvider',
      function(growlProvider) {
        growlProvider.globalPosition('top-center');
      }
    ]);
})();