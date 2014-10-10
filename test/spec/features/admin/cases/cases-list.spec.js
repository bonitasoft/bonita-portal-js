/* global cases */
(function () {
    'use strict';
    describe('admin cases list features', function() {
        it('should fill scope to display case lit', function() {

            var scope, caseAPI, fullCases;

            //we use the casesListMocks.js in order to init data for the test

            fullCases = { data : cases};

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
                expect(scope.columns).toEqual(['AppName', 'Version', 'CaseId', 'StartDate', 'StartedBy', 'CurrentState']);
                expect(scope.cases).toBeDefined();
                expect(scope.cases.length).toBe(4);
                for(var i = 0; i< scope.cases.length; i++) {
                  var singleCase = scope.cases[i];
                  for(var j = 0; j< scope.cases.length; j++) {
                    expect(singleCase[scope.columns[j]]).toBeTruthy();
                  }
                }
              }));
          });
      });
  })();
