(function () {
    'use strict';

    angular.module('org.bonita.common.directives', [])
        .constant('baseUrl', top.location.href)
        .directive('bbpmGoTo', ['baseUrl', function(baseUrl) {
            return {
                restrict: 'A',
                scope: {
                    url: '@bbpmGoTo'
                },
                link: function(scope, element) {
                    if(!element.is('a')) {
                        throw new Error('bbpmGoTo is only applicable on anchor elements.');
                    }
                    element.prop('href', baseUrl + scope.url);
                    element.prop('target', '_top');
                }
            };
        }]);
})();