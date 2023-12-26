/* jshint camelcase: false */
'use strict';

describe('taskListStore', function() {
  var store;
  var $httpBackend;
  var $rootScope;

  var taskRegexp = /^\.\.\/API\/bpm\/humanTask/;
  var caseRegexp = /^\.\.\/API\/bpm\/case/;
  var archivedCaseRegexp = /^\.\.\/API\/bpm\/archivedCase/;
  var processRegexp = /^\.\.\/API\/bpm\/process/;

  var mockTasks = [
    {
      id: 1,
      name: 'task1',
      assigned_id: 1,
      selected: true,
      caseId: 77
    }, {
      id: 2,
      name: 'task2',
      assigned_id: 1,
      selected: false
    }, {
      id: 3,
      name: 'task3',
      assigned_id: 1,
      selected: true
    }, {
      id: 4,
      name: 'task4',
      assigned_id: '',
      selected: false
    }, {
      id: 5,
      name: 'task5',
      assigned_id: '',
      selected: true
    }
  ];

  var mockUser = {
    user_id: 1,
    user_name: 'test'
  };

  var mockCase = {
    id: 77,
    state: 'started',
    rootContainerId: {
      id: 1
    }
  };

  var mockArchivedCases = [{
    id: 78,
    state: 'completed',
    rootContainerId: {
      id: 1
    }
  }];

  var mockProcesses = [
    {
      id: '11111',
      displayName: 'process1'
    }, {
      id: '22222',
      displayName: 'process2'
    }, {
      id: '33333',
      displayName: 'process2'
    }
  ];

  beforeEach(module('org.bonitasoft.features.user.tasks.app.store'));

  beforeEach(inject(function($injector) {
    store = $injector.get('taskListStore');
    store.user = mockUser;
    $httpBackend = $injector.get('$httpBackend');
    $rootScope = $injector.get('$rootScope');



  }));

  describe('getTasks', function() {
    beforeEach(function(){
      $httpBackend.whenGET(taskRegexp).respond(mockTasks);
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      $httpBackend.resetExpectations();
    });

    it('should make an api request with parameters', function() {
      $httpBackend.expectGET(taskRegexp);
      store.getTasks();
      $httpBackend.flush();
    });

    it('should store a task list', function() {
      $httpBackend.expectGET(taskRegexp);
      store.getTasks();
      $httpBackend.flush();
      expect(store.tasks.length).toBe(mockTasks.length);
    });

    it('should set current task if API return tasks ', function() {
      $httpBackend.expectGET(taskRegexp);
      store.getTasks();
      $httpBackend.flush();
      expect(store.currentTask).toEqual(jasmine.objectContaining(mockTasks[0]));
      expect(store.currentTask.selected).toBe(true);
    });
  });

  describe('getCaseInfo', function() {
    var caseId = 2;

    beforeEach(function() {
      $httpBackend.whenGET(caseRegexp).respond(mockCase);
      store.currentTask = {
        id: 1,
        caseId: caseId
      };
      $rootScope.$digest();
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should make an api request with parameters', function() {
      $httpBackend.expectGET(caseRegexp);
      store.getCaseInfo(caseId);
      $httpBackend.flush();
    });

    it('should store a case', function() {
      $httpBackend.expectGET(caseRegexp);
      store.getCaseInfo(caseId);
      $httpBackend.flush();
      expect(store.currentCase).toEqual(jasmine.objectContaining(mockCase));
    });

    it('should throw an error if no caseId supplied', function() {
      function test() {
        store.getCaseInfo();
      }
      expect(test).toThrow();
    });
  });

  describe('getCaseInfo when case is archived', function() {
    var caseId = 2;

    beforeEach(function() {
      $httpBackend.whenGET(caseRegexp).respond(404, '');
      $httpBackend.whenGET(archivedCaseRegexp).respond(mockArchivedCases, {'Content-Range':'0-1/1'});
      store.currentTask = {
        id: 1,
        caseId: caseId
      };
      $rootScope.$digest();
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should make an api request with parameters', function() {
      $httpBackend.expectGET(archivedCaseRegexp);
      store.getCaseInfo(caseId);
      $httpBackend.flush();
    });

    it('should store a case', function() {
      $httpBackend.expectGET(archivedCaseRegexp);
      store.getCaseInfo(caseId);
      $httpBackend.flush();
      expect(store.currentCase).toEqual(jasmine.objectContaining(mockArchivedCases[0]));
    });
  });

  describe('getProcesses', function() {
    beforeEach(function(){
      $httpBackend.whenGET(processRegexp).respond(mockProcesses);
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      $httpBackend.resetExpectations();
    });

    it('should make an api request with parameters', function() {
      $httpBackend.expectGET(processRegexp);
      store.getProcessList();
      $httpBackend.flush();
    });

    it('should store a processes list', function() {
      $httpBackend.expectGET(processRegexp);
      store.getProcessList();
      $httpBackend.flush();
      //should be equal to number of mockprocesses + All option
      expect(store.processes.length).toBe(mockProcesses.length + 1);
    });

    it('should select All process when no process has been selected before', function() {
      $httpBackend.expectGET(processRegexp);

      store.getProcessList();
      $httpBackend.flush();

      expect(store.request.process).toEqual({ displayName: 'All', id: false });
    });

    it('should keep previously selected process', function() {
      $httpBackend.expectGET(processRegexp);
      store.request.process = { id: 2, displayName: 'aProcess' };

      store.getProcessList();
      $httpBackend.flush();

      expect(store.request.process).toEqual({ id: 2, displayName: 'aProcess' });
    });
  });

});
