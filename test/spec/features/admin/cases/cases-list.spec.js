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

      describe('process filters init', function(){
        var storeLoadFunction = function(processes){
          return function(){
              return { then : function(successFunction){
                successFunction(processes);
              }};
            };
        };

        it('should have the default app value (all Apps) selected on init when there is no processes', inject(function ($controller) {
          var defaultSelectedApp = 'default App',
           defaultSelectedVersion = 'default Version';
          $controller('casesListCtrl', {
            '$scope': scope,
            'defaultSelectedApp': defaultSelectedApp,
            'defaultSelectedVersion': defaultSelectedVersion,
            'store' : { load: storeLoadFunction([])}
          });
          expect(scope.apps).toEqual([]);
          expect(scope.appNames).toEqual([]);
          expect(scope.versions).toEqual([]);
          expect(scope.selectedProcessDefinition).toEqual(undefined);
          expect(scope.selectedVersion).toBe(defaultSelectedVersion);
          expect(scope.defaultSelectedApp).toEqual(defaultSelectedApp);
        }));

        it('should have the default app value (all Apps) selected on init and apps filter filled', inject(function ($controller) {
          var defaultSelectedApp = 'default App',
           defaultSelectedVersion = 'default Version',
              processes = [{name:'App1'},{name: 'App2'},{name : 'App3'}];
          $controller('casesListCtrl', {
            '$scope': scope,
            'defaultSelectedApp': defaultSelectedApp,
            'defaultSelectedVersion': defaultSelectedVersion,
            'store' : { load: storeLoadFunction(processes)}
          });
          expect(scope.apps).toBe(processes);
          expect(scope.appNames).toEqual(['App1','App2','App3']);
          expect(scope.versions).toEqual([]);
          expect(scope.selectedProcessDefinition).toEqual(undefined);
          expect(scope.selectedVersion).toBe(defaultSelectedVersion);
          expect(scope.defaultSelectedApp).toEqual(defaultSelectedApp);
        }));

        it('should have the default app value (all Apps) selected on init and apps filter filled', inject(function ($controller) {
          var defaultSelectedApp = 'default App',
           defaultSelectedVersion = 'default Version',
              processes = [{},{name: 'App2'},{name : 'App3'}];
          $controller('casesListCtrl', {
            '$scope': scope,
            'defaultSelectedApp': defaultSelectedApp,
            'defaultSelectedVersion': defaultSelectedVersion,
            'store' : { load: storeLoadFunction(processes)}
          });
          expect(scope.apps).toBe(processes);
          expect(scope.appNames).toEqual(['App2','App3']);
          expect(scope.versions).toEqual([]);
          expect(scope.selectedProcessDefinition).toEqual(undefined);
          expect(scope.selectedVersion).toBe(defaultSelectedVersion);
          expect(scope.defaultSelectedApp).toEqual(defaultSelectedApp);
        }));
      });


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
            expect(singleCase[scope.columns[1].name]).toBeFalsy();
            expect(singleCase[scope.columns[2].name]).toBeFalsy();
          }
          expect(caseAPI.search).toHaveBeenCalledWith({p: 0, c: defaultPageSize, o: defaultSort + ' ASC', d: defaultDeployedFields, f: []});
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
          expect(caseAPI.search).toHaveBeenCalledWith({p: 0, c: defaultPageSize, o: defaultSort + ' ASC', d: defaultDeployedFields, f: []});
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
              {p: 0, c: defaultPageSize, o: defaultSort + ' ASC', d: defaultDeployedFields, f:[]}
            ],
            [
              {p: 0, c: defaultPageSize, o: 'name DESC', d: defaultDeployedFields, f:[]}
            ],
            [
              {p: 1, c: defaultPageSize, o: 'name DESC', d: defaultDeployedFields, f:[]}
            ],
            [
              {p: 0, c: defaultPageSize, o: 'name DESC', d: defaultDeployedFields, f:[]}
            ],
            [
              {p: 0, c: defaultPageSize, o: 'version ASC', d: defaultDeployedFields, f:[]}
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
                {p: 0, c: defaultPageSize, o: defaultSort + ' ASC', d: defaultDeployedFields, f:[]}
              ],
              [
                {p: 0, c: defaultPageSize, o: defaultSort + ' ASC', d: defaultDeployedFields, f:[]}
              ]
            ]);
          });
          it('should call search on application name sort desc', function () {
            scope.searchForCases({sort: {predicate: 'AppName', reverse: true}});
            scope.searchForCases({sort: {predicate: 'AppName', reverse: false}});
            scope.searchForCases({sort: {predicate: 'Version', reverse: true}});
            expect(caseAPI.search.calls.allArgs()).toEqual([
              [
                {p: 0, c: defaultPageSize, o: defaultSort + ' ASC', d: defaultDeployedFields, f:[]}
              ],
              [
                {p: 0, c: defaultPageSize, o: 'name DESC', d: defaultDeployedFields, f:[]}
              ],
              [
                {p: 0, c: defaultPageSize, o: 'name ASC', d: defaultDeployedFields, f:[]}
              ],
              [
                {p: 0, c: defaultPageSize, o: 'version DESC', d: defaultDeployedFields, f:[]}
              ]
            ]);
          });
        });
      });
      describe('when server returns an error on case search', function () {

        describe('about 401 unauthorized', function () {
          it('should redirect to the login page', inject(function ($controller) {
            var location = { url: function () {
            }};
            spyOn(location, 'url').and.callThrough();
            $controller('casesListCtrl', {
              '$scope': scope,
              'caseAPI': {
                search: function () {
                  return {
                    '$promise': {
                      then: function (successMethod, errorMethod) {
                        errorMethod({status: 401});
                      }
                    }
                  };
                }
              },
              '$location': location
            });
            expect(location.url).toHaveBeenCalled();
            expect(location.url.calls.allArgs()).toEqual([
              ['/']
            ]);
          }));
        });
        describe('about 500 Internal Error', function () {
          it('should redirect to the login page', inject(function ($controller) {
            var error = {status: 500, statusText: 'Internal Server Error', data: {resource: 'bpm/case', message: 'Invalid search !!'}};
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
            expect(scope.alerts).toEqual([
              {status: error.status, statusText: error.statusText, type: 'danger', errorMsg: error.data.message, resource: error.data.api + '/' + error.data.resource}
            ]);
            scope.closeAlert(0);
            expect(scope.alerts).toEqual([]);
          }));
        });
      });
    });

    describe('change column visiblity', function(){
      beforeEach(inject(function ($controller) {
        $controller('casesListCtrl', {
          '$scope': scope
        });
      }));
      it('should set selected to false when it was true', function() {
        var column = {selected: true};
        scope.selectColumn(column);
        expect(column.selected).toBeFalsy();
      });
      it('should set selected to true when it was false', function() {
        var column = {selected: false};
        scope.selectColumn(column);
        expect(column.selected).toBeTruthy();
      });
    });

    describe('filter column ', function(){
      beforeEach(inject(function ($controller) {
        $controller('casesListCtrl', {
          '$scope': scope
        });
      }));
      it('should return false when column is not selected', function() {
        var column = {selected: false};
        expect(scope.filterColumn(column)).toBeFalsy();
      });
      it('should return true when column is selected', function() {
        var column = {selected: true};
        expect(scope.filterColumn(column)).toBeTruthy();
      });
    });

    describe('select nbItems in page ', function(){
      beforeEach(inject(function ($controller) {
        $controller('casesListCtrl', {
          '$scope': scope
        });
        spyOn(scope,'searchForCases');
      }));
      it('should do nothing if nothing is passed', function() {
        var itemsPerPage = scope.itemsPerPage;
        scope.changeItemPerPage();
        expect(scope.searchForCases).not.toHaveBeenCalled();
        expect(scope.itemsPerPage).toBe(itemsPerPage);
      });
      it('should change the number and reinit page number', function() {
        var itemsPerPage = 50;
        scope.currentPage = 2;
        scope.changeItemPerPage(itemsPerPage);
        expect(scope.searchForCases).toHaveBeenCalledWith();
        expect(scope.itemsPerPage).toBe(itemsPerPage);
        expect(scope.currentPage).toBe(1);
      });
    });

    describe('resizable column directive', function () {
      var compile, timeout;
      beforeEach(inject(function ($rootScope, _$compile_, $timeout) {
        compile = _$compile_;
        scope = $rootScope.$new();
        timeout = $timeout;
      }));

      afterEach(function () {
        timeout.verifyNoPendingTasks();
      });
      it('should call the jQuery Plugin resizable-column function', function () {
        var element = compile('<div><table resizable-column><thead><tr><th>column 1</th><th>column 2</th></tr></thead><tbody><tr><td>content 1</td><td>content 2</td></tr></tbody></table></div>')(scope);
        element[0].style.width = 1000;
        scope.columns = [];
        scope.$apply();
        timeout.flush();
        expect(element.find('.rc-handle').length).toBe(1);
        scope.columns.push('test');
        element.find('tr th').parent().first().append('<th>new column 1</th><th>new column 2</th>');
        element.find('tr td').parent().first().append('<td>new content 1</td><td>new content 2</td>');
        scope.$apply();
        timeout.flush();
        element.find('tr th').first().remove();
        element.find('tr td').first().remove();
        scope.columns.pop();
        scope.$apply();
        timeout.flush();
        expect(element.find('.rc-handle').length).toBe(2);
      });
    });
    describe('filters', function(){
      describe('AppName', function (){
        var allApps = 'AllApps';
        beforeEach(inject(function ($controller) {
          $controller('casesListCtrl', {
            '$scope': scope,
            'defaultSelectedApp' : allApps,
            'store' : { load: function() { return {then : function(){}};}},
            'caseAPI' : { search: function() { return { '$promise': { then : function(){}}};}}
          });
          spyOn(scope,'filterVersion');
          spyOn(scope,'updateFilter');
        }));

        it('should change the App Name Filter and update search filter when an app is selected', function(){
          var appName = 'tests';
          scope.selectApp(appName);
          expect(scope.filterVersion).toHaveBeenCalledWith('tests');
          expect(scope.selectedApp).toBe(appName);
          scope.$apply();
          expect(scope.updateFilter).toHaveBeenCalled();

        });
        it('should do nothing when the same app is selected', function(){
          var appName = 'tests';
          scope.selectedApp = appName;
          scope.selectApp(appName);
          expect(scope.filterVersion).not.toHaveBeenCalled();
          expect(scope.selectedApp).toBe(appName);
        });
        it('should change the App Name Filter and reset search filter when all apps is selected', function(){
          var appName = allApps;
          scope.selectedApp = 'tests';
          scope.selectApp(appName);
          expect(scope.filterVersion).toHaveBeenCalled();
          expect(scope.selectedApp).toBe(allApps);
          scope.$apply();
          expect(scope.updateFilter).toHaveBeenCalled();
        });
        it('should change the App Name Filter and reset search filter when empty app is selected', function(){
          scope.selectedApp = 'tests';
          scope.selectApp();
          expect(scope.filterVersion).toHaveBeenCalled();
          expect(scope.selectedApp).toBe(allApps);
          scope.$apply();
          expect(scope.updateFilter).toHaveBeenCalled();
        });
      });

      describe('Version Contengency', function(){
        describe('version filter update ', function(){
          var allApps = 'AllApps';
          beforeEach(inject(function ($controller) {
            $controller('casesListCtrl', {
              '$scope': scope,
              'defaultSelectedApp' : allApps
            });
            spyOn(scope,'searchForCases');

          }));
        });
        it('should not be available if no appName is selected', function(){

        });
      });
    });
  });
})();
