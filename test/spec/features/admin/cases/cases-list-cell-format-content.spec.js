(function () {
  'use strict';
  describe('resizable column directive', function () {

    var scope, element, compile;

    beforeEach(module('org.bonita.features.admin.cases.list'));

    beforeEach(inject(function ($rootScope) {
      scope = $rootScope.$new();
    }));

    describe('formatContent', function () {
      beforeEach(inject(function ($compile) {
        scope.col = {name : 'content'};
        scope.caseItem = {};
        compile = $compile;
      }));
      it('should not format data', function () {
        scope.caseItem.content = 'test';
        element = compile('<format-content column="col" case-item="caseItem"></format-content>')(scope);
        expect(element.html()).toEqual(scope.caseItem.content);
      });
      it('should not format date when data is not in the right format', function () {
        scope.caseItem.content = 'test';
        scope.col.date = true;
        element = compile('<format-content column="col" case-item="caseItem"></format-content>')(scope);
        expect(element.html()).toEqual(scope.caseItem.content);
      });
      it('should not format date when data is not in the right format', function () {
        scope.caseItem.content = '2014-10-17 16:05:42.626';
        var expectedFormatedData = '2014-10-17 16:05';
        scope.col.date = true;
        element = compile('<format-content column="col" case-item="caseItem"></format-content>')(scope);
        expect(element.html()).toEqual(expectedFormatedData);
      });
    });
  });
})();
