/* jshint camelcase: false */
'use strict';

describe('module org.bonitasoft.features.user.tasks.list.table', function() {

  var mockUser = {user_id:1, user_name:'test'};
  var mockTasks = [
    {id:1, name:'task1', assigned_id:1, selected:true},
    {id:2, name:'task2', assigned_id:1, selected:false},
    {id:3, name:'task3', assigned_id:1, selected:true},
    {id:4, name:'task4', assigned_id:'', selected:false},
    {id:5, name:'task5', assigned_id:'', selected:true}
  ];


  beforeEach(module('org.bonitasoft.features.user.tasks.list.table'));
  beforeEach(module('org.bonitasoft.portalTemplates'));
  beforeEach(module('ui.bootstrap.tpls'));
  beforeEach(module('org.bonitasoft.templates'));

  describe('User TaskList Controller', function() {
    var scope;
    var TASK_FILTERS;
    var $httpBackend;
    var createController ;

    beforeEach(inject(function($injector){
      var $rootScope = $injector.get('$rootScope');
      var $controller = $injector.get('$controller');
      $httpBackend = $injector.get('$httpBackend');

      TASK_FILTERS = $injector.get('TASK_FILTERS');

      scope = $rootScope.$new();
      scope.request = {};
      scope.updateTasks = function() {};
      scope.refreshCount = function() {};

      createController = function() {
        return  $controller('TaskUserListCtrl', {
          $scope:scope
        });
      };
    }));

    describe('canDoGroupAction', function(){
      beforeEach(function(){
        createController();
      });

      it('should return false if when taskfilter is DONE', function(){
        scope.request.taskFilter = TASK_FILTERS.DONE;
        expect(scope.canDoGroupAction()).toBe(false);
      });

      it('should return true if when taskfilter is different of DONE', function(){
        scope.request.taskFilter = TASK_FILTERS.TODO;
        expect(scope.canDoGroupAction()).toBe(true);
      });
    });

    describe('canTake', function(){
      beforeEach(function(){
        createController();
      });

      it('should return true if one of selected tasks is un_assigned', function(){
        scope.user = mockUser;
        scope.request.taskFilter = TASK_FILTERS.TODO;
        expect(scope.canTake(mockTasks)).toBe(true);
      });

      it('should return false if none of selected tasks is un_assigned', function(){
        scope.user = mockUser;
        scope.request.taskFilter = TASK_FILTERS.TODO;
        expect(scope.canTake(mockTasks.slice(0,2))).toBe(false);
      });
    });

    describe('canRelease', function(){
      beforeEach(function(){
        createController();
      });

      it('should return true if one of selected tasks is assigned', function(){
        scope.user = mockUser;
        scope.request.taskFilter = TASK_FILTERS.TODO;
        expect(scope.canRelease(mockTasks)).toBe(true);
      });

      it('should return false if none of selected tasks is assigned', function(){
        scope.user = mockUser;
        scope.request.taskFilter = TASK_FILTERS.TODO;
        expect(scope.canRelease( mockTasks.slice(-2))).toBe(false);
      });
    });
  });

  describe('task-list directive', function() {
    var element;
    var scope;
    var $httpBackend;
    var TASK_FILTERS;

    beforeEach(module(function ($provide) {
        $provide.provider('form', function () {
          this.$get = function() {
            return {
              getUrl: jasmine.createSpy('getUrl').and.returnValue('fake url')
            };
          };
        });
        $provide.provider('$location', function () {
          this.$get = function() {
            return {
              hash: jasmine.createSpy('hash')
            };
          };
        });
        $provide.provider('$anchorScroll', function () {
          this.$get = function() {
            return jasmine.createSpy('hash');
          };
        });
        $provide.provider('key', function () {
          this.$get = function() {
            return jasmine.createSpy('key');
          };
        });
      }));

    beforeEach(inject(function($injector, $compile){
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.whenGET(/features\/user\/tasks\/list\/.*\.html/gi).respond('');
      $httpBackend.whenPUT(/^\.\.\/API/).respond('');

      TASK_FILTERS = $injector.get('TASK_FILTERS');

      scope = $injector.get('$rootScope').$new();
      scope.request = $injector.get('taskRequest');

      scope.tasks = angular.copy(mockTasks);
      scope.currentTask =  mockTasks[0];
      scope.user = mockUser;
      scope.mode = 'mid';
      scope.pageSizes= [3,10];

      scope.refreshTasksHandler = function(){};
      scope.refreshCountHandler = function(){};
      scope.selectTaskHandler = function(){};
      scope.doTaskHandler = function(){};
      scope.viewTaskHandler = function(){};

      var markup =
        '<task-list tasks="tasks"'+
        '           current-task="currentTask"'+
        '           request="request"'+
        '           user="user"'+
        '           mode="mode"'+
        '           page-sizes="PAGE_SIGES"'+
        '           refresh-tasks="refreshTasksHandler()"'+
        '           refresh-count="refreshCountHandler()"'+
        '           select-task="selectTaskHandler(task)"'+
        '           do-task="doTaskHandler(task)"'+
        '           view-task="viewTaskHandler(task)">'+
        '</task-list>';
      element = $compile(markup)(scope);
      scope.$digest();
    }));

    describe('mode watch', function() {
      var cols = {};

      beforeEach(inject(function(COLUMNS_SETTINGS){
        COLUMNS_SETTINGS.small = cols.min = 'small';
        COLUMNS_SETTINGS.big = cols.mid = 'big';
      }));

      it('should update $scope.columnsSettings', function(){
        var isolated = element.isolateScope();
        scope.mode='small';
        expect(isolated.columnsSettings).toEqual(cols.small);
      });
    });

    describe('visibilityHandler', function() {
      var cols = [
        {id:'col', visible:true},
        {id:'row', visible:false}
      ];
      var pref;

      beforeEach(inject(function($injector){
        pref = $injector.get('preference');
        spyOn(pref, 'set');
      }));

      it('should persist columns settings', function(){
        var isolated = element.isolateScope();
        isolated.visibilityHandler({}, cols);
        expect(pref.set).toHaveBeenCalledWith(scope.mode, [true, false]);
      });
    });

    describe('pageSizeHandler', function(){
      it('should update request.', function(){
        var isolated = element.isolateScope();
        isolated.pageSizeHandler(500);
        expect(scope.request.pagination.numberPerPage).toEqual(500);
      });

      it('should trigger refreshTask', function(){
        spyOn(scope, 'refreshTasksHandler');
        var isolated = element.isolateScope();
        isolated.pageSizeHandler(500);
        expect(scope.refreshTasksHandler).toHaveBeenCalled();
      });
    });

    describe('selectTask', function(){
      it('should trigger onSelectTask handler', function(){
        spyOn(scope, 'selectTaskHandler');
        var isolated = element.isolateScope();
        var task = mockTasks[1];
        isolated.onClickTask(task);
        expect(scope.selectTaskHandler).toHaveBeenCalledWith(task);
      });
    });

    describe('showForm', function(){
      it('should trigger showForm handler', function(){
        spyOn(scope, 'doTaskHandler');
        var isolated = element.isolateScope();
        var task = mockTasks[1];
        isolated.onDoTask(task);
        expect(scope.doTaskHandler).toHaveBeenCalledWith(task);
      });
    });

    describe('refreshTasks', function(){
      it('should trigger refreshTasksHandler handler', function(){
        spyOn(scope, 'refreshTasksHandler');
        var isolated = element.isolateScope();
        isolated.refreshTasks();
        expect(scope.refreshTasksHandler).toHaveBeenCalled();
      });
    });

    describe('refreshCount', function(){
      it('should trigger refreshCountHandler ', function(){
        spyOn(scope, 'refreshCountHandler');
        var isolated = element.isolateScope();
        isolated.takeTasks(mockTasks);
        $httpBackend.flush();
        expect(scope.refreshCountHandler).toHaveBeenCalled();
      });
    });

    describe('refreshAll', function(){
      it('should trigger refreshCount & refreshTasks', function(){
        spyOn(scope, 'refreshCountHandler');
        spyOn(scope, 'refreshTasksHandler');
        var isolated = element.isolateScope();
        isolated.takeTasks(mockTasks);
        $httpBackend.flush();
        expect(scope.refreshCountHandler).toHaveBeenCalled();
        expect(scope.refreshTasksHandler).toHaveBeenCalled();
      });
    });


    describe('takeTasks', function(){
      var taskRegexp = /^\.\.\/API\/bpm\/humanTask/;

      beforeEach(function(){
        $httpBackend.whenPUT(taskRegexp).respond(200, {});
        scope.request.taskFilter = TASK_FILTERS.TODO;
        scope.user = mockUser;
      });

      it('should update selected tasks through a PUT API call', function(){
        $httpBackend.expectPUT(taskRegexp);
        var isolated = element.isolateScope();
        isolated.takeTasks(mockTasks);
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should unselect selected tasks', function(){
        var isolated = element.isolateScope();
        isolated.takeTasks(mockTasks);
        $httpBackend.flush();
        var unchecked = scope.tasks.some(function(task){
          return task.selected;
        });
        expect(unchecked).toBe(false);
      });

      it('should call refreshAll', function(){
        var isolated = element.isolateScope();
        spyOn(isolated, 'refreshAll');
        isolated.takeTasks(mockTasks);
        $httpBackend.flush();
        expect(isolated.refreshAll).toHaveBeenCalled();
      });
    });

    describe('ReleaseTasks', function(){
      var taskRegexp = /^\.\.\/API\/bpm\/humanTask/;

      beforeEach(function(){
        $httpBackend.whenPUT(taskRegexp).respond(200, {});
        scope.request.taskFilter = TASK_FILTERS.TODO;
        scope.user = mockUser;
      });


      it('should update selected tasks through a PUT API call', function(){
        $httpBackend.expectPUT(taskRegexp);
        var isolated = element.isolateScope();
        isolated.releaseTasks(mockTasks);
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should refresh tasks List', function(){
        var isolated = element.isolateScope();
        isolated.releaseTasks(mockTasks);
        $httpBackend.flush();
        var unchecked = scope.tasks.some(function(task){
          return task.selected;
        });
        expect(unchecked).toBe(false);
      });

      it('should call refreshAll', function(){
        var isolated = element.isolateScope();
        spyOn(isolated, 'refreshAll');
        isolated.releaseTasks(mockTasks);
        $httpBackend.flush();
        expect(isolated.refreshAll).toHaveBeenCalled();
      });

    });

    describe('goToDetail', function() {
      var $anchorScroll;
      var $location;

      beforeEach(inject(function($injector){
        $anchorScroll = $injector.get('$anchorScroll');
        $location = $injector.get('$location');
      }));

      it('should go to detail', function(){
        var isolated = element.isolateScope();
        isolated.goToDetail('details');
        expect($location.hash).toHaveBeenCalledWith('details');
        expect($anchorScroll).toHaveBeenCalled();
      });
    });

    describe('onCheckBoxChange', function() {
      var key;

      beforeEach(inject(function($injector){
        key = $injector.get('key');
      }));

      it('should select multiple task', function(){
        var innerScope = element.find('table').scope();
        //select all tasks
        innerScope.$toggleAll();

        //deselect all tasks
        innerScope.$toggleAll();

        var cb = element[0].querySelectorAll('tbody input[type="checkbox"]');

        // Select first task
        cb[0].click();
        key.shift = true;
        cb[2].click();

        var selected = innerScope.tasks.filter(function(task){ return task.selected;});
        expect(selected.length).toBe(3);
      });
    });

  });
});
