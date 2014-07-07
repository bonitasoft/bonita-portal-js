describe('Register', function() {
  'use strict';

  var mockCode = function () {
      angular.module('httpBackendMock', ['ngMockE2E'])
          .run(function ($httpBackend) {

            var aUser = {
                        'last_connection': '',
                        'created_by_user_id': '1',
                        'creation_date': '2014-06-11 12:06:12.827',
                        id: '22',
                        icon: '/default/icon_user.png',
                        enabled: 'true',
                        title: 'Mrs',
                        'manager_id': '18',
                        'job_title': 'Account manager',
                        userName: 'giovanna.almeida',
                        lastname: 'AlmeidaTest',
                        firstname: 'Giovanna',
                        password: '',
                        'last_update_date': '2014-06-11 12:06:12.827'
                    };
              var searchResultHeaders = {'Content-Range': '0-1/1'};

              $httpBackend.whenGET('../API/system/session/unusedid').respond({id: '22'});
              $httpBackend.whenGET('../API/identity/user?c=10&p=0').respond(200, [aUser],searchResultHeaders);
              $httpBackend.whenGET(/.*\.html/).passThrough();
          });
      };
  var ngMockInjected = require('../../../ngMockInjected');
  beforeEach(function(){

    //need to use driver directly for browser not to wait for angular to load
    //browser.driver.get('http://127.0.0.1:8080/bonita/loginservice?username=william.jobs&password=bpm');
  });

  afterEach(function(){
    //browser.driver.get('http://127.0.0.1:8080/bonita/logoutservice');
  });

  it('should display the list of the tenth first users', function() {
    browser.addMockModule('ngMockE2E', ngMockInjected.ngMockInjected);
    browser.addMockModule('httpBackendMock', mockCode);
    browser.get('#/admin/users');
    browser.debugger(); //launch protractor with debug option and use 'c' in console to continue test execution
    var userList = $('#userList');
    expect(userList).toBeDefined();
    userList.getWebElement().findElements(By.css('.user')).then(function(users){
      expect(users.length).toBe(1);
      userList.getWebElement().findElement(By.css('#userID-22')).then(function(daniela){
        var danielaText = daniela.getText();
        expect(danielaText).toContain('Giovanna');
        expect(danielaText).toContain('AlmeidaTest');
        expect(danielaText).toContain('Account manager');
      });
    });
  });
});
