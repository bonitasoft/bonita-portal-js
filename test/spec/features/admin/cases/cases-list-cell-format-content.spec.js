(function () {
  'use strict';

  describe('Factory: contentFactory', function() {

    var  factory, opt;

    beforeEach(module('org.bonita.features.admin.cases.list.formatContent', function ($provide) {
      $provide.decorator('gettextCatalog', function ($delegate) {
        $delegate.getString = function (str) {
          return str;
        };

        return $delegate;
      });

      $provide.decorator('manageTopUrl', function ($delegate) {
        $delegate.getPath = function() {
          return '/bonita';
        };

        $delegate.getSearch = function() {
          return '';
        };

        $delegate.getCurrentProfile = function() {
          return 'pf=2';
        };
        return $delegate;
      });
    }));

    beforeEach(inject(function ($rootScope, $injector) {
      factory = $injector.get('contentFactory');
    }));

    describe('Generate a link for a process', function() {
      beforeEach(function() {
        opt = {
          col: {linkToProcess : true, name : 'ProcessName'},
          caseItem: {id : 123, processDefinitionId :{ id : 123}, 'ProcessName' : 'testApp' },
          processManager: '1'
        };
      });

      it('should set link to pm when supervisor is set', function(){
        expect(factory.load(opt)).toEqual('<a id="case-process-link-123" target="_top" href="/bonita#?id=123&_p=processmoredetailspm&pf=2">testApp</a>');
      });

      it('should set link to admin when supervisor is not set', function(){
        opt.processManager = '0';
        expect(factory.load(opt)).toEqual('<a id="case-process-link-123" target="_top" href="/bonita#?id=123&_p=processmoredetailsadmin&pf=2">testApp</a>');
      });

      it('should set link to admin when supervisor is undefined', function(){

        delete opt.processManager;
        expect(factory.load(opt)).toEqual('<a id="case-process-link-123" target="_top" href="/bonita#?id=123&_p=processmoredetailsadmin&pf=2">testApp</a>');
      });
    });

    describe('Define the content a column with warning on case error', function() {

      it('should set content to flow node counter with tooltip and warning glyphicon', function(){
        opt = {
          col: {name : 'failedFlowNodes', warn : true},
          caseItem: {'failedFlowNodes' : '3', fullCase : {state : 'error'}}
        };
        expect(factory.load(opt)).toEqual('<span tooltip="{{\'One or more connectors on case start or case end failed\' | translate}}" tooltip-animation="false" tooltip-popup-delay="500" class="alert-error glyphicon glyphicon-exclamation-sign"></span> '+opt.caseItem.failedFlowNodes);
      });

      it('should set content to flow node counter when case not in error', function(){
        opt = {
          col: {name : 'failedFlowNodes', warn : true},
          caseItem: {'failedFlowNodes' : '3'}
        };
        expect(factory.load(opt)).toEqual(opt.caseItem.failedFlowNodes);
      });

      it('should set content to flow node counter when column is not in warn state and case in error', function(){
        opt = {
          col: {name : 'failedFlowNodes'},
          caseItem: {'failedFlowNodes' : '3', fullCase : {state : 'error'}}
        };
        expect(factory.load(opt)).toEqual(opt.caseItem.failedFlowNodes);
      });

      it('should set content to flow node counter when state is ok and no warn on column', function(){
        opt = {
          col: {name : 'failedFlowNodes'},
          caseItem: {'failedFlowNodes' : '3'}
        };
        expect(factory.load(opt)).toEqual(opt.caseItem.failedFlowNodes);
      });

    });

    describe('Define the content for a caseItem', function() {
      beforeEach(function() {
        opt = {
          col: {name : 'ProcessName'},
          caseItem: {'ProcessName' : 'testApp',defaultValue : 'System'}
        };
      });

      it('should set content to caseItem contents', function(){
        expect(factory.load(opt)).toEqual(opt.caseItem.ProcessName);
      });

      it('should set content to column default value when caseItem contents is empty', function(){
        opt.col = {};
        expect(factory.load(opt)).toEqual(opt.col.defaultValue);
      });

    });

    describe('Format a date', function() {

      beforeEach(function() {
        opt = {
          col: {name : 'content', date : true},
          caseItem: {processDefinitionId :{ id : 123} , content : 'test'}
        };
      });

      it('should not format date when data is not in the right format', function(){
        expect(factory.load(opt)).toEqual(opt.caseItem.content);
      });

      it('should format date', function(){
        opt.caseItem.content = '2014-10-17 16:05:42.626';
        expect(factory.load(opt)).toEqual('10/17/2014 4:05 PM');
      });

    });

    describe('Define the template for a popover', function() {

      beforeEach(function() {
        opt = {
          col: {name: 'name', popover: true},
          caseItem: {name: 'jean'}
        };
      });

      it('should return a template with the valid name if the key exist', function() {
        expect(factory.load(opt)).toBe('<span class="badge">jean</span>');
      });

      it('should return a template with the valid name if the key does not exist', function() {
        delete opt.caseItem.name;
        expect(factory.load(opt)).toBe('<span class="badge"></span>');
      });

    });


    describe('Define the template for a case link', function() {

      beforeEach(function() {
        opt = {
          col: {linkToCase : true, name : 'CaseName'},
          caseItem: {id : 123, processDefinitionId :{ id : 123}, CaseName : 'testApp' },
          moreDetailToken: '42'
        };
      });

      it('should set the link', function(){
        expect(factory.load(opt)).toEqual('<a id="case-detail-link-123" target="_top" href="/bonita#?id=123&_p=42&pf=2">testApp</a>');
      });

      it('should set link without token if it is undefined', function(){

        delete opt.moreDetailToken;
        expect(factory.load(opt)).toEqual('<a id="case-detail-link-123" target="_top" href="/bonita#?id=123&_p=&pf=2">testApp</a>');
      });
    });

  });


  describe('format column content directive', function () {

    var scope, compile, contentFactory;

    describe('formatContent directive only', function () {

      beforeEach(module('org.bonita.features.admin.cases.list.formatContent'));

      beforeEach(inject(function ($rootScope, $compile, $injector) {
        scope          = $rootScope.$new();
        compile        = $compile;
        contentFactory = $injector.get('contentFactory');
        spyOn(contentFactory,'load');
      }));


      it('should not format data', function () {
        scope.column = {name: 'caseItem'};
        scope.caseItem = {caseItem: 'test'};
        var element = compile('<format-content column="{{column}}" case-item="{{caseItem}}"></format-content>')(scope);
        scope.$digest();

        // Set HTML from the dircetive does not seems to be load
        element.html('test');
        expect(element.html()).toEqual('test');
      });

      it('should call the factory on render', function() {
        scope.column = {name: 'caseItem'};
        scope.caseItem = {caseItem: 'test'};
        compile('<format-content column="{{column}}" case-item="{{caseItem}}"></format-content>')(scope);
        scope.$apply();

        expect(contentFactory.load).toHaveBeenCalledWith({
          col: {name: 'caseItem'},
          caseItem: {caseItem: 'test'},
          moreDetailToken: void 0,
          processManager: void 0
        });
      });

    });


  });
})();
