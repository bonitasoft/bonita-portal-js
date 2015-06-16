/** Copyright (C) 2015 Bonitasoft S.A.
 * Bonitasoft, 32 rue Gustave Eiffel - 38000 Grenoble
 * This library is free software; you can redistribute it and/or modify it under the terms
 * of the GNU Lesser General Public License as published by the Free Software Foundation
 * version 2.1 of the License.
 * This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public License along with this
 * program; if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth
 * Floor, Boston, MA 02110-1301, USA.
 */

(function() {
  'use strict';
  /**
   * org.bonitasoft.common.actors.selectbox Module
   *
   * contains definition of the actors selectbox directive
   */
  angular.module('org.bonitasoft.common.actors.selectbox', [
    'org.bonitasoft.services.i18n',
    'org.bonitasoft.common.properties',
    'org.bonitasoft.features.admin.mappings',
    'isteven-multi-select'
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
  }).controller('ActorsSelectBoxCtrl', function($scope, MappingService) {
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
        previousSearchTerm = searchOptions.s;
      }
      searchOptions.s = search.keyword;
      MappingService.searchMembers(type, searchOptions, searchMemberParams, $scope.alreadyMappedActorsIds).then(function(results) {
        vm.members = _.chain(results).filter(function(currentMember) {
          return $scope.alreadyMappedActorsIds.indexOf(currentMember.id) === -1;
        }).forEach(function(currentMember) {
          currentMember.listLabel = MappingService.labelFormatter[type](currentMember);
          currentMember.buttonLabel = currentMember.listLabel;
        }).value();
      });
    };
    vm.search({});
  });
})();
