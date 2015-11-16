'use strict';


describe('iframe', function() {
  var iframe;
  var mockedLocation = {
    search: function() {}
  };

  var bonitaHost= 'http://myhost.com/myExample/portal/';

  var mockedWindow = {
    location: {
      href: bonitaHost
    }
  };
  
  var formUrl = bonitaHost+'resource/taskInstance/processName/1.1.1/task1/content/?id=1';
  var overViewUrl = bonitaHost+'resource/processInstance/processName/1.1.1/content/?id=77';

  var userId = 123;
  var task =  {id:1, name:'task1', selected:true} ;
  var Case =  {id:77, name:'task1', selected:true} ;
  var process = {
    version: '1.1.1',
    name: 'processName'
  };
  var specialCharsTask =  {id:1, name:'étape 1', selected:true} ;
  var specialCharsCase =  {id:77, name:'Étape1 ?', selected:true} ;
  var specialCharsProcess = {
    version: 'deuxième Version',
    name: 'processus accentué '
  };

  beforeEach(function () {
    module('common.iframe');

    module(function($provide) {
      $provide.value('$location', mockedLocation);
      $provide.value('$window', mockedWindow);
    });

    mockedLocation.search = function() { return({});};
  });

  beforeEach(inject(function($injector) {
    iframe  = $injector.get('iframe');
  }));

  fit('should update formUrl when store.currentCase change', function(){
    var toUrl = iframe.getTaskForm(process, task, userId);
    expect(toUrl).toBe(formUrl);
  });

  it('should update formUrl when store.currentCase change', function(){
    var toUrl = iframe.getCaseOverview(Case, process);
    expect(toUrl).toBe(overViewUrl);
  });

  it('should include tenant ID when in the current URL', function(){
    mockedLocation.search = function() {return({tenant:'2'});};
    var toUrl = iframe.getTaskForm(process, task, userId);
    expect(toUrl).toContain('&tenant=2');
  });

  it('should not include tenant ID when not in the current URL', function(){
    var toUrl = iframe.getTaskForm(process, task, userId);
    expect(toUrl).not.toContain('tenant=');
  });

  it('should include locale when in the current URL', function(){
    mockedLocation.search = function() {return({locale:'EN_en'});};
    var toUrl = iframe.getTaskForm(process, task, userId);
    expect(toUrl).toContain('&locale=EN_en');
  });

  it('should not include tenant ID when not in the current URL', function(){
    var toUrl = iframe.getTaskForm(process, task, userId);
    expect(toUrl).not.toContain('locale');
  });


  describe('should be called with encoded characters', function(){
    it('in task form url', function(){
      var confirmation = false;
      var encodedTaskFormUrl = iframe.getTaskForm(specialCharsProcess, specialCharsTask, userId, confirmation);
      expect(encodedTaskFormUrl).toBe(bonitaHost+'resource/taskInstance/processus%20accentu%C3%A9%20/deuxi%C3%A8me%20Version/%C3%A9tape%201/content/?id=1&displayConfirmation=false');
    });

    it('in case overview url', function(){
      var encodedCaseOverviewUrl = iframe.getCaseOverview(specialCharsCase,specialCharsProcess);
      expect(encodedCaseOverviewUrl).toBe(bonitaHost+'resource/processInstance/processus%20accentu%C3%A9%20/deuxi%C3%A8me%20Version/content/?id=77');
    });
  });

  it('should not have displayConfirmation parameter in task form url if confirmation parameter value is not false', function(){
    var confirmation = true;
    var encodedTaskFormUrl = iframe.getTaskForm(specialCharsProcess, specialCharsTask, userId, confirmation);
    expect(encodedTaskFormUrl).toBe(bonitaHost+'resource/taskInstance/processus%20accentu%C3%A9%20/deuxi%C3%A8me%20Version/%C3%A9tape%201/content/?id=1');
  });

  it('should not have displayConfirmation parameter in task form url if confirmation parameter not given', function(){
    var encodedTaskFormUrl = iframe.getTaskForm(specialCharsProcess, specialCharsTask, userId);
    expect(encodedTaskFormUrl).toBe(bonitaHost+'resource/taskInstance/processus%20accentu%C3%A9%20/deuxi%C3%A8me%20Version/%C3%A9tape%201/content/?id=1');
  });
});
