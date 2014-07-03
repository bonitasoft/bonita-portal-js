(function () {
    'use strict';

    describe('Directive: bbpmGo', function () {

        beforeEach(module('org.bonita.common.directives'));

        beforeEach(module(function($provide) {
            $provide.constant('baseUrl', 'http://my.url.com:8080/');
        }));

        var scope, $compile;

        beforeEach(inject(function ($rootScope, _$compile_) {
            scope = $rootScope.$new();
            $compile = _$compile_;
        }));

        it('should preserve the text of the link', function () {
            var element = $compile('<a bbpm-go="#/whatever">A link</a>')(scope);

            expect(element.text()).toEqual('A link');
        });

        it('should href url passed through prefixed by baseUrl', function () {
            var element = $compile('<a bbpm-go="#/whatever"></a>')(scope);

            expect(element.prop('href')).toEqual('http://my.url.com:8080/#/whatever');
        });

        it('should set target property to _top', function () {
            var element = $compile('<a bbpm-go="#/whatever"></a>')(scope);

            expect(element.prop('target')).toEqual('_top');
        });
    });

})();