(function() {
  'use strict';
  angular.module('org.bonita.features.admin.cases.list.flownodePopover',
    ['org.bonita.common.resources',
      'ui.bootstrap'
    ])
    .config(['$tooltipProvider',
      function ($tooltipProvider) {
        $tooltipProvider.setTriggers({'popoverAsyncTrigger': 'blur'});
      }])
    .controller('flowNodeBadgeCtrl', ['$scope', 'flowNodeAPI', function($scope, flowNodeAPI) {
      this.showPopover = function () {
        var filters = ['caseId=' + $scope.caseId];
        if($scope.filter) {
          filters.push($scope.filter);
        }
        var searchParams = {
          p: 0,
          c: 10,
          f: filters
        };
        $scope.flowNodesItems = flowNodeAPI.search(searchParams);
        $scope.flowNodesItems.$promise.then($scope.triggerPopover);
      };
    }])
    .directive('flowNodeBadge', ['$timeout', function ($timeout) {
      return {
        restrict: 'E',
        scope: {
          'caseId': '=',
          'filter': '@',
          'label': '@'
        },
        controller: 'flowNodeBadgeCtrl',
        controllerAs: 'badge',
        templateUrl: 'features/admin/cases/flownode-badge.html',
        link: function(scope, element) {
          scope.triggerPopover = function() {
            $timeout(function() {
              element.find('a').trigger('popoverAsyncTrigger');
            }, 0);
          };
        }
      };
    }])
    .directive('popoverHtmlTemplatePopup', function () {
      return {
        restrict: 'EA',
        replace: true,
        scope: {title: '@', content: '@', placement: '@', animation: '&', isOpen: '&', flownodesItems: '='},
        templateUrl: 'features/admin/cases/popover-html-template.html'
      };
    })
    .directive('focusOnClick', ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        link: function (scope, element) {
          element.on('click', function () {
            $timeout(function () {
              element.focus();
            }, 0);
          });
          scope.$on('$destroy', function () {
            element.off('click');
          });
        }
      };
    }])
    .directive('popoverHtmlTemplate', ['$tooltip', function ($tooltip) {
      return $tooltip('popoverHtmlTemplate', 'popover', 'click');
    }]);
})();
