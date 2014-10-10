describe('Register', function registerTest() {
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
    /*we cannot use directly the angular-mock since it is not exported as a module*/
    var ngMockInjected = require('../../../ngMockInjected');

    beforeEach(function(){
        browser.addMockModule('ngMockE2E', ngMockInjected.ngMockInjected);
        browser.addMockModule('httpBackendMock', mockCode);
      });


    it('should display the list of the tenth first users', function() {
        browser.get('#/admin/cases/list');
        browser.debugger(); //launch protractor with debug option and use 'c' in console to continue test execution
        var caseList = $('#case-list');
        expect(caseList).toBeDefined();
        caseList.getWebElement().findElements(By.css('th.case-column')).then(function(columns) {
            expect(columns.length).toBe(6);
          });
        caseList.getWebElement().findElements(By.css('tr.case-row')).then(function(cases) {
            expect(cases.length).toBe(3);
          });
        browser.debugger();
        caseList.getWebElement().findElements(By.css('#caseId-0 td')).then(function (makeFunCaseDetails) {
            //console.log(makeFunCaseDetails);
            expect(makeFunCaseDetails[0].getText()).toContain('Make Fun');
            expect(makeFunCaseDetails[1].getText()).toContain('4651.0');
            expect(makeFunCaseDetails[3].getText()).toContain('Jan 18, 1970 1:17:53 AM');
            expect(makeFunCaseDetails[4].getText()).toContain('John Travolta');
            expect(makeFunCaseDetails[5].getText()).toContain('California');
          });
      });
  });