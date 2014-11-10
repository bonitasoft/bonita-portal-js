(function() {
  'use strict';

  angular.module('org.bonita.features.admin.cases.list.delete', [
    'org.bonita.common.resources',
    'gettext',
    'ui.bootstrap',
  ])
  .controller('ActiveCaseDeleteCtrl', ['$scope', '$modal', 'caseAPI', 'gettextCatalog', CaseDeleteCtrl])
  .directive('activeCaseDelete',
  function () {
    return {
      restrict: 'A',
      require: '^ActiveCaseListCtrl',
      controller: 'ActiveCaseDeleteCtrl'
    };
  })
  .controller('ArchivedCaseDeleteCtrl', ['$scope', '$modal', 'archivedCaseAPI', 'gettextCatalog', CaseDeleteCtrl])
  .directive('archivedCaseDelete',
    function() {
      return {
        restrict: 'A',
        require: '^ArchivedCaseListCtrl',
        controller: 'ArchivedCaseDeleteCtrl'
      };
    })
  .controller('DeleteCaseModalCtrl', ['$scope', '$modalInstance', 'caseItems', DeleteCaseModalCtrl]);


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
  function CaseDeleteCtrl($scope, $modal, caseAPI, gettextCatalog) {
    /**
     * @ngdoc method
     * @name o.b.f.admin.cases.list.CaseDeleteCtrl#confirmDeleteSelectedCases
     * @methodOf o.b.f.admin.cases.list.CaseDeleteCtrl
     * @description
     * It opens a modal asking for a confirmation to delete the selected case(s).<br>
     * If the confirmation is selected, the {@link o.b.f.admin.cases.list.CaseDeleteCtrl#deleteSelectedCases deleteSelectedCases}
     * is called upon selected cases
     */
    $scope.confirmDeleteSelectedCases = function confirmDeleteSelectedCases() {
      if ($scope.cases) {
        var caseItems = $scope.cases.filter(function filterSelectedOnly(caseItem) {
          return caseItem && caseItem.selected;
        });
        $modal.open({
          templateUrl: 'features/admin/cases/list/cases-list-deletion-modal.html',
          controller: 'DeleteCaseModalCtrl',
          resolve: {
            caseItems: function() {
              return caseItems;
            }
          },
          size: 'sm'
        }).result.then($scope.deleteSelectedCases);
      }
    };
    /**
     * @ngdoc method
     * @name o.b.f.admin.cases.list.CaseDeleteCtrl#checkCaseIsNotSelected
     * @methodOf o.b.f.admin.cases.list.CaseDeleteCtrl
     * @description
     * @returns {Boolean} true if no case are selected
     */
    $scope.checkCaseIsNotSelected = function checkCaseIsNotSelected() {
      return $scope.cases && $scope.cases.reduce(function(previousResult, caseItem) {
        return previousResult && !caseItem.selected;
      }, true);
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
    $scope.deleteSelectedCases = function deleteSelectedCases() {
      if ($scope.cases) {
        var caseIds = $scope.cases.filter(function(caseItem) {
          return caseItem && caseItem.selected && caseItem.id;
        }).map(function(caseItem) {
          return caseItem.id;
        });
        var nbOfDeletedCases = 0;
        if (caseIds && caseIds.length) {
          //this function chains the case deletion
          var deletePromise = function(id) {
            var currentPromise = caseAPI.delete({
              id: id
            }).$promise.then(function() {
              nbOfDeletedCases++;
            }, $scope.displayError);
            if (caseIds && caseIds.length) {
              var deleteNextId = function deleteNextId() {
                deletePromise(caseIds.pop());
              };
              currentPromise.finally(deleteNextId);
            } else {
              currentPromise.then(function() {
                $scope.addAlert({
                  type: 'success',
                  status: gettextCatalog.getPlural(nbOfDeletedCases, '{{nbOfDeletedCases}} case deleted successfully', '{{nbOfDeletedCases}} cases deleted successfully', {
                    nbOfDeletedCases: nbOfDeletedCases
                  })
                });
              }).finally(function() {
                $scope.pagination.currentPage = 1;
                $scope.searchForCases();
              });
            }
          };
          deletePromise(caseIds.pop());
        }
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
  function DeleteCaseModalCtrl($scope, $modalInstance, caseItems) {
    $scope.caseItems = caseItems;

    /**
     * @ngdoc method
     * @name o.b.f.admin.cases.list.DeleteCaseModalCtrl#ok
     * @methodOf o.b.f.admin.cases.list.DeleteCaseModalCtrl
     * @description
     * confirms the case deletion and launch resolve on the modal promise<br>
     * see {@link o.b.f.admin.cases.list.CaseDeleteCtrl#confirmDeleteSelectedCases confirmDeleteSelectedCases}
     *
     */
    $scope.ok = function() {
      $modalInstance.close();
    };

    /**
     * @ngdoc method
     * @name o.b.f.admin.cases.list.DeleteCaseModalCtrl#cancel
     * @methodOf o.b.f.admin.cases.list.DeleteCaseModalCtrl
     * @description
     * cancels the case deletion and launch reject on modal promise
     */
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  }
})();
