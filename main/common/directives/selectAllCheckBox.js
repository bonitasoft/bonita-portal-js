(function () {
  'use strict';

  angular.module('org.bonita.common.directives.selectAll', [])
  .directive('selectAllCheckbox', function () {
    return {
      replace: true,
      restrict: 'E',
      scope: {
        checkboxes: '='
      },
      template: '<input type="checkbox" ng-model="master" ng-change="masterChange()">',
      link: function ($scope, $element) {

        $scope.masterChange = function () {
          if(!!$scope.masterIndeterminate){
            angular.forEach($scope.checkboxes, function (cb) {
              cb.selected = false;
            });
            $scope.master = false;
          } else if ($scope.master === true) {
            angular.forEach($scope.checkboxes, function (cb) {
              cb.selected = true;
            });
          } else {
            angular.forEach($scope.checkboxes, function (cb) {
              cb.selected = false;
            });
          }
        };

        $scope.$watch('checkboxes', function () {
          var allSet = true,
            allClear = true;
          angular.forEach($scope.checkboxes, function (cb) {
            if (cb.selected) {
              allClear = false;
            } else {
              allSet = false;
            }
          });

          $element.prop('indeterminate', false);
          if (allSet) {
            $scope.master = true;
            delete $scope.masterIndeterminate;
          } else if (allClear) {
            $scope.master = false;
            delete $scope.masterIndeterminate;
          } else {
            $scope.masterIndeterminate = 'indeterminate';
            $element.prop('indeterminate', true);
          }
        }, true);
      }
    };
  });
})();
