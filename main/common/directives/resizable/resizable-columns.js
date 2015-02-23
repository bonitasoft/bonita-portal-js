(function() {
  'use strict';
  angular.module('org.bonitasoft.common.table.resizable', [])
    .directive('resizableColumn', ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        scope : {
          columns : '='
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
          scope.$watch('columns', resizeColumn, true);
        }
      };
    }
    ]);

})();
