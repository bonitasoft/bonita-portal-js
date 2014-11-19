(function () {
  'use strict';
  describe('format column content directive', function () {

    var scope, element, compile;



    describe('formatContentController', function() {
      var manageTopUrl;
      beforeEach(module('org.bonita.features.admin.cases.list.formatContent'));

      beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
        manageTopUrl = jasmine.createSpyObj('manageTopUrl', ['getPath', 'getSearch', 'getCurrentProfile']);
        manageTopUrl.getPath.and.returnValue('/bonita');
        manageTopUrl.getSearch.and.returnValue('');
        manageTopUrl.getCurrentProfile.and.returnValue('pf=2');
      }));

      it('should set link to pm when supervisor is set', inject(function($controller){
        scope.column = {linkToProcess : true, name : 'ProcessName'};
        scope.caseItem = {id : 123, processDefinitionId :{ id : 123}, 'ProcessName' : 'testApp' };
        scope.processManager = '1';
        $controller('formatContentController',{
          $scope : scope,
          manageTopUrl : manageTopUrl
        });
        expect(scope.contents).toEqual('<a id="case-process-link-123" target="_top" href="/bonita#?id=123&_p=processmoredetailspm&pf=2">testApp</a>');
      }));
      it('should set link to admin when supervisor is not set', inject(function($controller){
        scope.column = {linkToProcess : true, name : 'ProcessName'};
        scope.caseItem = {id : 123, processDefinitionId :{ id : 123}, 'ProcessName' : 'testApp' };
        scope.processManager = '0';
        $controller('formatContentController',{
          $scope : scope,
          manageTopUrl : manageTopUrl
        });
        expect(scope.contents).toEqual('<a id="case-process-link-123" target="_top" href="/bonita#?id=123&_p=processmoredetailsadmin&pf=2">testApp</a>');
      }));
      it('should set link to admin when supervisor is undefined', inject(function($controller){
        scope.column = {linkToProcess : true, name : 'ProcessName'};
        scope.caseItem = {id : 123, processDefinitionId :{ id : 123}, 'ProcessName' : 'testApp' };
        $controller('formatContentController',{
          $scope : scope,
          manageTopUrl : manageTopUrl
        });
        expect(scope.contents).toEqual('<a id="case-process-link-123" target="_top" href="/bonita#?id=123&_p=processmoredetailsadmin&pf=2">testApp</a>');
      }));
      it('should set content to caseItem contents', inject(function($controller){
        scope.column = {name : 'ProcessName'};
        scope.caseItem = {'ProcessName' : 'testApp' };
        $controller('formatContentController',{
          $scope : scope,
          manageTopUrl : manageTopUrl
        });
        expect(scope.contents).toEqual(scope.caseItem.ProcessName);
      }));
      it('should set content to column default value when caseItem contents is empty', inject(function($controller){
        scope.column = {};
        scope.caseItem = {'ProcessName' : 'testApp', defaultValue : 'System' };
        $controller('formatContentController',{
          $scope : scope,
          manageTopUrl : manageTopUrl
        });
        expect(scope.contents).toEqual(scope.column.defaultValue);
      }));
      it('should not format date when data is not in the right format', inject(function($controller){
        scope.column = {name : 'content', date : true};
        scope.caseItem = {processDefinitionId :{ id : 123} , content : 'test'};
        $controller('formatContentController',{
          $scope : scope,
          manageTopUrl : manageTopUrl
        });
        expect(scope.contents).toEqual(scope.caseItem.content);
      }));
      it('should format date', inject(function($controller){
        scope.caseItem = {content : '2014-10-17 16:05:42.626'};
        scope.dateFormat = 'MM/dd/yyyy h:mm:ss a';
        var expectedFormatedData = '10/17/2014 4:05:42 PM';
        scope.column = { date : true , name : 'content'};
        $controller('formatContentController',{
          $scope : scope,
          manageTopUrl : manageTopUrl
        });
        expect(scope.contents).toEqual(expectedFormatedData);
      }));
      it('should date when data is not in the right format', inject(function($controller){
        scope.caseItem = { content : 'test', id : 1132524 };
        scope.dateFormat = 'MM/dd/yyyy h:mm:ss a';
        scope.column = { date : true , name : 'content'};
        $controller('formatContentController',{
          $scope : scope,
          manageTopUrl : manageTopUrl
        });
        expect(scope.contents).toEqual(scope.caseItem.content);
      }));
    });

    describe('formatContent directive only', function () {
      //create dummy ctrl in order to test link function directive only
      beforeEach(function(){
        angular.module('org.bonita.features.admin.cases.list.formatContent.spec',[]).controller('formatContentController', function($scope){
          $scope.contents = 'test';
        });
      });
      beforeEach(module('org.bonita.features.admin.cases.list.formatContent'));
      beforeEach(module('org.bonita.features.admin.cases.list.formatContent.spec'));

      beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
      }));

      beforeEach(inject(function ($compile) {
        compile = $compile;
      }));
      it('should not format data', function () {
        element = compile('<format-content column="column" case-item="caseItem"></format-content>')(scope);
        expect(element.html()).toEqual('test');
      });

    });

    describe('formatContent directive and Ctrl', function () {
      //create dummy ctrl in order to test link function directive only
      beforeEach(module('org.bonita.features.admin.cases.list.formatContent'));

      beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
      }));

      beforeEach(inject(function ($compile) {
        compile = $compile;
      }));
      it('should not format data', function () {
        scope.caseItem = { content : 'test', id : 1132524 };
        scope.dateFormat = 'MM/dd/yyyy h:mm:ss a';
        scope.column = { date : true , name : 'content'};

        element = compile('<format-content column="column" case-item="caseItem"></format-content>')(scope);
        expect(element.html()).toEqual(scope.caseItem.content);
      });

    });
  });
})();
