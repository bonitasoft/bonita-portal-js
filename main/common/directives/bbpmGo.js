(function () {
    'use strict';

    angular.module('org.bonita.common.directives', [])
        .directive('bbpmGo', [function() {
            return {
                restrict: 'A',
                template: 'hello'
            };
        }]);
})();