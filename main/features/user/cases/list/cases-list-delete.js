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

  angular.module('org.bonitasoft.features.user.cases.list.delete', [
    'org.bonitasoft.common.resources',
    'org.bonitasoft.services.i18n',
    'ui.bootstrap',
  ])
  .controller('ActiveCaseDeleteUserCtrl', ['$scope', '$modal', 'caseAPI', 'i18nService', '$q',  CaseDeleteUserCtrl])
  .directive('activeCaseUserDelete',
    function () {
      return {
        restrict: 'E',
        require: '^ActiveCaseListUserCtrl',
        transclude : true,
        controller: 'ActiveCaseDeleteUserCtrl',
        template : '<button id="delete-button" type="button" class="btn btn-default" ng-click="deleteUserCtrl.confirmDeleteSelectedCases()" ng-disabled="deleteUserCtrl.checkNoCasesSelected()"><div ng-transclude></div></button>',
        controllerAs : 'deleteUserCtrl'
      };
    })
  .controller('ArchivedCaseDeleteUserCtrl', ['$scope', '$modal', 'archivedCaseAPI', 'i18nService', '$q', CaseDeleteUserCtrl])
  .directive('archivedCaseUserDelete',
    function() {
      return {
        restrict: 'E',
        require: '^ArchivedCaseListUserCtrl',
        transclude : true,
        template : '<button id="delete-archived-button" type="button" class="btn btn-default" ng-click="deleteUserCtrl.confirmDeleteSelectedCases(\'archived\')" ng-disabled="deleteUserCtrl.checkNoCasesSelected()"><div ng-transclude></div></button>',
        controller: 'ArchivedCaseDeleteUserCtrl',
        controllerAs : 'deleteUserCtrl'
      };
    })
  .controller('DeleteCaseModalUserCtrl', ['$scope', '$modalInstance', 'typeOfCase', 'caseItems', DeleteCaseModalUserCtrl]);


  /**
   * @ngdoc object
   * @name o.b.f.user.cases.list.CaseDeleteUserCtrl
   * @description
   * This is a controller that manages the case deletion behaviour
   *
   * @requires $scope
   * @requires $modal
   * @requires caseAPI
   * @requires i18nService
   */
  /* jshint -W003 */
  function CaseDeleteUserCtrl($scope, $modal, caseAPI, i18nService, $q) {

    var vm = this;
    /**
     * @ngdoc method
     * @name o.b.f.user.cases.list.CaseDeleteUserCtrl#confirmDeleteSelectedCases
     * @methodOf o.b.f.user.cases.list.CaseDeleteUserCtrl
     * @description
     * It opens a modal asking for a confirmation to delete the selected case(s).<br>
     * If the confirmation is selected, the {@link o.b.f.user.cases.list.CaseDeleteUserCtrl#deleteSelectedCases deleteSelectedCases}
     * is called upon selected cases
     */
    vm.confirmDeleteSelectedCases = function confirmDeleteSelectedCases(type) {
      if ($scope.$selectedItems) {
        $modal.open({
          templateUrl: 'features/user/cases/list/cases-list-deletion-modal.html',
          controller: 'DeleteCaseModalUserCtrl',
          controllerAs: 'deleteCaseModalUserCtrl',
          resolve: {
            typeOfCase: function() {
              return type || '';
            },
            caseItems: function() {
              return $scope.$selectedItems;
            }
          },
          size: 'sm'
        }).result.then(vm.deleteSelectedCases);
      }
    };

    /**
     * @ngdoc method
     * @name o.b.f.user.cases.list.CaseDeleteUserCtrl#checkCaseIsNotSelected
     * @methodOf o.b.f.user.cases.list.CaseDeleteUserCtrl
     * @description
     * @returns {Boolean} true if no case are selected
     */
    vm.checkNoCasesSelected = function checkNoCasesSelected() {
      return !($scope.$selectedItems && $scope.$selectedItems.length > 0);
    };

    /**
     * @ngdoc method
     * @name o.b.f.user.cases.list.CaseDeleteUserCtrl#deleteSelectedCases
     * @methodOf o.b.f.user.cases.list.CaseDeleteUserCtrl
     * @description
     * For each selected case, it calls delete with the case id, chaining the
     * calls until all calls have been made. finally, it displays a message indicating
     * how many items it has successfully deleted
     */
    vm.deleteSelectedCases = function deleteSelectedCases() {
      var caseItems = $scope.$selectedItems;
      if (caseItems) {
        var caseIds = caseItems.map(function(caseItem) {
          return caseItem.id;
        });
        if (caseIds && caseIds.length) {
          var nbOfDeletedCases = 0;
          $q.all(caseIds.map(function(caseId){
            return caseAPI.delete({
              id: caseId
            }).$promise.then(function(){nbOfDeletedCases++;}, function(error){$scope.$emit('caselist:http-error', error);});
          })).then(finishDeleteProcess);
        }
      }
      function finishDeleteProcess(){
        $scope.$emit('caselist:notify', {
          type: 'success',
          status: ((nbOfDeletedCases===1)?
            i18nService.getKey('caselist.delete.single', {
            nbOfDeletedCases: nbOfDeletedCases
          }):
            i18nService.getKey('caselist.delete.multiple', {
            nbOfDeletedCases: nbOfDeletedCases
          }))
        });
        $scope.pagination.currentPage = 1;
        $scope.$emit('caselist:search');
      }
    };
  }


  /**
   * @ngdoc object
   * @name o.b.f.user.cases.list.DeleteCaseModalUserCtrl
   * @description
   * This is a controller that manages the deletion modal
   *
   * @requires $scope
   * @requires $modalInstance
   * @requires caseItems
   */
  function DeleteCaseModalUserCtrl($scope, $modalInstance, typeOfCase, caseItems) {
    $scope.caseItems = caseItems;
    $scope.typeOfCase = typeOfCase;

    /**
     * @ngdoc method
     * @name o.b.f.user.cases.list.DeleteCaseModalUserCtrl#ok
     * @methodOf o.b.f.user.cases.list.DeleteCaseModalUserCtrl
     * @description
     * confirms the case deletion and launch resolve on the modal promise<br>
     * see {@link o.b.f.user.cases.list.CaseDeleteUserCtrl#confirmDeleteSelectedCases confirmDeleteSelectedCases}
     *
     */
    this.ok = function() {
      $modalInstance.close();
    };

    /**
     * @ngdoc method
     * @name o.b.f.user.cases.list.DeleteCaseModalUserCtrl#cancel
     * @methodOf o.b.f.user.cases.list.DeleteCaseModalUserCtrl
     * @description
     * cancels the case deletion and launch reject on modal promise
     */
    this.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  }
})();
