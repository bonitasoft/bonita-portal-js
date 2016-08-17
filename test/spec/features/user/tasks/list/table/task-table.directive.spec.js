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

      scope.refreshHandler = function(){};
      scope.selectTaskHandler = function(){};
      scope.doTaskHandler = function(){};
      scope.viewTaskHandler = function(){};
      scope.counters = {
        TODO: scope.tasks.length,
        MY_TASK: 0,
        DONE: 0
      };
      scope.filter = TASK_FILTERS.TODO;

      var markup =
        '<task-table tasks="tasks"'+
        '           current-task="currentTask"'+
        '           request="request"'+
        '           user="user"'+
        '           mode="mode"'+
        '           page-sizes="PAGE_SIGES"'+
        '           refresh="refreshHandler()"'+
        '           select-task="selectTaskHandler(task)"'+
        '           do-task="doTaskHandler(task)"'+
        '           view-task="viewTaskHandler(task)"'+
        '           counters="counters"'+
        '           filter="filter">'+
        '</task-table>';
      element = $compile(markup)(scope);
      scope.$digest();
    }));

    it('should not display an empty message when there is available tasks', function() {
      expect(element.find('.alert-noresult').text().trim()).toEqual('');
    });

    it('should display a message on empty search result', function() {
      scope.tasks = [];
      scope.request.search = 'foobar';
      scope.$apply();

      expect(element.find('.alert-noresult').text().trim()).toEqual('We couldn\'t find what you are looking for.');
    });

    describe('empty message', function() {

      beforeEach(function() {
        scope.tasks = [];
        scope.counters = {
          TODO: 0,
          MY_TASK: 0,
          DONE: 0
        };
        scope.filter = TASK_FILTERS.TODO;
        scope.$apply();
      });

      it('should be displayed in Todo list when there is no task available', function() {
        expect(element.find('.alert-noresult').text().trim()).toEqual('All done. Good job!');
      });

      it('should be displayed in My Tasks list when there is no task available', function() {
        scope.filter = TASK_FILTERS.MY_TASK;
        scope.$apply();

        expect(element.find('.alert-noresult').text().trim()).toEqual('All done. Good job!');
      });

      it('should be displayed in My Tasks list when there is no personal task', function() {
        scope.filter = TASK_FILTERS.MY_TASK;
        scope.counters.TODO = 1;
        scope.$apply();

        expect(element.find('.alert-noresult').text().trim()).toEqual('Your personal task list is empty. You can take a task from the ​To do list.');
      });

      it('should be displayed in My Tasks list with a link to To do when there is no personal task', function() {
        scope.filter = TASK_FILTERS.MY_TASK;
        scope.counters.TODO = 1;
        scope.$apply();

        element.find('.alert-noresult a').click();
        scope.$apply();

        expect(scope.filter).toEqual(TASK_FILTERS.TODO);
      });

      it('should be displayed in Done Tasks list when there is no task done', function() {
        scope.filter = TASK_FILTERS.DONE;
        scope.$apply();

        expect(element.find('.alert-noresult').text().trim()).toEqual('No done task yet.');
      });
    });

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

      it('should trigger refresh', function(){
        spyOn(scope, 'refreshHandler');
        var isolated = element.isolateScope();
        isolated.pageSizeHandler(500);
        expect(scope.refreshHandler).toHaveBeenCalled();
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

      it('should trigger onSelectTask and doTask handlers when in max mode', function() {
        spyOn(scope, 'doTaskHandler');
        spyOn(scope, 'selectTaskHandler');
        var isolated = element.isolateScope();
        var task = mockTasks[1];
        isolated.mode = 'max';
        isolated.onClickTask(task);
        expect(scope.doTaskHandler).toHaveBeenCalledWith(task);
        expect(scope.selectTaskHandler).toHaveBeenCalledWith(task);
      });
    });

    describe('refresh', function(){
      it('should trigger refreshHandler handler', function(){
        spyOn(scope, 'refreshHandler');
        var isolated = element.isolateScope();
        isolated.refresh();
        expect(scope.refreshHandler).toHaveBeenCalled();
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

      it('should call refresh', function(){
        var isolated = element.isolateScope();
        spyOn(isolated, 'refresh');
        isolated.takeTasks(mockTasks);
        $httpBackend.flush();
        expect(isolated.refresh).toHaveBeenCalled();
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

      it('should unselect selected tasks', function(){
        var isolated = element.isolateScope();
        isolated.releaseTasks(mockTasks);
        $httpBackend.flush();
        var unchecked = scope.tasks.some(function(task){
          return task.selected;
        });
        expect(unchecked).toBe(false);
      });

      it('should call refresh', function(){
        var isolated = element.isolateScope();
        spyOn(isolated, 'refresh');
        isolated.releaseTasks(mockTasks);
        $httpBackend.flush();
        expect(isolated.refresh).toHaveBeenCalled();
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
