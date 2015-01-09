(function() {
  'use strict';
  angular.module('org.bonita.common.table.resizable', [])
    .directive('resizableColumn', ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        scope : {
          resizableColumn : '='
        },
        link: function (scope, $el) {
          var resizeColumn = function () {
            $timeout(function () {
              var data = $el.data('resizableColumns');
              if (data) {
                data.destroy();
              }
              $el.resizableColumns({
                selector: 'tr th'
              });
            }, 0);
          };
          scope.$watch('resizableColumn', resizeColumn, true);
        }
      };
    }
    ]);

})();
