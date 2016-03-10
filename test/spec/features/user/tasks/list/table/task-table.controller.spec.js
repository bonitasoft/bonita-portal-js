/* jshint camelcase: false */
'use strict';

describe('User TaskList Controller', function() {
  var scope;
  var TASK_FILTERS;
  var $httpBackend;

  var mockUser = {user_id: 1, user_name: 'test'};
  var mockTasks = [
    {id: 1, name: 'task1', assigned_id: 1, selected: true},
    {id: 2, name: 'task2', assigned_id: 1, selected: false},
    {id: 3, name: 'task3', assigned_id: 1, selected: true},
    {id: 4, name: 'task4', assigned_id: '', selected: false},
    {id: 5, name: 'task5', assigned_id: '', selected: true}
  ];

  beforeEach(module('org.bonitasoft.features.user.tasks.list.table'));

  beforeEach(inject(function($injector) {
    var $rootScope = $injector.get('$rootScope');
    var $controller = $injector.get('$controller');
    $httpBackend = $injector.get('$httpBackend');

    TASK_FILTERS = $injector.get('TASK_FILTERS');

    scope = $rootScope.$new();
    scope.request = {};
    scope.updateTasks = function() {
    };
    scope.refreshCount = function() {
    };

    $controller('TaskTableCtrl', {
      $scope: scope
    });
  }));

  describe('canDoGroupAction', function() {
    it('should return false if when taskfilter is DONE', function() {
      scope.request.taskFilter = TASK_FILTERS.DONE;
      expect(scope.canDoGroupAction()).toBe(false);
    });

    it('should return true if when taskfilter is different of DONE', function() {
      scope.request.taskFilter = TASK_FILTERS.TODO;
      expect(scope.canDoGroupAction()).toBe(true);
    });
  });

  describe('canTake', function() {

    it('should return true if one of selected tasks is un_assigned', function() {
      scope.user = mockUser;
      scope.request.taskFilter = TASK_FILTERS.TODO;
      expect(scope.canTake(mockTasks)).toBe(true);
    });

    it('should return false if none of selected tasks is un_assigned', function() {
      scope.user = mockUser;
      scope.request.taskFilter = TASK_FILTERS.TODO;
      expect(scope.canTake(mockTasks.slice(0, 2))).toBe(false);
    });
  });

  describe('canRelease', function() {

    it('should return true if one of selected tasks is assigned', function() {
      scope.user = mockUser;
      scope.request.taskFilter = TASK_FILTERS.TODO;
      expect(scope.canRelease(mockTasks)).toBe(true);
    });

    it('should return false if none of selected tasks is assigned', function() {
      scope.user = mockUser;
      scope.request.taskFilter = TASK_FILTERS.TODO;
      expect(scope.canRelease(mockTasks.slice(-2))).toBe(false);
    });
  });

  it('should check that a task is overdue', function() {
    var taskWithNoDueDate = {};
    expect(scope.isOverdue(taskWithNoDueDate)).toBeFalsy();

    var task = { dueDate: '2545-05-12 15:27:20.323' };
    expect(scope.isOverdue(task)).toBeFalsy();

    var overduetask = { dueDate: '2016-02-24 15:27:20.323' };
    expect(scope.isOverdue(overduetask)).toBeTruthy();
  });
});
