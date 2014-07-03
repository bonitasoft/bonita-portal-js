(function () {
    'use strict';

    describe('Directive: bbpmGoTo', function () {

        beforeEach(module('org.bonita.common.directives'));

        beforeEach(module(function($provide) {
            $provide.constant('baseUrl', 'http://my.url.com:8080/base');
        }));

        var scope, $compile;

        beforeEach(inject(function ($rootScope, _$compile_) {
            scope = $rootScope.$new();
            $compile = _$compile_;
        }));

        it('should preserve the text of the link', function () {
            var element = $compile('<a bbpm-go-to="#/whatever">A link</a>')(scope);

            expect(element.text()).toEqual('A link');
        });

        it('should href url passed through prefixed by baseUrl', function () {
            var element = $compile('<a bbpm-go-to="#/whatever"></a>')(scope);

            expect(element.prop('href')).toEqual('http://my.url.com:8080/base#/whatever');
        });

        it('should set target property to _top', function () {
            var element = $compile('<a bbpm-go-to="#/whatever"></a>')(scope);

            expect(element.prop('target')).toEqual('_top');
        });

        it('should be restricted to anchor', function () {
            expect(function() {
                $compile('<div bbpm-go-to="#/whatever"></div>')(scope);
            }).toThrow(new Error('bbpmGoTo is only applicable on anchor elements.'));
        });
    });

})();