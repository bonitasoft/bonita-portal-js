(function() {

  'use strict';

  describe('Task details controller', () => {

    let taskListStore, taskDetailsHelper, processAPI, formMappingAPI, controller, scope, $q, $rootScope;

  beforeEach(module('org.bonitasoft.features.user.tasks.details'));

  beforeEach(inject(function(_taskListStore_, _taskDetailsHelper_, _processAPI_, _formMappingAPI_, $controller, _$q_, _$rootScope_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    taskListStore = _taskListStore_;
    taskListStore.user = {id: 1};
    processAPI = _processAPI_;
    spyOn(processAPI, 'get').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve({id: 42});
      return {
        $promise: deferred.promise
      };
    });
    formMappingAPI = _formMappingAPI_;
    spyOn(formMappingAPI, 'search').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve({resource: {0: {target: 'INTERNAL'}, pagination: {total: 1}}});
      return {
        $promise: deferred.promise
      };
    });
    taskDetailsHelper = _taskDetailsHelper_;
    spyOn(taskDetailsHelper, 'takeReleaseTask').and.callFake(function(task) {
      var deferred = $q.defer();
      /*jshint camelcase: false*/
      if (task.assigned_id === '') {
        task.assigned_id = taskListStore.user.id.toString();
      } else {
        task.assigned_id = '';
      }
      deferred.resolve();
      return deferred.promise;
    });
    scope = $rootScope.$new();
    scope.currentTask = {id: 1, name: 'task1', selected: true, processId: 42, type: 'USER_TASK'};
    scope.refresh = jasmine.createSpy();
    controller = $controller('TaskDetailsCtrl', {
      taskDetailsHelper: taskDetailsHelper,
      $scope: scope
    });
  }));

  it('should refresh when taking the task', function() {
    /*jshint camelcase: false*/
    scope.currentTask.assigned_id = '';
    scope.onTakeReleaseTask();
    $rootScope.$apply();
    expect(scope.refresh).toHaveBeenCalled();
  });

  it('should refresh when releasing the task', function() {
    /*jshint camelcase: false*/
    scope.currentTask.assigned_id = taskListStore.user.id.toString();
    scope.onTakeReleaseTask();
    $rootScope.$apply();
    expect(scope.refresh).toHaveBeenCalled();
  });

  it('should not check mapping when the current task did not change', function() {
    /*jshint camelcase: false*/
    $rootScope.$apply();
    var formMappingCalls = formMappingAPI.search.calls.count();
    scope.currentTask = {id: 1, name: 'task1', selected: false, processId: 42, type: 'USER_TASK'};
    $rootScope.$apply();
    expect(formMappingAPI.search.calls.count()).toBe(formMappingCalls);
  });

  it('should check mapping when the current task changes', function() {
    /*jshint camelcase: false*/
    $rootScope.$apply();
    var formMappingCalls = formMappingAPI.search.calls.count();
    scope.currentTask = {id: 2, name: 'task2', selected: true, processId: 42, type: 'USER_TASK'};
    $rootScope.$apply();
    expect(formMappingAPI.search.calls.count()).toBe(formMappingCalls + 1);
  });

  it('should select form tab by default', () => {

    expect(scope.tab).toEqual({
      form: {loaded: true, active: true},
      comments: {loaded: false, active: false},
      context: {loaded: false, active: false}
    });
  });

  it('should reset tabs state and select form tab when selected task change', () => {
    scope.tab = {
      form: {loaded: true, active: false},
      comments: {loaded: true, active: true},
      context: {loaded: true, active: false}
    };

    scope.currentTask = {};
    scope.$apply();

    expect(scope.tab).toEqual({
      form: {loaded: true, active: true},
      comments: {loaded: false, active: false},
      context: {loaded: false, active: false}
    });
  });
});

})();


