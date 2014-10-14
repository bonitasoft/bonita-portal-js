/* global cases */
(function () {
  'use strict';
  describe('admin cases list features', function () {

    var scope, caseAPI, fullCases;

    beforeEach(module('org.bonita.features.admin.cases.list'));

    beforeEach(inject(function ($rootScope) {
      //we use the casesListMocks.js in order to init data for the test
      fullCases = { resource: cases};
      fullCases.resource.pagination = {
        total: 4
      };
      scope = $rootScope.$new();
      caseAPI = {
        search: function () {
          return {
            '$promise': {
              then: function (method) {
                method(fullCases);
              }
            }
          };
        }
      };
      spyOn(caseAPI, 'search').and.callThrough();
    }));

    describe('controller initialization', function () {

      var defaultPageSize = 1000;
      var defaultSort = 'id';
      var defaultDeployedFields = ['titi', 'tata', 'toto'];

      describe('with incorrect columns', function () {
        beforeEach(inject(function ($controller) {
          $controller('casesListCtrl', {
            '$scope': scope,
            'caseAPI': caseAPI,
            'defaultPageSize': defaultPageSize,
            'defaultSort': defaultSort,
            'defaultDeployedFields': defaultDeployedFields,
            'casesColumns': [
              {name: 'AppName', sortName: 'name', path: ['processDefinitionId', 'name'] },
              {name: 'Version', sortName: 'version', path: ['processDefinitionIdsdf', 'version']},
              {name: 'CaseId', sortName: 'id', path: ['idsdf']}
            ]
          });
        }));
        it('should not display all fields', function () {
          expect(scope.cases).toBeDefined();
          expect(scope.cases.length).toBe(4);
          for (var j = 0; j < scope.cases.length; j++) {
            var singleCase = scope.cases[j];
            expect(singleCase[scope.columns[0].name]).toBeTruthy();
            expect(singleCase[scope.columns[1].name]).not.toBeTruthy();
            expect(singleCase[scope.columns[2].name]).not.toBeTruthy();
          }
          expect(caseAPI.search).toHaveBeenCalledWith({
            p: 0,
            c: defaultPageSize,
            o: defaultSort + ' ASC',
            d: defaultDeployedFields
          });
        });
      });

      describe('with correct columns', function () {

        beforeEach(inject(function ($controller) {
          $controller('casesListCtrl', {
            '$scope': scope,
            'caseAPI': caseAPI,
            'defaultPageSize': defaultPageSize,
            'defaultSort': defaultSort,
            'defaultDeployedFields': defaultDeployedFields
          });
        }));


        it('should define a list of columns', function () {
          expect(scope.columns).toBeDefined();
          for (var i = 0; i < scope.columns.length; i++) {
            expect(scope.columns[i].name).toBeTruthy();
            expect(scope.columns[i].sortName).toBeTruthy();
            expect(scope.columns[i].path).toBeTruthy();
            expect(scope.columns[i].path.length).toBeTruthy();
          }
        });

        it('should fill the scope cases', inject(function () {
          expect(scope.cases).toBeDefined();
          expect(scope.cases.length).toBe(4);
          for (var j = 0; j < scope.cases.length; j++) {
            var singleCase = scope.cases[j];
            for (var k = 0; k < scope.cases.length; k++) {
              expect(singleCase[scope.columns[k].name]).toBeTruthy();
            }
          }
          expect(caseAPI.search).toHaveBeenCalledWith({
            p: 0,
            c: defaultPageSize,
            o: defaultSort + ' ASC',
            d: defaultDeployedFields
          });
        }));
      });
    });

    describe('sort behaviour', function () {
      describe('getSortNameByPredicate scope function', function () {
        it('should work with a empty predicate', inject(function ($controller) {
          $controller('casesListCtrl', {
            '$scope': scope,
            'caseAPI': caseAPI
          });
          expect(scope.getSortNameByPredicate()).not.toBeDefined();
        }));
        it('should work with a empty column table', inject(function ($controller) {
          $controller('casesListCtrl', {
            '$scope': scope,
            'caseAPI': caseAPI,
            'casesColumns': []
          });
          expect(scope.getSortNameByPredicate()).not.toBeDefined();
        }));
        it('should return the right sort name', inject(function ($controller) {
          $controller('casesListCtrl', {
            '$scope': scope,
            'caseAPI': caseAPI,
            'casesColumns': [
              {name: 'AppName', sortName: 'name', path: ['processDefinitionId', 'name'] },
              {name: 'Version', sortName: 'version', path: ['processDefinitionId', 'version']},
              {name: 'CaseId', sortName: 'id', path: ['id']}
            ]
          });
          expect(scope.getSortNameByPredicate('AppName')).toBe('name');
          expect(scope.getSortNameByPredicate('Version')).toBe('version');
          expect(scope.getSortNameByPredicate('CaseId')).toBe('id');

        }));
        it('should return the undefined on an unknown column name name', inject(function ($controller) {
          $controller('casesListCtrl', {
            '$scope': scope,
            'caseAPI': caseAPI,
            'casesColumns': [
              {name: 'AppName', sortName: 'name', path: ['processDefinitionId', 'name'] },
              {name: 'Version', sortName: 'version', path: ['processDefinitionId', 'version']},
              {name: 'CaseId', sortName: 'id', path: ['id']}
            ]
          });
          expect(scope.getSortNameByPredicate('notAColumnName')).not.toBeDefined();

        }));
      });

      describe('select row', function () {
        beforeEach(inject(function ($controller) {
          $controller('casesListCtrl', {
            '$scope': scope
          });
        }));
        it('should not throw error on empty argument', function () {
          scope.selectCase();
        });

        it('should have the given case selected if it was not', function () {
          var caseItem = {};
          scope.selectCase(caseItem);
          expect(caseItem.selected).toBeTruthy();
        });

        it('should have the given case unselected if it was', function () {
          var caseItem = {selected: true};
          scope.selectCase(caseItem);
          expect(caseItem.selected).toBeFalsy();
        });
      });

      describe('page changes', function () {
        var defaultPageSize = 2;
        var defaultSort = 'id';
        var defaultDeployedFields = ['titi', 'tata', 'toto'];

        beforeEach(inject(function ($controller) {
          $controller('casesListCtrl', {
            '$scope': scope,
            'caseAPI': caseAPI,
            'defaultPageSize': defaultPageSize,
            'defaultSort': defaultSort,
            'defaultDeployedFields': defaultDeployedFields,
            'casesColumns': [
              {name: 'AppName', sortName: 'name', path: ['processDefinitionId', 'name'] },
              {name: 'Version', sortName: 'version', path: ['processDefinitionId', 'version']},
              {name: 'CaseId', sortName: 'id', path: ['id']}
            ]
          });
        }));
        it('should call next Page on current sort', function () {

          scope.searchForCases({sort: {predicate: 'AppName', reverse: true}});
          expect(scope.currentFirstResultIndex).toBe(1);
          expect(scope.currentLastResultIndex).toBe(2);
          scope.currentPage++;
          scope.searchForCases();
          expect(scope.currentFirstResultIndex).toBe(3);
          expect(scope.currentLastResultIndex).toBe(4);
          scope.currentPage--;
          scope.searchForCases();
          expect(scope.currentFirstResultIndex).toBe(1);
          expect(scope.currentLastResultIndex).toBe(2);
          scope.searchForCases({sort: {predicate: 'Version', reverse: false}});
          expect(scope.currentFirstResultIndex).toBe(1);
          expect(scope.currentLastResultIndex).toBe(2);

          expect(caseAPI.search.calls.allArgs()).toEqual([
            [
              {p: 0, c: defaultPageSize, o: defaultSort + ' ASC', d: defaultDeployedFields}
            ],
            [
              {p: 0, c: defaultPageSize, o: 'name DESC', d: defaultDeployedFields}
            ],
            [
              {p: 1, c: defaultPageSize, o: 'name DESC', d: defaultDeployedFields}
            ],
            [
              {p: 0, c: defaultPageSize, o: 'name DESC', d: defaultDeployedFields}
            ],
            [
              {p: 0, c: defaultPageSize, o: 'version ASC', d: defaultDeployedFields}
            ]
          ]);
        });
      });

      describe('when tableState changes', function () {
        describe('casesSearch', function () {
          var defaultPageSize = 1000;
          var defaultSort = 'id';
          var defaultDeployedFields = ['titi', 'tata', 'toto'];

          beforeEach(inject(function ($controller) {
            $controller('casesListCtrl', {
              '$scope': scope,
              'caseAPI': caseAPI,
              'defaultPageSize': defaultPageSize,
              'defaultSort': defaultSort,
              'defaultDeployedFields': defaultDeployedFields,
              'casesColumns': [
                {name: 'AppName', sortName: 'name', path: ['processDefinitionId', 'name'] },
                {name: 'Version', sortName: 'version', path: ['processDefinitionId', 'version']},
                {name: 'CaseId', sortName: 'id', path: ['id']}
              ]
            });
          }));
          it('should call default sort on empty tableState', function () {
            scope.searchForCases();

            expect(caseAPI.search.calls.allArgs()).toEqual([
              [
                {p: 0, c: defaultPageSize, o: defaultSort + ' ASC', d: defaultDeployedFields}
              ],
              [
                {p: 0, c: defaultPageSize, o: defaultSort + ' ASC', d: defaultDeployedFields}
              ]
            ]);
          });
          it('should call search on application name sort desc', function () {
            scope.searchForCases({sort: {predicate: 'AppName', reverse: true}});
            scope.searchForCases({sort: {predicate: 'AppName', reverse: false}});
            scope.searchForCases({sort: {predicate: 'Version', reverse: true}});
            expect(caseAPI.search.calls.allArgs()).toEqual([
              [
                {p: 0,c: defaultPageSize,o: defaultSort + ' ASC',d: defaultDeployedFields}
              ],
              [
                {p: 0,c: defaultPageSize,o: 'name DESC',d: defaultDeployedFields}
              ],
              [
                {p: 0,c: defaultPageSize,o: 'name ASC',d: defaultDeployedFields}
              ],
              [
                {p: 0,c: defaultPageSize,o: 'version DESC',d: defaultDeployedFields}
              ]
            ]);
          });
        });
      });
      describe('when server returns an error on case search', function(){

        describe('about 401 unauthorized', function(){
          it('should redirect to the login page', inject(function($controller){
            var location = { url : function(){}};
            spyOn(location, 'url').and.callThrough();
            $controller('casesListCtrl', {
              '$scope': scope,
              'caseAPI': {
                search: function () {
                  return {
                    '$promise': {
                      then: function (successMethod, errorMethod) {
                        errorMethod({status : 401});
                      }
                    }
                  };
                }
              },
              '$location' : location
            });
            expect(location.url).toHaveBeenCalled();
            expect(location.url.calls.allArgs()).toEqual([ ['/'] ]);
          }));
        });
        describe('about 500 Internal Error', function(){
          it('should redirect to the login page', inject(function($controller){
            var error = {status : 500, statusText : 'Internal Server Error', data: {resource:'bpm/case', message : 'Invalid search !!'}};
            $controller('casesListCtrl', {
              '$scope': scope,
              'caseAPI': {
                search: function () {
                  return {
                    '$promise': {
                      then: function (successMethod, errorMethod) {
                        errorMethod(error);
                      }
                    }
                  };
                }
              }
            });
            expect(scope.alerts).toEqual([{status: error.status, statusText: error.statusText, type: 'danger', errorMsg : error.data.message, resource : error.data.api + '/' + error.data.resource}]);
            scope.closeAlert(0);
            expect(scope.alerts).toEqual([]);
          }));
        });
      });
    });
  });
})();
