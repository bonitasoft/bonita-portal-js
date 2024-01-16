'use strict';
/* jshint camelcase: false */

describe('TaskDetailsHelper service', () => {

  var mockTask = {id: 1, name: 'task1', selected: true, processId: 42, type: 'USER_TASK'};
  var service, $httpBackend, preference;

  beforeEach(module('org.bonitasoft.features.user.tasks.details'));

  beforeEach(inject(function($injector, $state) {
    var store = $injector.get('taskListStore');
    spyOn(store, 'user').and.returnValue({user_id: 123, user_name: 'test'});
    spyOn($state, 'transitionTo');

    $httpBackend = $injector.get('$httpBackend');
    preference = $injector.get('preference');
    spyOn(preference, 'get').and.returnValue('form');
    spyOn(preference, 'set');

    service = $injector.get('taskDetailsHelper');
  }));

  it('should take a task', function() {
    $httpBackend.whenPUT(/^\.\.\/API\/bpm\/humanTask/).respond({assigned_id: 123});
    $httpBackend.expectPUT(/^\.\.\/API\/bpm\/humanTask/);

    service.takeReleaseTask(mockTask);
    $httpBackend.flush();
    expect(mockTask.assigned_id).toBe(123);

    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

});
