'use strict';
/* jshint camelcase: false */

describe('directive no.form', function() {

  var mockUser = {user_id:123, user_name:'test'};
  var mockTask =  {id:1, name:'task1', selected:true, processId: 42, parentCaseId: 12} ;

  var $httpBackend;
  var $window;
  var $q;
  var promise;
  var taskListStore;
  var element;
  var scope;
  var userTaskAPI;
  var humanTaskAPI;
  var commentAPI;
  var compiledElement;

  beforeEach(module('org.bonitasoft.features.user.tasks.details'));
  beforeEach(module('org.bonitasoft.portalTemplates'));
  beforeEach(module('ui.bootstrap.tpls'));

  beforeEach(inject(function($injector, $compile){
    taskListStore = $injector.get('taskListStore');
    taskListStore.user = mockUser;

    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET(/portalTemplates\/user\/tasks\/list\/.*\.html/gi).respond('');

    $window = $injector.get('$window');
    $q = $injector.get('$q');
    promise = $q.defer();

    var $rootScope = $injector.get('$rootScope');
    scope = $rootScope.$new();

    humanTaskAPI = $injector.get('humanTaskAPI');
    spyOn(humanTaskAPI,'update').and.returnValue({
      $promise: promise.promise
    });
    userTaskAPI = $injector.get('userTaskAPI');
    spyOn(userTaskAPI,'execute').and.returnValue(
      promise.promise
    );
    commentAPI = $injector.get('commentAPI');
    spyOn(commentAPI,'save').and.returnValue({
      $promise: promise.promise
    });

    scope.currentTask = mockTask;
    scope.inactive = false;
    scope.editable = true;
    scope.refreshAll = jasmine.createSpy('refreshAll');

    var markup =
      '  <no-form' +
      '        current-task="currentTask"' +
      '        refresh-all="refreshAll()"' +
      '        editable="editable"' +
      '        inactive="inactive">' +
      '  </no-form>';

    element = angular.element(markup);

    compiledElement = $compile(element)(scope);

    scope.$digest();
  }));

  it('should call add comment', function(){

    scope.currentTask.comment = 'comment';

    var isolated = compiledElement.isolateScope();
    isolated.onExecuteTask();

    expect(commentAPI.save).toHaveBeenCalledWith({userId: 123, processInstanceId: 12, content: scope.currentTask.comment}, jasmine.any(Function), jasmine.any(Function));
  });

  it('should not call add comment if empty', function(){

    scope.currentTask.comment = '';

    var isolated = compiledElement.isolateScope();
    isolated.onExecuteTask();

    expect(commentAPI.save).not.toHaveBeenCalled();
  });

  it('should execute task', function(){

    var isolated = compiledElement.isolateScope();
    isolated.onExecuteTask();

    expect(userTaskAPI.execute).toHaveBeenCalledWith(mockTask.id, {});
  });

  it('should execute manual task', function(){

    mockTask.type = 'MANUAL_TASK';

    var isolated = compiledElement.isolateScope();
    isolated.onExecuteTask();

    expect(humanTaskAPI.update).toHaveBeenCalledWith({id: scope.currentTask.id, state: 'completed', executedBy: taskListStore.user.user_id}, jasmine.any(Function), jasmine.any(Function));
  });

});
