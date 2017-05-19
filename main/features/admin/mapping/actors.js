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
   * org.bonitasoft.common.actors.selectbox Module
   *
   * contains definition of the actors selectbox directive
   */
  angular.module('org.bonitasoft.common.actors.selectbox', [
    'org.bonitasoft.common.i18n',
    'org.bonitasoft.common.properties',
    'org.bonitasoft.features.admin.mappings',
    'isteven-multi-select',
    'org.bonitasoft.service.debounce'
  ]).directive('actorsSelectBox', function() {
    return {
      priority: 10000,
      scope: {
        localLang: '=',
        selectedMembers: '=',
        alreadyMappedActorsIds: '=',
        type: '@'
      }, // {} = isolate, true = child, false/undefined = no change
      controller: 'ActorsSelectBoxCtrl',
      controllerAs: 'actorsCtrl',
      restrict: 'E',
      templateUrl: 'features/admin/mapping/actors.html',
      // replace: true
      link: function($scope, iElm, iAttrs, controller) {
        controller.selectionMode = iAttrs.selectionMode;
      }
    };
  }).controller('ActorsSelectBoxCtrl', function($scope, MappingService, debounce) {
    var vm = this;
    vm.selectedMembers = $scope.selectedMembers;
    $scope.$watch(function() {
      return $scope.alreadyMappedActorsIds && $scope.alreadyMappedActorsIds.length;
    }, function() {
      if (_.isArray($scope.alreadyMappedActorsIds)) {
        vm.members = vm.members.filter(function(currentMember) {
          return $scope.alreadyMappedActorsIds.indexOf(currentMember.id) === -1;
        });
      }
    });
    vm.selectedMembers.list = [];
    var type = $scope.type;
    vm.members = [];
    var searchOptions = {
      p: 0,
      c: 200
    };
    var searchMemberParams = MappingService.getSearchMemberParams(type);
    var previousSearchTerm;
    vm.search = function(search) {
      if (search.keyword && previousSearchTerm === search.keyword) {
        return;
      } else {
        previousSearchTerm = search.keyword;
      }
      searchOptions.s = search.keyword;
      MappingService.searchMembers(type, searchOptions, searchMemberParams, $scope.alreadyMappedActorsIds)
        .then(function(results) {
        vm.members = _.chain(results).filter(function(currentMember) {
          return $scope.alreadyMappedActorsIds.indexOf(currentMember.id) === -1;
        }).map(MappingService.formatToSelectBox[type]).value();

        // isteven-multi-select filter input-model on search term but bonita search API search with a logical OR
        // when there are space in search term. We need to re-apply search term in order to make input model consistent
        // with mutli-select internal model
        // see https://bonitasoft.atlassian.net/browse/BS-15195
        if (search.keyword) {
          vm.members = vm.ensureKeywordMatchesEntries(search.keyword, vm.members);
        }
        vm.members = _.unionWith(vm.selectedMembers.list, vm.members, function(member1, member2) { return member1.id === member2.id; });
      });

    };

   vm.searchWithDebounce = function(mySearch) {
      debounce(vm.search(mySearch), 300);
    };

    vm.search({});

    vm.ensureKeywordMatchesEntries = function(keyword, members) {
      return members.filter(function (member) {
        return member.contentToSearch.match(new RegExp(keyword, 'i'));
      });
    };
  });
})();
