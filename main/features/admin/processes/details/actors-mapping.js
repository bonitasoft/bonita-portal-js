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

  angular.module('org.bonitasoft.features.admin.processes.details.actorMapping', [
    'ui.bootstrap',
    'org.bonitasoft.common.resources',
    'org.bonitasoft.common.filters.stringTemplater',
    'org.bonitasoft.services.i18n',
    'org.bonitasoft.common.properties',
    'org.bonitasoft.features.admin.mappings'
  ])
    .constant('ACTOR_PER_PAGE', 10)
    .constant('MEMBERS_PER_CELL', 5)
    .service('ActorMappingService', function(actorMemberAPI, MEMBERS_PER_CELL, $q) {
      var actorMappingService = {};

      actorMappingService.getMembersForAnActor = function(actor, actorProfiles, process) {
        var promises = [],
          actorMembers = {};
        angular.forEach(actorProfiles, function(actorProfile) {
          promises.push(actorMappingService.getActorMembers(actor, actorProfile.deploy, process).then(function mapActorMembers(actors) {
            actorMembers[actorProfile.type] = actors;
          }));
        });
        return $q.all(promises).then(function (){
          return actorMembers;
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
        }).$promise;
      };
      return actorMappingService;
    })
    .controller('ActorsMappingCtrl', function($scope, $modal, process, ACTOR_PER_PAGE, MEMBERS_PER_CELL, growl, i18nService, $log, $filter, processActors, ActorMappingService, growlOptions, defaultLocalLang, ACTOR_PROFILES) {
      var vm = this;
      var resourceInit = [];
      resourceInit.pagination = {
        currentPage: 1,
        numberPerPage: ACTOR_PER_PAGE
      };

      vm.actors = processActors;
      vm.membersPerCell = MEMBERS_PER_CELL;
      vm.actorsMembers = {};
      vm.actorProfiles = ACTOR_PROFILES;
      vm.actors.forEach(function(actor) {
        ActorMappingService.getMembersForAnActor(actor, vm.actorProfiles, process).then(function(actorMembers) {
          vm.actorsMembers[actor.id] = actorMembers;
        });
      });
      vm.editMapping = function(actor, memberType) {
        $modal.open({
          templateUrl: 'features/admin/processes/details/edit-actor-members.html',
          controller: 'EditActorMembersCtrl',
          controllerAs: 'editActorMembersCtrl',
          size: 'lg',
          backdrop: false,
          resolve: {
            process: function resolveProcess() {
              return process;
            },
            memberProfile: function resolveMemberType() {
              return vm.actorProfiles[memberType];
            },
            actor: function resolveActor() {
              return actor;
            },
            defaultLocalLang: function() {
              return defaultLocalLang;
            }
          }
        }).result.then(function close(results) {
          results = _.compact(results);
          growl.success(i18nService.getKey('processDetails.actors.update.success', {nbSucess: results.length}), growlOptions);
        }, function cancel(errors) {
          if(angular.isDefined(errors) && _.isArray(errors)) {
            $log.error('Actor mapping errors', errors);
            growl.error(i18nService.getKey('processDetails.actors.update.error', {nbErrors: errors.length}), growlOptions);
          }
        }).finally(function() {
          $scope.$emit('process.refresh');
          ActorMappingService.getActorMembers(actor, vm.actorProfiles[memberType].deploy, process).then(function(actors) {
            vm.actorsMembers[actor.id][memberType] = actors;
          });
        });
      };
    })
    .filter('dateInMillis', function() {
      return function(dateString) {
        return Date.parse(dateString);
      };
    });
})();
