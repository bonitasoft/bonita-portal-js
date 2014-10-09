(function () {
    'use strict';

    describe('admin cases list features', function() {
        it('should fill scope to display case lit', function() {

            var scope;

            beforeEach(module('org.bonita.features.admin.cases.list'));

            beforeEach(inject(function ($rootScope) {
                scope = $rootScope.$new();
              }));

            it('should fill the scope with "WTF!"', inject(function($controller){
                $controller('casesListCtrl', {'$scope' : scope});
                expect(scope.content).toBe('Hello MTF !');
              }));
          });
      });
  })();
