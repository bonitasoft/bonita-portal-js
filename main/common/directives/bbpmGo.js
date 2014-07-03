(function () {
    'use strict';

    angular.module('org.bonita.common.directives', [])
        .constant('baseUrl', top.location.href)
        .directive('bbpmGo', ['baseUrl', function(baseUrl) {
            return {
                restrict: 'A',
                scope: {
                    url: '@bbpmGo'
                },
                link: function(scope, element) {
                    element.prop('href', baseUrl + scope.url);
                    element.prop('target', '_top');
                }
            };
        }]);
})();