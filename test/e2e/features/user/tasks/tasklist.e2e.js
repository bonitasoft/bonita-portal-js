'use strict';

describe('tasklist custom page', function() {

  beforeEach(function(){
    browser.manage().deleteAllCookies();
    browser.get('#/user/tasks/list');
    browser.waitForAngular();
  });

  it('should load a list of task', function() {
    var tasks = element.all(by.repeater('task in tasks'));
    expect(tasks.count()).toBe(26);
  });

  it('should have a selected element by default', function() {
    var task = element(by.css('.Line.info'));
    expect(task).toBeDefined();
  });

  it('should search an element', function() {
    element(by.id('search')).sendKeys('app');
    element(by.id('search')).sendKeys(protractor.Key.ENTER);

    var tasks = element.all(by.repeater('task in tasks'));
    expect(tasks.count()).toBe(2);

  });

  it('should change pagination', function() {
    element(by.css('.bo-Settings')).click();
    var test = element.all(by.css('.bo-TableSettings-content .btn-group button')).first().getText();
    element.all(by.css('.bo-TableSettings-content .btn-group button')).first().click();

    var tasks;
    element.all(by.repeater('task in tasks'))
      .then(function(_tasks){
        tasks = _tasks;
      })
      .then(function(){
        return test;
      })
      .then(function(val){
        expect(tasks.length).toEqual(parseInt(val, 10));
      });
  });

  it('should filter task by process', function() {
    element(by.css('.ProcessList .btn')).click();
    var processes = element.all(by.repeater('p in app.processes'));
    // 2 process + All
    expect(processes.count()).toEqual(3);

    //select last process
    processes.last().element(by.css('.processOptionLink')).click();
    var tasks = element.all(by.repeater('task in tasks'));
    expect(tasks.count()).toBe(2);
  });

  it('should have a selected list item', function() {
    var activeFilter = element(by.css('.TaskFilters .active'));
    expect(activeFilter.isPresent()).toBe(true);

  });

  it('should filter my tasks', function() {
    var titleRxp = /my tasks/i;
    // select My task
    element.all(by.css('.TaskFilters li a')).get(1).click();

    var link =  element(by.css('.TaskFilters .active'))
     .getWebElement()
     .getText();

    expect(link).toMatch(titleRxp);

    var title = element(by.binding('app.request.taskFilter.title'))
      .getWebElement()
      .getText();
    expect(title).toMatch(titleRxp);

    var tasks = element.all(by.repeater('task in tasks'));
    expect(tasks.count()).toBe(2);
  });

  it('should filter pool tasks', function() {
    var titleRxp = /available tasks/i;
    element.all(by.css('.TaskFilters li a')).get(2).click();

    var link =  element(by.css('.TaskFilters .active'))
     .getWebElement()
     .getText();
    expect(link).toMatch(titleRxp);

    var title = element(by.binding('app.request.taskFilter.title'))
      .getWebElement()
      .getText();
    expect(title).toMatch(titleRxp);


    var tasks = element.all(by.repeater('task in tasks'));
    expect(tasks.count()).toBe(24);
  });

  it('should filter done tasks', function() {
    var titleRxp = /done/i;
    element.all(by.css('.TaskFilters li a')).get(3).click();

    var link =  element(by.css('.TaskFilters .active'))
     .getWebElement()
     .getText();
    expect(link).toMatch(titleRxp);

    var title = element(by.binding('app.request.taskFilter.title'))
      .getWebElement()
      .getText();
    expect(title).toMatch(titleRxp);

    var tasks = element.all(by.repeater('task in tasks'));
    expect(tasks.count()).toBe(5);
  });

  it('should have sorted tasks by default', function() {
    var tasks = element.all(by.repeater('task in tasks'));
    tasks.first().all(by.css('td')).get(2).getText().then(function(name){
      expect(name.trim()).toBe('A Étape1');
    });
  });

  it('should have sort tasks DESC when click on active sort button', function() {
    var sortButtons = element(by.css('.bo-SortButton--active'));
    //Click on the first button
    sortButtons.click();

    var task = element.all(by.css('.Line td:first-child+td+td')).first();

    task.getText().then(function(name){
      expect(name.trim()).toBe('Z Contract Mail');
    });
  });

  it('should update tasks when navigate using pagination', function() {
    // open table settings
    element.all(by.css('.bo-Settings')).first().click();
    //Select pagination 25
    element.all(by.css('.bo-TableSettings-content .btn-group button')).first().click();

    // Go to last page
    element
      .all(by.repeater('page in pages track by $index'))
      .last()
      .element(by.tagName('a'))
        .click();

    var tasks = element.all(by.repeater('task in tasks'));
    expect(tasks.count()).toBe(1);
  });


  it('should toggle tasks filters menu when click toggle filters', function() {
    var toggleMenu = element(by.css('.FilterToggle'));
    var appWrapper = element(by.css('.AppWrapper')).getWebElement();

    var windowWidth = element(by.css('body')).getWebElement().offsetWidth;
    var originalWidth = appWrapper.offsetWidth;

    //hide tasks filters
    toggleMenu.click();
    expect(appWrapper.offsetWidth).toBe(windowWidth);

    //Show tasks filters
    toggleMenu.click();
    expect(appWrapper.offsetWidth).toBe(originalWidth);
  });

  it('should toggle Details view menu when click expand', function() {
    var detailSwitch = element.all(by.model('value'));
    var taskList = element(by.css('.TaskList')).getWebElement();

    var wrapperWidth = element(by.css('.AppWrapper')).getWebElement().offsetWidth;
    var originalWidth = taskList.offsetWidth;


    //Show tasks filters
    detailSwitch.last().click();
    expect(taskList.offsetWidth).toBe(originalWidth);

    //hide details view
    detailSwitch.first().click();
    expect(taskList.offsetWidth).toBe(wrapperWidth);
  });


  it('selectAll should select all task', function() {
    element.all(by.css('th .Cell-ckeckbox input[type=checkbox]')).click();

    var cb = element.all(by.css('.Line input[type=checkbox]'));
    expect(cb.count()).toBe(26);
  });

  // function log() {
  //   var args = [].slice.call(arguments);
  //   browser.manage().logs().get('browser').then(function() {
  //     console.log.apply(console, args);
  //   });
  // }
});
