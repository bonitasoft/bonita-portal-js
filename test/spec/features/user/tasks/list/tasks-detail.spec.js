'use strict';
/* jshint camelcase: false */

describe('module tasks.details', function() {

  var mockUser = {user_id:123, user_name:'test'};
  var mockTask =  {id:1, name:'task1', selected:true, processId: 42} ;
  var mockCase = {
    id:77,
    state:'started',
    processDefinitionId: {
      version: '1.1.1',
      name: 'TastCase'
    }
  };

  var $httpBackend;
  var store;

  //var FORM_URL = 'http://form.url';

  beforeEach(module('org.bonitasoft.features.user.tasks.details'));
  beforeEach(module('org.bonitasoft.portalTemplates'));
  beforeEach(module('ui.bootstrap.tpls'));

  beforeEach(inject(function($injector){
    store = $injector.get('taskListStore');
    spyOn(store, 'user').and.returnValue(mockUser);

    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET(/portalTemplates\/user\/tasks\/list\/.*\.html/gi).respond('');
  }));

  describe('TaskDetailsHelper', function(){
    var service;
    var preference;

    beforeEach( inject(function( $injector) {
      preference = $injector.get('preference');


      spyOn(preference, 'get').and.returnValue('form');
      spyOn(preference, 'set');

      service = $injector.get('taskDetailsHelper');
    }));

    it('should retrieve lastUsed tab', function(){
      var scope = {
        tab: {
          context: false,
          form: false
        }
      };
      service.initTab(scope);
      expect(scope.tab.form).toEqual(true);
    });

    it('saveSelectedTab', function(){
      service.saveSelectedTab('toto');
      expect(preference.set).toHaveBeenCalledWith('lastTab', 'toto',  true);
    });

    describe('takeTask', function(){
      it('should make a put on HumanTask API', function() {
        $httpBackend.whenPUT(/^\.\.\/API\/bpm\/humanTask/).respond({assigned_id:123});
        $httpBackend.expectPUT(/^\.\.\/API\/bpm\/humanTask/);

        service.takeReleaseTask(mockTask);
        $httpBackend.flush();
        expect(mockTask.assigned_id).toBe(123);

        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });
    });
  });

  describe('task-details directive', function(){
    var element;
    var scope;
    var iframe;
    var processAPI;
    var $q;
    var promise;

    beforeEach(inject(function($injector){
      $httpBackend = $injector.get('$httpBackend');
      $q = $injector.get('$q');
      iframe = $injector.get('iframe');

      promise = $q.defer();

      spyOn(iframe, 'getTaskForm').and.returnValue('/base/fixtures/form.html');
      spyOn(iframe, 'getCaseOverview').and.returnValue('/base/fixtures/form.html');

      // spy taskDetailHelper
      var taskDetailsHelper = $injector.get('taskDetailsHelper');
      spyOn(taskDetailsHelper, 'takeReleaseTask').and.callFake(function(){
        var defered = $q.defer();
        defered.resolve({assigned_id: mockUser.user_id});
        return defered.promise;
      });
    }));

    beforeEach(inject(function($compile, $rootScope, $document, $injector){
      scope = $rootScope.$new();

      processAPI = $injector.get('processAPI');
      spyOn(processAPI,'get').and.returnValue({
        $promise: promise.promise
      });


      scope.currentCase = mockCase;
      scope.currentTask = mockTask;
      scope.inactive = false;
      scope.editable = true;
      scope.refreshCountHandler = jasmine.createSpy('refresh');
      scope.hideFormHandler = jasmine.createSpy('hideForm');

      var markup =
        '  <task-details current-task="currentTask"' +
        '        current-case="currentCase"' +
        '        refresh="refreshCountHandler()"' +
        '        editable="editable"' +
        '        hide-form="hideFormHandler()"' +
        '        inactive="inactive">' +
        '  </task-details>';


      element = $compile(markup)(scope);

      // use to ensure iframe dom loading
      $document.find('body').append(element);
      scope.$digest();
    }));

    it('should bind param to scope', function(){
      element.isolateScope();
      // expect(isolated.currentTask).toEqual(mockTask);

      // scope.currentCase = mockCase;
      // scope.$digest();
      // expect(isolated.currentCase).toEqual(mockCase);
      expect(processAPI.get).toHaveBeenCalledWith({id: 42});
    });

    // it('should remove children when tab is inactive', function(){
    //   var contextTab = element[0].querySelectorAll('.tab-pane.active');

    //   expect(contextTab[0].children.length).toBe(1);

    //   scope.inactive = true;
    //   scope.$digest();
    //   expect(contextTab[0].children.length).toBe(0);
    // });

    // it('should update formUrl when store.currentCase change', function(){
    //   scope.currentCase = mockCase;
    //   spyOn(iframe, 'getTaskForm').and.returnValue(FORM_URL);

    //   scope.$digest();

    //   expect(scope.formUrl).toBe(FORM_URL);
    // });


    // describe('onTakeReleaseTask', function(){
    //   it('should call controller takeReleaseTask', function(){
    //     var isolated = element.isolateScope();
    //     isolated.onTakeReleaseTask();
    //     expect(ctrl.takeReleaseTask).toHaveBeenCalled();
    //   });
    // });

  });
});
