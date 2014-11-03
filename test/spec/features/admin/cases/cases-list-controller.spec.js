/* global cases, describe  */
(function () {
  'use strict';
  describe('admin cases list features', function () {

    var scope, caseAPI, fullCases, promise;

    beforeEach(module('org.bonita.features.admin.cases.list'));

    beforeEach(inject(function ($rootScope) {
      //we use the casesListMocks.js in order to init data for the test
      fullCases = {resource: cases};
      fullCases.resource.pagination = {
        total: 4
      };
      scope = $rootScope.$new();
      promise = {
        then: function (method) {
          method(fullCases);
          return promise;
        },
        finally: function (finallyMethod) {
          finallyMethod();
          return promise;
        }
      };
      caseAPI = {
        search: function () {
          return {
            '$promise': promise
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
          $controller('CaseListCtrl', {
            '$scope': scope,
            'caseAPI': caseAPI,
            'defaultPageSize': defaultPageSize,
            'defaultSort': defaultSort,
            'defaultDeployedFields': defaultDeployedFields,
            'casesColumns': [
              {name: 'AppName', sortName: 'name', path: ['processDefinitionId', 'name']},
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
          expect(caseAPI.search).toHaveBeenCalledWith({
            p: 0,
            c: defaultPageSize,
            o: defaultSort + ' ASC',
            d: defaultDeployedFields,
            f: []
          });
        });
      });

      describe('with correct columns', function () {

        beforeEach(inject(function ($controller) {
          $controller('CaseListCtrl', {
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
            d: defaultDeployedFields,
            f: []
          });
        }));
      });
    });

    describe('sort behaviour', function () {
      describe('select row', function () {
        beforeEach(inject(function ($controller) {
          $controller('CaseListCtrl', {
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
        var anchorScroll = jasmine.createSpy();

        beforeEach(inject(function ($controller) {
          $controller('CaseListCtrl', {
            '$scope': scope,
            'caseAPI': caseAPI,
            'defaultPageSize': defaultPageSize,
            'defaultSort': defaultSort,
            'defaultDeployedFields': defaultDeployedFields,
            'casesColumns': [
              {name: 'AppName', sortName: 'name', path: ['processDefinitionId', 'name']},
              {name: 'Version', sortName: 'version', path: ['processDefinitionId', 'version']},
              {name: 'CaseId', sortName: 'id', path: ['id']}
            ],
            '$anchorScroll': anchorScroll
          });
        }));
        it('should call next Page without sort', function () {

          expect(scope.currentFirstResultIndex).toBe(1);
          expect(scope.currentLastResultIndex).toBe(2);
          scope.pagination.currentPage++;
          scope.searchForCases();
          expect(scope.currentFirstResultIndex).toBe(3);
          expect(scope.currentLastResultIndex).toBe(4);
          expect(anchorScroll).toHaveBeenCalled();
          expect(caseAPI.search.calls.allArgs()).toEqual([
            [
              {p: 0, c: defaultPageSize, o: defaultSort + ' ASC', d: defaultDeployedFields, f: []}
            ],
            [
              {p: 1, c: defaultPageSize, o: defaultSort + ' ASC', d: defaultDeployedFields, f: []}
            ],
          ]);
        });
        it('should call next Page on current sort', function () {

          scope.searchForCases({sort: {predicate: 'name', reverse: true}});
          expect(scope.currentFirstResultIndex).toBe(1);
          expect(scope.currentLastResultIndex).toBe(2);
          expect(anchorScroll).toHaveBeenCalled();
          scope.pagination.currentPage++;
          scope.searchForCases();
          expect(scope.currentFirstResultIndex).toBe(3);
          expect(scope.currentLastResultIndex).toBe(4);
          expect(anchorScroll).toHaveBeenCalled();
          scope.pagination.currentPage--;
          scope.searchForCases();
          expect(scope.currentFirstResultIndex).toBe(1);
          expect(scope.currentLastResultIndex).toBe(2);
          expect(anchorScroll).toHaveBeenCalled();
          scope.searchForCases({sort: {predicate: 'version', reverse: false}});
          expect(scope.currentFirstResultIndex).toBe(1);
          expect(scope.currentLastResultIndex).toBe(2);
          expect(anchorScroll).toHaveBeenCalled();

          expect(caseAPI.search.calls.allArgs()).toEqual([
            [
              {p: 0, c: defaultPageSize, o: defaultSort + ' ASC', d: defaultDeployedFields, f: []}
            ],
            [
              {p: 0, c: defaultPageSize, o: 'name DESC', d: defaultDeployedFields, f: []}
            ],
            [
              {p: 1, c: defaultPageSize, o: 'name DESC', d: defaultDeployedFields, f: []}
            ],
            [
              {p: 0, c: defaultPageSize, o: 'name DESC', d: defaultDeployedFields, f: []}
            ],
            [
              {p: 0, c: defaultPageSize, o: 'version ASC', d: defaultDeployedFields, f: []}
            ]
          ]);
        });
      });

      describe('when tableState changes', function () {
        describe('casesSearch', function () {
          var defaultPageSize = 1000;
          var defaultSort = 'id';
          var defaultDeployedFields = ['titi', 'tata', 'toto'];
          var anchorScroll = jasmine.createSpy();

          beforeEach(inject(function ($controller) {
            $controller('CaseListCtrl', {
              '$scope': scope,
              'caseAPI': caseAPI,
              'defaultPageSize': defaultPageSize,
              'defaultSort': defaultSort,
              'defaultDeployedFields': defaultDeployedFields,
              'casesColumns': [
                {name: 'AppName', sortName: 'name', path: ['processDefinitionId', 'name']},
                {name: 'Version', sortName: 'version', path: ['processDefinitionId', 'version']},
                {name: 'CaseId', sortName: 'id', path: ['id']}
              ],
              '$anchorScroll': anchorScroll
            });
          }));
          it('should call default sort on empty tableState', function () {
            scope.searchForCases();
            expect(anchorScroll).toHaveBeenCalled();

            expect(caseAPI.search.calls.allArgs()).toEqual([
              [
                {p: 0, c: defaultPageSize, o: defaultSort + ' ASC', d: defaultDeployedFields, f: []}
              ],
              [
                {p: 0, c: defaultPageSize, o: defaultSort + ' ASC', d: defaultDeployedFields, f: []}
              ]
            ]);
            expect(anchorScroll).toHaveBeenCalled();
          });
          it('should call search on application name sort desc', function () {
            scope.searchForCases({sort: {predicate: 'name', reverse: true}});
            expect(anchorScroll).toHaveBeenCalled();
            scope.searchForCases({sort: {predicate: 'name', reverse: false}});
            expect(anchorScroll).toHaveBeenCalled();
            scope.searchForCases({sort: {predicate: 'version', reverse: true}});
            expect(anchorScroll).toHaveBeenCalled();
            expect(caseAPI.search.calls.allArgs()).toEqual([
              [
                {p: 0, c: defaultPageSize, o: defaultSort + ' ASC', d: defaultDeployedFields, f: []}
              ],
              [
                {p: 0, c: defaultPageSize, o: 'name DESC', d: defaultDeployedFields, f: []}
              ],
              [
                {p: 0, c: defaultPageSize, o: 'name ASC', d: defaultDeployedFields, f: []}
              ],
              [
                {p: 0, c: defaultPageSize, o: 'version DESC', d: defaultDeployedFields, f: []}
              ]
            ]);

          });
        });
      });
      describe('when server returns an error on case search', function () {

        describe('about 401 unauthorized', function () {
          it('should redirect to the login page', inject(function ($controller) {
            var location = {
              url: function () {
              }
            };
            var localPromise = {
              then: function (successMethod, errorMethod) {
                errorMethod({status: 401});
                return localPromise;
              },
              finally: function (finallyMethod) {
                finallyMethod();
                return localPromise;
              }
            };
            spyOn(location, 'url').and.callThrough();
            $controller('CaseListCtrl', {
              '$scope': scope,
              'caseAPI': {
                search: function () {
                  return {
                    '$promise': localPromise
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
            var error = {
              status: 500,
              statusText: 'Internal Server Error',
              data: {resource: 'bpm/case', message: 'Invalid search !!'}
            };
            var localPromise = {
              then: function (successMethod, errorMethod) {
                errorMethod(error);
                return localPromise;
              },
              finally: function (finallyMethod) {
                finallyMethod();
                return localPromise;
              }
            };
            var growl = jasmine.createSpyObj('growl', ['success', 'error', 'info']);
            $controller('CaseListCtrl', {
              '$scope': scope,
              'caseAPI': {
                search: function () {
                  return {
                    '$promise': localPromise
                  };
                }
              },
              'growl': growl
            });
            expect(growl.error).toHaveBeenCalled();
            expect(growl.error.calls.allArgs()).toEqual([[
              error.status + ' ' + error.statusText + ' ' + error.data.message,
              {ttl: 3000, disableCountDown: true, disableIcons: true}
            ]]);
          }));
        });
      });
    });

    describe('change column visiblity', function () {
      beforeEach(inject(function ($controller) {
        $controller('CaseListCtrl', {
          '$scope': scope
        });
      }));
      it('should set selected to false when it was true', function () {
        var column = {selected: true};
        scope.selectColumn(column);
        expect(column.selected).toBeFalsy();
      });
      it('should set selected to true when it was false', function () {
        var column = {selected: false};
        scope.selectColumn(column);
        expect(column.selected).toBeTruthy();
      });
    });

    describe('filter column ', function () {
      beforeEach(inject(function ($controller) {
        $controller('CaseListCtrl', {
          '$scope': scope
        });
      }));
      it('should return false when column is not selected', function () {
        var column = {selected: false};
        expect(scope.filterColumn(column)).toBeFalsy();
      });
      it('should return true when column is selected', function () {
        var column = {selected: true};
        expect(scope.filterColumn(column)).toBeTruthy();
      });
    });

    describe('select nbItems in page ', function () {
      beforeEach(inject(function ($controller) {
        $controller('CaseListCtrl', {
          '$scope': scope
        });
        spyOn(scope, 'searchForCases');
      }));
      it('should do nothing if nothing is passed', function () {
        var itemsPerPage = scope.itemsPerPage;
        scope.changeItemPerPage();
        expect(scope.searchForCases).not.toHaveBeenCalled();
        expect(scope.itemsPerPage).toBe(itemsPerPage);
      });
      it('should change the number and reinit page number', function () {
        var itemsPerPage = 50;
        scope.currentPage = 2;
        scope.changeItemPerPage(itemsPerPage);
        expect(scope.searchForCases).toHaveBeenCalledWith();
        expect(scope.pagination.itemsPerPage).toBe(itemsPerPage);
        expect(scope.pagination.currentPage).toBe(1);
      });
    });

    describe('formatContent', function () {
      beforeEach(inject(function ($controller) {
        $controller('CaseListCtrl', {
          '$scope': scope
        });
      }));
      it('should not format data', function () {
        var data = 'test';
        expect(scope.formatContent([], data)).toBe(data);
      });
      it('should not format date when data is not in the right format', function () {
        var data = 'test';
        expect(scope.formatContent({date: true}, data)).toBe(data);
      });
      it('should not format date when data is not in the right format', function () {
        var data = '2014-10-17 16:05:42.626';
        var expectedFormatedData = '2014-10-17 16:05';
        expect(scope.formatContent({date: true}, data)).toBe(expectedFormatedData);
      });
    });

    describe('addAlert', function () {
      var growl = jasmine.createSpyObj('growl', ['success', 'error', 'info']);
      beforeEach(inject(function ($controller) {
        $controller('CaseListCtrl', {
          '$scope': scope,
          'growl' : growl
        });
      }));
      it('should call growl to add Notification error', function(){
        var error = {
          status: 500,
          statusText: 'Internal Server Error',
          errorMsg : 'Invalid search on bpm/case',
          type : 'danger'
        };
        scope.addAlert(error);
        expect(growl.error).toHaveBeenCalled();
        expect(growl.error.calls.allArgs()).toEqual([[
          error.status + ' ' + error.statusText + ' ' + error.errorMsg,
          {ttl: 3000, disableCountDown: true, disableIcons: true}
        ]]);
      });
      it('should call growl to add Notification success', function(){
        var error = {
          statusText: 'successfully deleted 1 case',
          type : 'success'
        };
        scope.addAlert(error);
        expect(growl.success).toHaveBeenCalled();
        expect(growl.success.calls.allArgs()).toEqual([[
          error.statusText,
          {ttl: 3000, disableCountDown: true, disableIcons: true}
        ]]);
      });
      it('should call growl to add Notification default', function(){
        var error = {
          statusText: 'successfully deleted 1 case'
        };
        scope.addAlert(error);
        expect(growl.info).toHaveBeenCalled();
        expect(growl.info.calls.allArgs()).toEqual([[
          error.statusText,
          {ttl: 3000, disableCountDown: true, disableIcons: true}
        ]]);
      });
    });

    describe('reinitCases', function () {
      it('should remove sort and set page to 1', inject(function ($controller) {
        $controller('CaseListCtrl', {
          '$scope': scope
        });
        scope.searchSort = {};
        scope.pagination.currentPage = 10;
        spyOn(scope, 'searchForCases');
        scope.reinitCases();
        expect(scope.searchSort).toBeUndefined();
        expect(scope.pagination.currentPage).toBe(1);
        expect(scope.searchForCases).toHaveBeenCalledWith();
      }));
    });
    describe('filter updates', function () {
      beforeEach(inject(function ($controller) {

        var localPromise = {
          then: function () {
            return localPromise;
          },
          finally: function (finallyMethod) {
            finallyMethod();
            return localPromise;
          }
        };
        $controller('CaseListCtrl', {
          '$scope': scope,
          'store': {
            load: function () {
              return {
                then: function () {
                }
              };
            }
          },
          'caseAPI': {
            search: function () {
              return {
                '$promise': localPromise
              };
            }
          }
        });
        scope.$apply();
        spyOn(scope, 'searchForCases');
      }));
      describe('watch on filters', function () {
        it('should call search when filters update', function () {
          scope.filters = [
            {}
          ];
          scope.pagination.currentPage = 2;
          scope.$apply();
          expect(scope.searchForCases).toHaveBeenCalled();
          expect(scope.pagination.currentPage).toBe(1);
        });
      });
      describe('build filter', function () {
        it('should have process definition Id', function () {
          var processId = '2121354687951';
          scope.selectedProcessDefinition = processId;
          scope.buildFilters();
          expect(scope.filters).toEqual(['processDefinitionId=' + processId]);
          expect(scope.pagination.currentPage).toBe(1);
        });
        it('should have process definition Id only even id app name is set', function () {
          var processId = '2121354687951';
          scope.selectedProcessDefinition = processId;
          scope.selectedApp = 'Process1';
          scope.buildFilters();
          expect(scope.filters).toEqual(['processDefinitionId=' + processId]);
          expect(scope.pagination.currentPage).toBe(1);
        });
        it('should have app name', function () {
          scope.$digest();
          var processName = 'Process1';
          scope.selectedApp = processName;
          scope.buildFilters();
          expect(scope.filters).toEqual(['name=' + processName]);
          expect(scope.pagination.currentPage).toBe(1);
        });
      });
    });
  });
})();
