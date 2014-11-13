(function () {
  'use strict';
  describe('resizable column directive', function () {

    var scope, element, compile;



    describe('formatContent', function () {
      beforeEach(module('org.bonita.features.admin.cases.list.formatContent', function($controllerProvider){
        $controllerProvider.register('formatContentController', function() {

        });
      }));
      beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
      }));

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
      xit('should date when data is not in the right format', function () {
        scope.caseItem.content = 'test';
        scope.caseItem.id = 1132524;
        scope.linkToCase = '/bonita/portal?tenantId=1#_p=moredetails';
        scope.col.linkToCase = true;
        element = compile('<format-content column="col" case-item="caseItem"></format-content>')(scope);
        expect(element.html()).toEqual('<a id="case-detail-link-' + scope.caseItem.id + '" target="_top" href="' + scope.linkToCase + '">' + scope.caseItem[scope.col.name] + '</a>');
      });
    });
  });
})();
