(function () {
    'use strict';

    describe('admin cases list features', function() {
        it('should fill scope to display case lit', function() {

            var scope, caseAPI, fullCases;

            fullCases = { data : [
                {
                    'id': '1',
                    'end_date': '',
                    'startedBySubstitute': {
                        'last_connection': '2014-10-09 16:35:30.097',
                        'created_by_user_id': '-1',
                        'creation_date': '2014-10-09 14:19:31.623',
                        'id': '30',
                        'icon': '/default/icon_user.png',
                        'enabled': 'true',
                        'title': 'Mr',
                        'manager_id': '0',
                        'job_title': 'Chief Executive Officer',
                        'userName': 'william.jobs',
                        'lastname': 'Jobs',
                        'firstname': 'William',
                        'password': '',
                        'last_update_date': '2014-10-09 14:19:31.623'
                      },
                      'start': '2014-10-09 16:35:39.270',
                      'state': 'started',
                      'rootCaseId': '1',
                      'started_by': {
                        'last_connection': '2014-10-09 16:35:30.097',
                        'created_by_user_id': '-1',
                        'creation_date': '2014-10-09 14:19:31.623',
                        'id': '30',
                        'icon': '/default/icon_user.png',
                        'enabled': 'true',
                        'title': 'Mr',
                        'manager_id': '0',
                        'job_title': 'Chief Executive Officer',
                        'userName': 'william.jobs',
                        'lastname': 'Jobs',
                        'firstname': 'William',
                        'password': '',
                        'last_update_date': '2014-10-09 14:19:31.623'
                      },
                      'processDefinitionId': {
                        'id': '9208216346116476233',
                        'icon': '',
                        'displayDescription': '',
                        'deploymentDate': '2014-10-09 16:34:46.981',
                        'description': '',
                        'activationState': 'ENABLED',
                        'name': 'Pool',
                        'deployedBy': '4',
                        'displayName': 'Pool',
                        'actorinitiatorid': '1',
                        'last_update_date': '2014-10-09 16:34:51.047',
                        'configurationState': 'RESOLVED',
                        'version': '1.0'
                      },
                      'last_update_date': '2014-10-09 16:35:39.270'
                    },
                    {
                      'id': '3',
                      'end_date': '',
                      'startedBySubstitute': {
                        'last_connection': '2014-10-09 16:35:30.097',
                        'created_by_user_id': '-1',
                        'creation_date': '2014-10-09 14:19:31.623',
                        'id': '30',
                        'icon': '/default/icon_user.png',
                        'enabled': 'true',
                        'title': 'Mr',
                        'manager_id': '0',
                        'job_title': 'Chief Executive Officer',
                        'userName': 'william.jobs',
                        'lastname': 'Jobs',
                        'firstname': 'William',
                        'password': '',
                        'last_update_date': '2014-10-09 14:19:31.623'
                      },
                      'start': '2014-10-09 16:35:51.368',
                      'state': 'started',
                      'rootCaseId': '3',
                      'started_by': {
                        'last_connection': '2014-10-09 16:35:30.097',
                        'created_by_user_id': '-1',
                        'creation_date': '2014-10-09 14:19:31.623',
                        'id': '30',
                        'icon': '/default/icon_user.png',
                        'enabled': 'true',
                        'title': 'Mr',
                        'manager_id': '0',
                        'job_title': 'Chief Executive Officer',
                        'userName': 'william.jobs',
                        'lastname': 'Jobs',
                        'firstname': 'William',
                        'password': '',
                        'last_update_date': '2014-10-09 14:19:31.623'
                      },
                      'processDefinitionId': {
                        'id': '9208216346116476233',
                        'icon': '',
                        'displayDescription': '',
                        'deploymentDate': '2014-10-09 16:34:46.981',
                        'description': '',
                        'activationState': 'ENABLED',
                        'name': 'Pool',
                        'deployedBy': '4',
                        'displayName': 'Pool',
                        'actorinitiatorid': '1',
                        'last_update_date': '2014-10-09 16:34:51.047',
                        'configurationState': 'RESOLVED',
                        'version': '1.0'
                      },
                      'last_update_date': '2014-10-09 16:35:51.368'
                    },
                    {
                      'id': '2',
                      'end_date': '',
                      'startedBySubstitute': {
                        'last_connection': '2014-10-09 16:35:30.097',
                        'created_by_user_id': '-1',
                        'creation_date': '2014-10-09 14:19:31.623',
                        'id': '30',
                        'icon': '/default/icon_user.png',
                        'enabled': 'true',
                        'title': 'Mr',
                        'manager_id': '0',
                        'job_title': 'Chief Executive Officer',
                        'userName': 'william.jobs',
                        'lastname': 'Jobs',
                        'firstname': 'William',
                        'password': '',
                        'last_update_date': '2014-10-09 14:19:31.623'
                      },
                      'start': '2014-10-09 16:35:47.472',
                      'state': 'started',
                      'rootCaseId': '2',
                      'started_by': {
                        'last_connection': '2014-10-09 16:35:30.097',
                        'created_by_user_id': '-1',
                        'creation_date': '2014-10-09 14:19:31.623',
                        'id': '30',
                        'icon': '/default/icon_user.png',
                        'enabled': 'true',
                        'title': 'Mr',
                        'manager_id': '0',
                        'job_title': 'Chief Executive Officer',
                        'userName': 'william.jobs',
                        'lastname': 'Jobs',
                        'firstname': 'William',
                        'password': '',
                        'last_update_date': '2014-10-09 14:19:31.623'
                      },
                      'processDefinitionId': {
                        'id': '9208216346116476233',
                        'icon': '',
                        'displayDescription': '',
                        'deploymentDate': '2014-10-09 16:34:46.981',
                        'description': '',
                        'activationState': 'ENABLED',
                        'name': 'Pool',
                        'deployedBy': '4',
                        'displayName': 'Pool',
                        'actorinitiatorid': '1',
                        'last_update_date': '2014-10-09 16:34:51.047',
                        'configurationState': 'RESOLVED',
                        'version': '1.0'
                      },
                      'last_update_date': '2014-10-09 16:35:47.472'
                    },
                    {
                      'id': '4',
                      'end_date': '',
                      'startedBySubstitute': {
                        'last_connection': '2014-10-09 16:35:30.097',
                        'created_by_user_id': '-1',
                        'creation_date': '2014-10-09 14:19:31.623',
                        'id': '30',
                        'icon': '/default/icon_user.png',
                        'enabled': 'true',
                        'title': 'Mr',
                        'manager_id': '0',
                        'job_title': 'Chief Executive Officer',
                        'userName': 'william.jobs',
                        'lastname': 'Jobs',
                        'firstname': 'William',
                        'password': '',
                        'last_update_date': '2014-10-09 14:19:31.623'
                      },
                      'start': '2014-10-09 16:35:55.251',
                      'state': 'started',
                      'rootCaseId': '4',
                      'started_by': {
                        'last_connection': '2014-10-09 16:35:30.097',
                        'created_by_user_id': '-1',
                        'creation_date': '2014-10-09 14:19:31.623',
                        'id': '30',
                        'icon': '/default/icon_user.png',
                        'enabled': 'true',
                        'title': 'Mr',
                        'manager_id': '0',
                        'job_title': 'Chief Executive Officer',
                        'userName': 'william.jobs',
                        'lastname': 'Jobs',
                        'firstname': 'William',
                        'password': '',
                        'last_update_date': '2014-10-09 14:19:31.623'
                      },
                      'processDefinitionId': {
                        'id': '9208216346116476233',
                        'icon': '',
                        'displayDescription': '',
                        'deploymentDate': '2014-10-09 16:34:46.981',
                        'description': '',
                        'activationState': 'ENABLED',
                        'name': 'Pool',
                        'deployedBy': '4',
                        'displayName': 'Pool',
                        'actorinitiatorid': '1',
                        'last_update_date': '2014-10-09 16:34:51.047',
                        'configurationState': 'RESOLVED',
                        'version': '1.0'
                      },
                      'last_update_date': '2014-10-09 16:35:55.251'
                    }
                  ]};

            beforeEach(module('org.bonita.features.admin.cases.list'));

            beforeEach(inject(function ($rootScope) {
                scope = $rootScope.$new();
                caseAPI = {
                    search : function(){
                        return {
                            '$promise' : {
                                then : function(method){
                                    method(fullCases);
                                  }
                              }
                            };
                      }
                  };

              }));

            it('should fill the scope ', inject(function($controller){
                $controller('casesListCtrl', {
                    '$scope' : scope,
                    'caseAPI' : caseAPI
                  });
                expect(scope.columns).toBeDefined();
                expect(scope.columns.length).toBe(6);
                expect(scope.cases).toBeDefined();
                expect(scope.cases.length).toBe(4);
              }));
          });
      });
  })();
