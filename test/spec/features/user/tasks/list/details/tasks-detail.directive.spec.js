'use strict';
/* jshint camelcase: false */

describe('task-details directive', () => {

  var mockUser = {user_id: 123, user_name: 'test'};
  var mockTask = {id: 1, name: 'task1', selected: true, processId: 42, type: 'USER_TASK'};
  var mockCase = {
    id: 77,
    state: 'started',
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

  beforeEach(inject(function($injector, $state) {
    store = $injector.get('taskListStore');
    spyOn(store, 'user').and.returnValue(mockUser);

    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET(/portalTemplates\/user\/tasks\/list\/.*\.html/gi).respond('');
    spyOn($state, 'transitionTo');
  }));


  var element, compile;
  var scope;
  var iframe;
  var processAPI;
  var formMappingAPI;
  var $q;
  var FORM_URL = '/base/fixtures/form.html';
  var TASK_FILTERS;

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $q = $injector.get('$q');
    iframe = $injector.get('iframe');
    TASK_FILTERS = $injector.get('TASK_FILTERS');

    spyOn(iframe, 'getTaskForm').and.returnValue(FORM_URL);
    spyOn(iframe, 'getCaseOverview').and.returnValue(FORM_URL);

    // spy taskDetailHelper
    var taskDetailsHelper = $injector.get('taskDetailsHelper');
    spyOn(taskDetailsHelper, 'takeReleaseTask').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve({assigned_id: mockUser.user_id});
      return deferred.promise;
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $document, $injector) {
    scope = $rootScope.$new();
    compile = $compile;
    processAPI = $injector.get('processAPI');
    spyOn(processAPI, 'get').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve({id: 42});
      return {
        $promise: deferred.promise
      };
    });
    formMappingAPI = $injector.get('formMappingAPI');
    spyOn(formMappingAPI, 'search').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve({resource: {0: {target: 'INTERNAL'}, pagination: {total: 1}}});
      return {
        $promise: deferred.promise
      };
    });

    scope.currentCase = mockCase;
    scope.currentTask = mockTask;
    scope.inactive = false;
    scope.editable = true;
    scope.refreshCountHandler = jasmine.createSpy('refresh');
    scope.hideFormHandler = jasmine.createSpy('hideForm');

    var markup =
      '  <task-details ' +
      '        current-task="currentTask"' +
      '        current-case="currentCase">' +
      '  </task-details>';


    element = $compile(markup)(scope);

    // use to ensure iframe dom loading
    $document.find('body').append(element);
    scope.$digest();
  }));

  it('should getProcess', function() {

    element.isolateScope();

    expect(processAPI.get).toHaveBeenCalledWith({id: 42});
  });

  it('should remove case tab content when there are no tasks in list', function() {
    element.find('#case-tab > a').click();
    var contextTab = element[0].querySelectorAll('.tab-pane.active');

    store.tasks = [{id: 4}];
    scope.$apply();
    expect(contextTab[0].children.length).toBe(1);

    store.tasks = [];
    scope.$digest();
    expect(contextTab[0].children.length).toBe(0);
  });

  it('should update formUrl', function() {

    var isolatedScope = element.isolateScope();

    expect(isolatedScope.formUrl).toBe(FORM_URL);
  });

  it('should set showToolbar property to false when openDetailsPopup attribute is not set', function() {
    element = compile('<task-details></task-details>')(scope);
    scope.$apply();

    expect(element.isolateScope().showToolbar).toBeFalsy();
  });

  it('should set showToolbar property to true when openDetailsPopup attribute is set', function() {
    scope.openDetailsPopup = function() {

    };
    element = compile('<task-details open-details-popup="openDetailsPopup"></task-details>')(scope);
    scope.$apply();

    expect(element.isolateScope().showToolbar).toBeTruthy();
  });

  it('should display task form when changing current task', function() {
    var isolatedScope = element.isolateScope();
    element.find('#comments-tab a').click();

    scope.currentTask = {};
    scope.$apply();

    expect(isolatedScope.tab).toEqual({
      form: true,
      comments: false,
      context: false
    });
  });

  fit('should not allow to toggle assignation when displaying done tasks', function() {
    element.isolateScope().showToolbar = true;
    store.request.taskFilter = TASK_FILTERS.DONE;
    scope.$apply();

    var buttons = element.find('.Toolbar-button');

    expect(buttons.text().trim()).toEqual("Open in a popup");
  });
});
