(function(){
  'use strict';
  angular
  .module('org.bonita.sortable',[])
  .directive('boSorter', function(){
    return {
      restrict: 'A',
      scope: {
        sortOptions : '=',
        onSort : '&'
      },
      templateUrl: 'template/sortable/sorter.tpl.html',
      transclude: true,
      link: function($scope, iElm, attr) {
        $scope.property =  (attr.id || attr.boSorter || '').trim();
        if($scope.property){
          iElm.addClass('pointer');
        }

        $scope.sort = function() {
          if ($scope.property && $scope.sortOptions.property === $scope.property){
            $scope.sortOptions.ascendant = !$scope.sortOptions.ascendant;
          } else if ($scope.property){
            $scope.sortOptions.property = $scope.property;
            $scope.sortOptions.ascendant = true;
          }
          $scope.onSort()($scope.sortOptions);

        };
      }
    };
  }).run(['$templateCache', function($templateCache) {
    $templateCache.put('template/sortable/sorter.tpl.html',
      '<div ng-click="sort()"><span ng-transclude></span>\n' +
      '<span class="glyphicon" ng-class="{\'glyphicon-chevron-up\':sortOptions.ascendant &amp;&amp; sortOptions.property === property, \'glyphicon-chevron-down\':!sortOptions.ascendant &amp;&amp; sortOptions.property === property}"></span></div>\n' +
      '');
  }]);
})();
