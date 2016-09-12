/* jshint camelcase:false */
'use strict';

describe('taskApp', function(){


  /* mock data */
  var mockUser = {user_id:123, user_name:'test'};
  var mockTasks = [
    {id:1, name:'task1', assigned_id:1, selected:true, rootContainerId:{ id: 987}},
    {id:2, name:'task2', assigned_id:1, selected:false, rootContainerId:{ id: 987}},
    {id:3, name:'task3', assigned_id:1, selected:true, rootContainerId:{ id: 987}},
    {id:4, name:'task4', assigned_id:'', selected:false, rootContainerId:{ id: 987}},
    {id:5, name:'task5', assigned_id:'', selected:true, rootContainerId:{ id: 987}}
  ];
  var mockCase = {id:77, state:'started'};

  var mockProcesses = [
    {id:'11111', name:'process1'},
    {id:'22222', name:'process2'},
    {id:'33333', name:'process2'}
  ];

  var mockCount = {
    TODO:20,
    MY_TASK:10,
    POOL_TASK:10
  };



  describe('taskApp controller', function(){
    var scope;
    var controller;

    var $q, location;
    var preference, taskFilters;

    beforeEach(module('org.bonitasoft.features.user.tasks.app'));

    beforeEach(inject(function($injector){
      $q = $injector.get('$q');
      preference = $injector.get('preference');
    }));


    /* mock store */
    beforeEach(inject(function(taskListStore){
      var store = taskListStore;
      function getTasks(){
        var defered = $q.defer();
        defered.resolve(mockTasks);
        store.tasks = mockTasks;
        store.currentTask = mockTasks[0];
        return defered.promise;
      }

      function getDefered(data, prop ){
        return function() {
          var defered = $q.defer();
          defered.resolve(data);
          store[prop] = data;
          return defered.promise;
        };
      }

      spyOn(store, 'countAll').and.callFake(getDefered(mockCount, 'count'));
      spyOn(store, 'getProcessList').and.callFake(getDefered(mockProcesses, 'processes'));
      spyOn(store, 'getTasks').and.callFake(getTasks);
      spyOn(store, 'getCaseInfo').and.callFake(getDefered(mockCase, 'currentCase'));
    }));

    /* screen mock */
    beforeEach(inject(function(screen){
      screen.size = {name: 'lg'};
      spyOn(screen, 'on').and.callFake(function(){});
    }));

    /* modal mock */
    beforeEach(inject(function($modal){
      var fakeModal = {
        result: {
          then: function(confirmCallback, cancelCallback) {
            //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
            this.confirmCallBack = confirmCallback;
            this.cancelCallback = cancelCallback;
          }
        },

        dismiss: function( type ) {
          //The user clicked cancel on the modal dialog, call the stored cancel callback
          this.result.cancelCallback( type );
        }
      };
      spyOn($modal, 'open').and.returnValue(fakeModal);
    }));


    /* Init controller */
    beforeEach(inject(function($controller, $rootScope, _TASK_FILTERS_) {
      scope = $rootScope.$new();
      location = jasmine.createSpyObj('$location', ['search']);
      taskFilters = _TASK_FILTERS_;
      controller = $controller('TaskAppCtrl', {$location: location});
    }));


    describe('init', function(){

      /* mocking session resource */
      beforeEach(inject(function(sessionAPI, $q){
        var defered = $q.defer();
        defered.resolve();

        var result = angular.extend({}, mockUser, {
          $promise: defered.promise
        });

        spyOn(sessionAPI, 'get').and.returnValue( result );

      }));

      // Add spy on controller
      beforeEach(function(){
        // used for session resource mocking
        spyOn(controller, 'updateTasks');
        spyOn(controller, 'updateProcessList');
        spyOn(controller, 'updateCount');
      });

      it('should fetch connected user', function(){

        spyOn(controller, 'setFilter');
        controller.init();
        scope.$digest();

        expect(controller.user).toBeDefined();
        expect(controller.user).toEqual(jasmine.objectContaining(mockUser));
        expect(controller.updateTasks).toHaveBeenCalled();
        expect(controller.updateProcessList).toHaveBeenCalled();
        expect(controller.updateCount).toHaveBeenCalled();
        expect(location.search).toHaveBeenCalled();
        expect(controller.setFilter).not.toHaveBeenCalled();
      });

      it('should fetch connected user and set filter to DONE tasks', function(){
        controller.search = {filter: 'done'};
        spyOn(controller, 'setFilter');
        controller.init();
        scope.$digest();

        expect(controller.user).toBeDefined();
        expect(controller.user).toEqual(jasmine.objectContaining(mockUser));
        expect(controller.updateTasks).toHaveBeenCalled();
        expect(controller.updateProcessList).toHaveBeenCalled();
        expect(controller.updateCount).toHaveBeenCalled();
        expect(controller.setFilter).toHaveBeenCalledWith(taskFilters.DONE);
      });
    });

    describe('setFilter', function(){
      var filter;
      var store;

      beforeEach(inject(function($injector){
        store = $injector.get('taskListStore');
        store.processes = [{id:false, name:'All'}];

        filter = {name:'filter name', id:'filter'};
      }));

      it('should assign a new filter', function(){
        controller.setFilter(filter);
        expect(store.request.taskFilter).toEqual(filter);
      });

    });

    describe('changeFilter', function(){
      var filter;
      var store;

      beforeEach(inject(function($injector){
        store = $injector.get('taskListStore');
        store.processes = [{id:false, name:'All'}];

        filter = {name:'filter name', id:'filter'};

        spyOn(controller, 'setFilter');
        spyOn(controller, 'updateProcessList');
      }));

      it('should set a new filter', function(){
        controller.changeFilter(filter);
        expect(controller.setFilter).toHaveBeenCalledWith(filter);
      });

      it('should update process list', function(){
        controller.changeFilter(filter);
        expect(controller.updateProcessList).toHaveBeenCalled();
      });

      it('should reset pagination', function(){
        store.request.pagination.currentPage = 2;
        controller.changeFilter(filter);
        expect(store.request.pagination.currentPage).toEqual(1);
      });
    });

    describe('setProcess', function(){
      var process;
      var store;

      beforeEach(inject(function($injector){
        store = $injector.get('taskListStore');
        store.processes = [{id:false, name:'All'}];

        process = {id:1};
      }));

      it('should reset pagination', function(){
        store.request.pagination.currentPage = 2;
        controller.setProcess(process);
        expect(store.request.pagination.currentPage).toEqual(1);
      });
    });

    describe('selectTask', function(){
      var store;
      var task =

      beforeEach(inject(function($injector){
        store = $injector.get('taskListStore');

        task = Object.keys(mockTasks[0]).reduce(function(o, key){
          o[key] = mockTasks[0][key];
          return o;
        }, {rootContainerId:{id:987}});

      }));

      it('should set currentTask in store and scope', function(){
        controller.selectTask(task);
        expect(store.currentTask).toBe(task);
        expect(store.currentTask).toBe(controller.currentTask);
        expect(store.currentTask.selected).toBe(true);
        expect(controller.currentTask.selected).toBe(true);
      });

      it('should request case info', function(){
        controller.selectTask(task);
        expect(store.getCaseInfo).toHaveBeenCalled();
      });

      it('should attach case to scope and store', function(){
        controller.selectTask(task);
        scope.$digest();
        expect(store.currentCase).toBeDefined();
        expect(store.currentCase).toEqual(controller.currentCase);
        expect(store.currentCase).toEqual(jasmine.objectContaining(mockCase));
      });
    });

    describe('updateTasks', function(){
      var store;

      beforeEach(inject(function($injector){
        store = $injector.get('taskListStore');
      }));

      it('should request tasks list', function(){
        controller.updateTasks();
        expect(store.getTasks).toHaveBeenCalled();
      });

      it('should attach tasks to scope', function(){
        controller.updateTasks();
        scope.$digest();
        expect(controller.tasks).toEqual(store.tasks);
        expect(controller.tasks).toEqual(mockTasks);
      });

      it('should select the first task', function(){
        controller.updateTasks();
        scope.$digest();
        expect(controller.currentTask).toEqual(store.currentTask);
        expect(controller.currentTask).toEqual(mockTasks[0]);
      });

      it('should request Case related info', function(){
        controller.updateTasks();
        scope.$digest();
        expect(store.getCaseInfo).toHaveBeenCalled();
        expect(controller.currentCase).toEqual(store.currentCase);
        expect(controller.currentCase).toEqual(mockCase);
      });
    });

    describe('updateCount', function(){
      var store;

      beforeEach(inject(function($injector){
        store = $injector.get('taskListStore');
      }));

      it('should set count value', function(){
        controller.updateCount();
        scope.$digest();
        expect(controller.count).toEqual({TODO:20,MY_TASK:10,POOL_TASK:10});
      });
    });

    describe('updateAll', function(){
      it('should trigger updateProcessList, updateTasks & updateCount', function(){
        spyOn(controller, 'updateTasks');
        spyOn(controller, 'updateCount');
        spyOn(controller, 'updateProcessList');

        controller.updateAll();
        expect(controller.updateProcessList).toHaveBeenCalled();
        expect(controller.updateCount).toHaveBeenCalled();
        expect(controller.updateTasks).toHaveBeenCalled();
      });
    });

    describe('searchTask', function(){
      var store;

      beforeEach(inject(function($injector){
        store = $injector.get('taskListStore');
      }));

      it('should trigger updateTasks', function(){
        spyOn(controller, 'updateTasks');

        controller.searchTask();
        expect(controller.updateTasks).toHaveBeenCalled();
      });

      it('should reset pagination', function(){
        store.request.pagination.currentPage = 2;
        controller.searchTask();
        expect(store.request.pagination.currentPage).toEqual(1);
      });
    });

    describe('updateProcessList', function(){
      var store;

      beforeEach(inject(function($injector){
        store = $injector.get('taskListStore');
      }));

      it('should request processList', function(){
        controller.updateProcessList();
        expect(store.getProcessList).toHaveBeenCalled();
      });

      it('should attach process to scope and store', function(){
        controller.updateProcessList();
        scope.$digest();
        expect(store.processes).toBeDefined();
        expect(store.processes).toEqual(controller.processes);
        expect(store.processes).toEqual(mockProcesses);
      });
    });

    describe('onScreenChange', function() {
      beforeEach(inject(function(screen){
        screen.size = {name:'sm'};
        controller.onScreenChange();
      }));

      it('should update $scope.smallScreen', function() {
        expect(controller.smallScreen).toBe(true);
      });

    });

    describe('updateLayout', function() {
      var store;
      var preference;

      beforeEach(inject(function($injector){
        store = $injector.get('taskListStore');
        preference = $injector.get('preference');
        spyOn(preference, 'set');
      }));

      it('should save preference', function(){
        controller.updateLayout(false);
        expect(preference.set).toHaveBeenCalledWith('showDetails', false);
      });
    });


    describe('onFormSubmited', function(){
      var ngToast;
      beforeEach(inject(function($injector){
        ngToast = $injector.get('ngToast');

        spyOn(ngToast, 'create');
        spyOn(controller, 'refresh');
      }));

      it('should not display a toast message if the action is not Submit task', function() {
        controller.onFormSubmited({message:'success', action:'POST'});
        expect(ngToast.create).not.toHaveBeenCalled();
        expect(controller.refresh).not.toHaveBeenCalled();
      });

      it('should display a toast message and refresh', function() {
        controller.onFormSubmited({message:'success', action:'Submit task'});
        expect(ngToast.create).toHaveBeenCalledWith('Form submitted.<br/>The next task in the list is now selected.');
        expect(controller.refresh).toHaveBeenCalled();
      });

      it('should display a error message', function(){
        controller.onFormSubmited('{"message":"error","action":"Submit task"}');
        expect(ngToast.create).toHaveBeenCalledWith({content:'An error occurred while submitting the form.', className:'danger'});
        expect(controller.refresh).not.toHaveBeenCalled();
      });

      it('should display a file too Big error message', function(){
        controller.onFormSubmited('{"message":"error","action":"Submit task","dataFromError":"fileTooBigError"}');
        expect(ngToast.create).toHaveBeenCalledWith({content:'The attachment is too big.<br/>Select a smaller attachment and submit the form again.', className:'danger'});
        expect(controller.refresh).not.toHaveBeenCalled();
      });

      it('should display a file too Big error message for a status 413', function(){
        controller.onFormSubmited('{"message":"error","action":"Submit task","status":413}');
        expect(ngToast.create).toHaveBeenCalledWith({content:'The attachment is too big.<br/>Select a smaller attachment and submit the form again.', className:'danger'});
        expect(controller.refresh).not.toHaveBeenCalled();
      });

      it('should display an error message and refresh is the task is not found', function(){
        controller.onFormSubmited('{"message":"error","action":"Submit task","status":404}');
        expect(ngToast.create).toHaveBeenCalledWith({content:'An error occurred while submitting the form.<br/>The task may not be available anymore.', className:'danger'});
        expect(controller.refresh).toHaveBeenCalled();
      });
    });

    it('should get filter panel state from preferences', function() {
      expect(controller.showMenu).toEqual(preference.get('showFilters'));
    });

    it('should toggle filter panel and save state in preferences', function() {
      controller.showMenu = true;

      controller.toggleFilters();
      expect(controller.showMenu).toBeFalsy();
      expect(preference.get('showFilters')).toBeFalsy();

      controller.toggleFilters();
      expect(controller.showMenu).toBeTruthy();
      expect(preference.get('showFilters')).toBeTruthy();
    });

    it('should get details panel state from preferences', function() {
      expect(controller.showDetails).toEqual(preference.get('showDetails'));
    });

    it('should toggle details panel and save state in preferences', function() {
      controller.showDetails = true;

      controller.toggleDetails();
      expect(controller.showDetails).toBeFalsy();
      expect(preference.get('showDetails')).toBeFalsy();

      controller.toggleDetails();
      expect(controller.showDetails).toBeTruthy();
      expect(preference.get('showDetails')).toBeTruthy();
    });
  });

  describe('taskApp directive', function(){
    var element;
    var ctrl;
    var scope;

    // mock directive controller
    beforeEach(function(){
      module('org.bonitasoft.features.user.tasks.app', function($provide, $controllerProvider) {
        $controllerProvider.register('TaskAppCtrl', function() {
          this.init = jasmine.createSpy('init');
        });
      });
    });

    // complete init spy controller
    beforeEach(inject(function($controller, $q){
      $controller('TaskAppCtrl').init.and.callFake(function(){
        var defered = $q.defer();
        defered.resolve();
        return defered.promise;
      });
    }));

    beforeEach(inject(function($compile, $rootScope){
      scope = $rootScope.$new();
      element = $compile('<div task-app></div>')(scope);
      ctrl = element.controller('taskApp');
      scope.$digest();
    }));

    it('should have called init', function(){
      expect(ctrl.init).toHaveBeenCalled();
    });

  });
});
