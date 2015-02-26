(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.cases.list.delete', [
    'org.bonitasoft.common.resources',
    'gettext',
    'ui.bootstrap',
  ])
  .controller('ActiveCaseDeleteCtrl', ['$scope', '$modal', 'caseAPI', 'gettextCatalog', '$q',  CaseDeleteCtrl])
  .directive('activeCaseDelete',
    function () {
      return {
        restrict: 'E',
        require: '^ActiveCaseListCtrl',
        transclude : true,
        controller: 'ActiveCaseDeleteCtrl',
        template : '<button id="delete-button" type="button" class="btn btn-default" ng-click="deleteCtrl.confirmDeleteSelectedCases()" ng-disabled="deleteCtrl.checkNoCasesSelected()"><div ng-transclude></div></button>',
        controllerAs : 'deleteCtrl'
      };
    })
  .controller('ArchivedCaseDeleteCtrl', ['$scope', '$modal', 'archivedCaseAPI', 'gettextCatalog', '$q', CaseDeleteCtrl])
  .directive('archivedCaseDelete',
    function() {
      return {
        restrict: 'E',
        require: '^ArchivedCaseListCtrl',
        transclude : true,
        template : '<button id="delete-archived-button" type="button" class="btn btn-default" ng-click="deleteCtrl.confirmDeleteSelectedCases(\'archived\')" ng-disabled="deleteCtrl.checkNoCasesSelected()"><div ng-transclude></div></button>',
        controller: 'ArchivedCaseDeleteCtrl',
        controllerAs : 'deleteCtrl'
      };
    })
  .controller('DeleteCaseModalCtrl', ['$scope', '$modalInstance', 'typeOfCase', 'caseItems', DeleteCaseModalCtrl]);


  /**
   * @ngdoc object
   * @name o.b.f.admin.cases.list.CaseDeleteCtrl
   * @description
   * This is a controller that manages the case deletion behaviour
   *
   * @requires $scope
   * @requires $modal
   * @requires caseAPI
   * @requires gettextCatalog
   */
  /* jshint -W003 */
  function CaseDeleteCtrl($scope, $modal, caseAPI, gettextCatalog, $q) {

    var vm = this;
    /**
     * @ngdoc method
     * @name o.b.f.admin.cases.list.CaseDeleteCtrl#confirmDeleteSelectedCases
     * @methodOf o.b.f.admin.cases.list.CaseDeleteCtrl
     * @description
     * It opens a modal asking for a confirmation to delete the selected case(s).<br>
     * If the confirmation is selected, the {@link o.b.f.admin.cases.list.CaseDeleteCtrl#deleteSelectedCases deleteSelectedCases}
     * is called upon selected cases
     */
    vm.confirmDeleteSelectedCases = function confirmDeleteSelectedCases(type) {
      if ($scope.$selectedItems) {
        $modal.open({
          templateUrl: 'features/admin/cases/list/cases-list-deletion-modal.html',
          controller: 'DeleteCaseModalCtrl',
          controllerAs: 'deleteCaseModalCtrl',
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
     * @name o.b.f.admin.cases.list.CaseDeleteCtrl#checkCaseIsNotSelected
     * @methodOf o.b.f.admin.cases.list.CaseDeleteCtrl
     * @description
     * @returns {Boolean} true if no case are selected
     */
    vm.checkNoCasesSelected = function checkNoCasesSelected() {
      return !($scope.$selectedItems && $scope.$selectedItems.length > 0);
    };

    /**
     * @ngdoc method
     * @name o.b.f.admin.cases.list.CaseDeleteCtrl#deleteSelectedCases
     * @methodOf o.b.f.admin.cases.list.CaseDeleteCtrl
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
            gettextCatalog.getString('{{nbOfDeletedCases}} case deleted successfully', {
            nbOfDeletedCases: nbOfDeletedCases
          }):
            gettextCatalog.getString('{{nbOfDeletedCases}} cases deleted successfully', {
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
   * @name o.b.f.admin.cases.list.DeleteCaseModalCtrl
   * @description
   * This is a controller that manages the deletion modal
   *
   * @requires $scope
   * @requires $modalInstance
   * @requires caseItems
   */
  function DeleteCaseModalCtrl($scope, $modalInstance, typeOfCase, caseItems) {
    $scope.caseItems = caseItems;
    $scope.typeOfCase = typeOfCase;

    /**
     * @ngdoc method
     * @name o.b.f.admin.cases.list.DeleteCaseModalCtrl#ok
     * @methodOf o.b.f.admin.cases.list.DeleteCaseModalCtrl
     * @description
     * confirms the case deletion and launch resolve on the modal promise<br>
     * see {@link o.b.f.admin.cases.list.CaseDeleteCtrl#confirmDeleteSelectedCases confirmDeleteSelectedCases}
     *
     */
    this.ok = function() {
      $modalInstance.close();
    };

    /**
     * @ngdoc method
     * @name o.b.f.admin.cases.list.DeleteCaseModalCtrl#cancel
     * @methodOf o.b.f.admin.cases.list.DeleteCaseModalCtrl
     * @description
     * cancels the case deletion and launch reject on modal promise
     */
    this.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  }
})();
