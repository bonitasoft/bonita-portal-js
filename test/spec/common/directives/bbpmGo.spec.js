(function () {
    'use strict';

    describe('Directive: bbpmGo', function() {

        beforeEach(module('org.bonita.common.directives'));

        var scope, $compile;

        beforeEach(inject(function($rootScope, _$compile_) {
            scope = $rootScope.$new();
            $compile = _$compile_;
        }));

        it('should say hello', function() {
            var html = $compile('<p bbpm-go></p>')(scope);

            expect(html[0].outerHTML).toEqual('<p bbpm-go="" class="ng-scope">hello</p>');
        });
    });

})();