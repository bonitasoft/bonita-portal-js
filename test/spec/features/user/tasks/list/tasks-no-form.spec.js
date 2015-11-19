'use strict';
/* jshint camelcase: false */

describe('directive no.form', function() {

  var mockUser = {user_id:123, user_name:'test'};
  var mockTask =  {id:1, name:'task1', selected:true, processId: 42, parentCaseId: 12} ;

  var $httpBackend;
  var $window;
  var store;
  var element;
  var scope;
  var userTaskAPI;
  var humanTaskAPI;
  var commentAPI;
  var compiledElement;

  beforeEach(module('org.bonitasoft.features.user.tasks.details'));
  beforeEach(module('org.bonitasoft.portalTemplates'));
  beforeEach(module('ui.bootstrap.tpls'));

  beforeEach(inject(function($injector){
    store = $injector.get('taskListStore');
    spyOn(store, 'user').and.returnValue(mockUser);

    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET(/portalTemplates\/user\/tasks\/list\/.*\.html/gi).respond('');

    $window = $injector.get('$window');

    var $rootScope = $injector.get('$rootScope');
    scope = $rootScope.$new();

    var $compile = $injector.get('$compile');

    humanTaskAPI = $injector.get('humanTaskAPI');
    spyOn(humanTaskAPI,'update');
    userTaskAPI = $injector.get('userTaskAPI');
    spyOn(userTaskAPI,'execute');
    userTaskAPI = $injector.get('commentAPI');
    spyOn(commentAPI,'save');

    scope.currentTask = mockTask;
    scope.inactive = false;
    scope.editable = true;
    scope.hasForm = false;
    scope.refreshAll = jasmine.createSpy('refreshAll');

    var markup =
      '  <no-form' +
      '        current-task="currentTask"' +
      '        refresh-all="refreshAll()"' +
      '        editable="editable"' +
      '        has-form="hasForm"' +
      '        inactive="inactive">' +
      '  </no-form>';

    element = angular.element(markup);

    compiledElement = $compile(element)(scope);

    scope.$digest();
  }));

  xit('should execute task', function(){

    var isolated = compiledElement.isolateScope();

    isolated.onExecuteTask();

    expect(commentAPI.save).toHaveBeenCalledWith({userId: 123, processInstanceId: 12, content: ''});
  });

});
