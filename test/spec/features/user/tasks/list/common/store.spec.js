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
  var supervisorRegexp = /^\.\.\/API\/bpm\/processSupervisor/;
  var proContactRegexp = /^\.\.\/API\/identity\/professionalcontactdata/;

  var commentRegexp = /^\.\.\/API\/bpm\/comment/;
  var archivedFlowNodeRegExp = /^\.\.\/API\/bpm\/archivedFlowNode/;

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
      name: 'process1'
    }, {
      id: '22222',
      name: 'process2'
    }, {
      id: '33333',
      name: 'process2'
    }
  ];

  var mockSupervisors = [
    {
      'process_id': '6540077894441504039',
      'role_id': '-1',
      'group_id': '-1',
      'user_id': {
        'last_connection': '',
        'created_by_user_id': '-1',
        'creation_date': '2014-10-06 11:04:01.036',
        'id': '17',
        'icon': '/default/icon_user.png',
        'enabled': 'true',
        'title': 'Mrs',
        'manager_id': '1',
        'job_title': 'Vice President of Sales',
        'userName': 'daniela.angelo',
        'lastname': 'Angelo',
        'firstname': 'Daniela',
        'password': '',
        'last_update_date': '2014-10-06 11:04:01.036'
      }
    }
  ];

  var mockContact = {
    'fax_number': '484-302-0397',
    'building': '70',
    'phone_number': '484-302-5397',
    'website': '',
    'zipcode': '19108',
    'state': 'PA',
    'city': 'Philadelphia',
    'country': 'United States',
    'id': '17',
    'mobile_number': '',
    'address': 'Renwick Drive',
    'email': 'daniela.angelo@acme.com',
    'room': ''
  };

  var mockComment = [
    {
      'content': 'The task "Model choice" is now assigned to user.test',
      'tenantId': '1',
      'id': '12',
      'processInstanceId': '13',
      'postDate': '2014-10-06 11:29:17.793',
      'userId': {
        'icon': '/default/icon_user.png',
        'userName': 'System'
      }
    }
  ];

  var mockArchivedFlowNode = [
    {
      'displayDescription': '',
      'executedBySubstitute': {
        'last_connection': '2014-10-22 13:38:23.671',
        'created_by_user_id': '-1',
        'creation_date': '2014-10-06 11:04:00.942',
        'id': '4',
        'icon': '/default/icon_user.png',
        'enabled': 'true',
        'title': 'Mr',
        'manager_id': '3',
        'job_title': 'Human resources benefits',
        'userName': 'walter.bates',
        'lastname': 'Bates',
        'firstname': 'Walter',
        'password': '',
        'last_update_date': '2014-10-06 11:04:00.942'
      },
      'processId': '6778715375475035885',
      'state': 'completed',
      'rootContainerId': '13',
      'type': 'USER_TASK',
      'assigned_id': '4',
      'id': '53',
      'executedBy': {
        'last_connection': '2014-10-22 13:38:23.671',
        'created_by_user_id': '-1',
        'creation_date': '2014-10-06 11:04:00.942',
        'id': '4',
        'icon': '/default/icon_user.png',
        'enabled': 'true',
        'title': 'Mr',
        'manager_id': '3',
        'job_title': 'Human resources benefits',
        'userName': 'walter.bates',
        'lastname': 'Bates',
        'firstname': 'Walter',
        'password': '',
        'last_update_date': '2014-10-06 11:04:00.942'
      },
      'sourceObjectId': '34',
      'caseId': '13',
      'priority': 'normal',
      'actorId': '13',
      'description': '',
      'name': 'Color selection',
      'reached_state_date': '2014-10-06 11:31:19.940',
      'displayName': 'Color selection',
      'archivedDate': '2014-10-06 11:31:19.947',
      'dueDate': '2014-10-06 12:29:19.457',
      'last_update_date': '2014-10-06 11:31:19.940'
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

  describe('getSupervisor', function() {
    beforeEach(function(){
      $httpBackend.whenGET(supervisorRegexp).respond(mockSupervisors);
      $httpBackend.whenGET(proContactRegexp).respond(mockContact);

      store.currentCase = mockCase;
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      $httpBackend.resetExpectations();
    });

    it('should make an api call with parameter', function() {
      $httpBackend.expectGET(supervisorRegexp);
      $httpBackend.expectGET(proContactRegexp);
      store.getProcessSupervisors(store.currentCase.rootContainerId.id);
      $httpBackend.flush();
    });

    it('should store supervisor in currentCase', function() {
      $httpBackend.expectGET(supervisorRegexp);
      $httpBackend.expectGET(proContactRegexp);
      store.currentCase = mockCase;
      store.getProcessSupervisors(store.currentCase.rootContainerId.id);
      $httpBackend.flush();
      expect(store.currentCase.supervisors).toBeDefined();
      expect(store.currentCase.supervisors[0].user_id.email).toEqual(mockContact.email);
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
  });

  describe('getHistory', function() {
    beforeEach(function(){
      $httpBackend.whenGET(commentRegexp).respond(mockComment);
      $httpBackend.whenGET(archivedFlowNodeRegExp).respond(mockArchivedFlowNode);
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      $httpBackend.resetExpectations();
    });

    it('should make an api request with parameters', function() {
      // ! $hsttpbackend order matter :(
      $httpBackend.expectGET(archivedFlowNodeRegExp).respond(mockArchivedFlowNode);
      $httpBackend.expectGET(commentRegexp);
      store.currentCase = mockCase;
      store.getHistory(mockTasks[0]);
      $httpBackend.flush();
    });

    it('should return an ordered list of event', function() {
      store.currentCase = mockCase;

      store.getHistory(mockTasks[0]);
      $httpBackend.flush();

      expect(store.currentCase.history[0].content).toMatch(/model choice/i);
      expect(store.currentCase.history[1].content).toMatch(/color selection/i);

    });
  });
});
