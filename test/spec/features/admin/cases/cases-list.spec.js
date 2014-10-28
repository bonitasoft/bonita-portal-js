/* global cases, describe  */
(function () {
  'use strict';
  describe('admin cases list features', function () {

    var scope, caseAPI, fullCases;

    beforeEach(module('org.bonita.features.admin.cases.list'));

    beforeEach(inject(function ($rootScope) {
      //we use the casesListMocks.js in order to init data for the test
      fullCases = {resource: cases};
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

      describe('process filters init', function () {
        var storeLoadFunction = function (processes) {
          return function () {
            return {
              then: function (successFunction) {
                successFunction(processes);
              }
            };
          };
        };

        it('should have the default app value (all Apps) selected on init when there is no processes', inject(function ($controller) {
          var defaultSelectedApp = 'default App',
            defaultSelectedVersion = 'default Version';
          $controller('casesListCtrl', {
            '$scope': scope,
            'defaultSelectedApp': defaultSelectedApp,
            'defaultSelectedVersion': defaultSelectedVersion,
            'store': {load: storeLoadFunction([])}
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
            processes = [
              {name: 'App1'},
              {name: 'App2'},
              {name: 'App3'}
            ];
          $controller('casesListCtrl', {
            '$scope': scope,
            'defaultSelectedApp': defaultSelectedApp,
            'defaultSelectedVersion': defaultSelectedVersion,
            'store': {load: storeLoadFunction(processes)}
          });
          expect(scope.apps).toBe(processes);
          expect(scope.appNames).toEqual(['App1', 'App2', 'App3']);
          expect(scope.versions).toEqual([]);
          expect(scope.selectedProcessDefinition).toEqual(undefined);
          expect(scope.selectedVersion).toBe(defaultSelectedVersion);
          expect(scope.defaultSelectedApp).toEqual(defaultSelectedApp);
        }));

        it('should have the default app value (all Apps) selected on init and apps filter filled', inject(function ($controller) {
          var defaultSelectedApp = 'default App',
            defaultSelectedVersion = 'default Version',
            processes = [
              {},
              {name: 'App2'},
              {name: 'App3'}
            ];
          $controller('casesListCtrl', {
            '$scope': scope,
            'defaultSelectedApp': defaultSelectedApp,
            'defaultSelectedVersion': defaultSelectedVersion,
            'store': {load: storeLoadFunction(processes)}
          });
          expect(scope.apps).toBe(processes);
          expect(scope.appNames).toEqual(['App2', 'App3']);
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
            d: defaultDeployedFields,
            f: []
          });
        }));
      });
    });

    describe('sort behaviour', function () {
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
              {name: 'AppName', sortName: 'name', path: ['processDefinitionId', 'name']},
              {name: 'Version', sortName: 'version', path: ['processDefinitionId', 'version']},
              {name: 'CaseId', sortName: 'id', path: ['id']}
            ]
          });
        }));
        it('should call next Page without sort', function () {

          expect(scope.currentFirstResultIndex).toBe(1);
          expect(scope.currentLastResultIndex).toBe(2);
          scope.pagination.currentPage++;
          scope.searchForCases();
          expect(scope.currentFirstResultIndex).toBe(3);
          expect(scope.currentLastResultIndex).toBe(4);

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
          scope.pagination.currentPage++;
          scope.searchForCases();
          expect(scope.currentFirstResultIndex).toBe(3);
          expect(scope.currentLastResultIndex).toBe(4);
          scope.pagination.currentPage--;
          scope.searchForCases();
          expect(scope.currentFirstResultIndex).toBe(1);
          expect(scope.currentLastResultIndex).toBe(2);
          scope.searchForCases({sort: {predicate: 'version', reverse: false}});
          expect(scope.currentFirstResultIndex).toBe(1);
          expect(scope.currentLastResultIndex).toBe(2);

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

          beforeEach(inject(function ($controller) {
            $controller('casesListCtrl', {
              '$scope': scope,
              'caseAPI': caseAPI,
              'defaultPageSize': defaultPageSize,
              'defaultSort': defaultSort,
              'defaultDeployedFields': defaultDeployedFields,
              'casesColumns': [
                {name: 'AppName', sortName: 'name', path: ['processDefinitionId', 'name']},
                {name: 'Version', sortName: 'version', path: ['processDefinitionId', 'version']},
                {name: 'CaseId', sortName: 'id', path: ['id']}
              ]
            });
          }));
          it('should call default sort on empty tableState', function () {
            scope.searchForCases();

            expect(caseAPI.search.calls.allArgs()).toEqual([
              [
                {p: 0, c: defaultPageSize, o: defaultSort + ' ASC', d: defaultDeployedFields, f: []}
              ],
              [
                {p: 0, c: defaultPageSize, o: defaultSort + ' ASC', d: defaultDeployedFields, f: []}
              ]
            ]);
          });
          it('should call search on application name sort desc', function () {
            scope.searchForCases({sort: {predicate: 'name', reverse: true}});
            scope.searchForCases({sort: {predicate: 'name', reverse: false}});
            scope.searchForCases({sort: {predicate: 'version', reverse: true}});
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
            var error = {
              status: 500,
              statusText: 'Internal Server Error',
              data: {resource: 'bpm/case', message: 'Invalid search !!'}
            };
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
              {
                status: error.status,
                statusText: error.statusText,
                type: 'danger',
                errorMsg: error.data.message,
                resource: error.data.api + '/' + error.data.resource
              }
            ]);
            scope.closeAlert(0);
            expect(scope.alerts).toEqual([]);
          }));
        });
      });
    });

    describe('change column visiblity', function () {
      beforeEach(inject(function ($controller) {
        $controller('casesListCtrl', {
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
        $controller('casesListCtrl', {
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
        $controller('casesListCtrl', {
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

    describe('filters', function () {
      describe('AppName', function () {
        var allApps = 'AllApps';
        beforeEach(inject(function ($controller) {
          $controller('casesListCtrl', {
            '$scope': scope,
            'defaultSelectedApp': allApps,
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
                  '$promise': {
                    then: function () {
                    }
                  }
                };
              }
            }
          });
          spyOn(scope, 'filterVersion');
          spyOn(scope, 'buildFilters').and.returnValue([]);
        }));

        it('should change the App Name Filter and update search filter when an app is selected', function () {
          var appName = 'tests';
          scope.selectApp(appName);
          expect(scope.selectedApp).toBe(appName);
          scope.$apply();
          expect(scope.filterVersion).toHaveBeenCalledWith(appName);
          expect(scope.selectedProcessDefinition).toBeUndefined();
          expect(scope.buildFilters).toHaveBeenCalled();
        });
        it('should do nothing when the same app is selected', function () {
          var appName = 'tests';
          scope.selectedApp = appName;
          scope.selectApp(appName);
          expect(scope.filterVersion).not.toHaveBeenCalled();
          expect(scope.selectedApp).toBe(appName);
        });
        it('should change the App Name Filter and reset search filter when all apps is selected', function () {
          var appName = allApps;
          scope.selectedApp = 'tests';
          scope.selectApp(appName);
          expect(scope.selectedApp).toBe(allApps);
          scope.$apply();
          expect(scope.filterVersion).toHaveBeenCalled();
          expect(scope.buildFilters).toHaveBeenCalled();
        });
        it('should change the App Name Filter and reset search filter when empty app is selected', function () {
          scope.selectedApp = 'tests';
          scope.selectApp();
          expect(scope.selectedApp).toBe(allApps);
          scope.$apply();
          expect(scope.filterVersion).toHaveBeenCalled();
          expect(scope.buildFilters).toHaveBeenCalled();
        });
      });

      describe('Version Contengency', function () {
        var allVersions = 'All Versions';
        describe('version filter update ', function () {
          beforeEach(inject(function ($controller) {
            $controller('casesListCtrl', {
              '$scope': scope,
              'defaultSelectedVersion': allVersions,
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
                    '$promise': {
                      then: function () {
                      }
                    }
                  };
                }
              }
            });
            scope.$apply();
            spyOn(scope, 'filterProcessDefinition');
            spyOn(scope, 'buildFilters').and.returnValue([]);
          }));
          it('should fill versions array with nothing', function () {
            scope.filterVersion();
            expect(scope.versions).toEqual([]);
            expect(scope.selectedVersion).toEqual(allVersions);
            scope.$apply();
            expect(scope.filterProcessDefinition).not.toHaveBeenCalled();
            expect(scope.buildFilters).not.toHaveBeenCalled();
          });
          it('should fill versions array with appropriate versions', function () {
            scope.apps = [
              {name: 'Process1', version: '1.0'},
              {name: 'Process1', version: '1.1'}
            ];
            scope.filterVersion('Process1');
            expect(scope.versions).toEqual(['1.0', '1.1']);
            expect(scope.selectedVersion).toEqual(allVersions);
            scope.$apply();
            expect(scope.filterProcessDefinition).not.toHaveBeenCalled();
            expect(scope.buildFilters).not.toHaveBeenCalled();
          });
          it('should fill versions array with appropriate versions when apps is wobbly', function () {
            scope.apps = [
              {name: 'Process1'},
              {name: 'Process1', version: '1.1'},
              undefined
            ];
            scope.filterVersion('Process1');
            expect(scope.versions).toEqual(['1.1']);
            expect(scope.selectedVersion).toEqual('1.1');
            scope.$apply();
            expect(scope.filterProcessDefinition).toHaveBeenCalledWith('1.1');
            expect(scope.buildFilters).toHaveBeenCalled();
          });
        });

        describe('App Version selection', function () {
          beforeEach(inject(function ($controller) {
            $controller('casesListCtrl', {
              '$scope': scope,
              'defaultSelectedVersion': allVersions,
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
                    '$promise': {
                      then: function () {
                      }
                    }
                  };
                }
              }
            });
            scope.$apply();
            spyOn(scope, 'filterProcessDefinition');
            spyOn(scope, 'buildFilters').and.returnValue([]);
          }));

          it('should change the App Version Filter and update search filter when an version is selected', function () {
            var appVersion = '1.0';
            scope.selectVersion(appVersion);
            expect(scope.selectedVersion).toBe(appVersion);
            scope.$apply();
            expect(scope.buildFilters).toHaveBeenCalled();
            expect(scope.filterProcessDefinition).toHaveBeenCalledWith('1.0');
          });
          it('should do nothing when the same version is selected', function () {
            var appVersion = '1.0';
            scope.selectVersion(appVersion);
            expect(scope.selectedVersion).toBe(appVersion);
            scope.$apply();
            expect(scope.buildFilters).toHaveBeenCalled();
            expect(scope.filterProcessDefinition).toHaveBeenCalledWith(appVersion);
            scope.buildFilters.calls.reset();
            scope.filterProcessDefinition.calls.reset();
            scope.selectVersion(appVersion);
            expect(scope.selectedVersion).toBe(appVersion);
            scope.$apply();
            expect(scope.buildFilters).not.toHaveBeenCalled();
            expect(scope.filterProcessDefinition).not.toHaveBeenCalled();
          });
          it('should change the App Version when all apps is selected', function () {
            var appVersion = '1.0';
            scope.selectVersion(appVersion);
            expect(scope.selectedVersion).toBe(appVersion);
            scope.$apply();
            expect(scope.buildFilters).toHaveBeenCalled();
            expect(scope.filterProcessDefinition).toHaveBeenCalledWith(appVersion);
            scope.buildFilters.calls.reset();
            scope.filterProcessDefinition.calls.reset();
            scope.selectVersion(allVersions);
            expect(scope.selectedVersion).toBe(allVersions);
            scope.$apply();
            expect(scope.buildFilters).toHaveBeenCalled();
            expect(scope.filterProcessDefinition).toHaveBeenCalledWith(allVersions);
          });
          it('should change the App Name Filter and reset search filter when empty app is selected', function () {
            var appVersion = '1.0';
            scope.selectVersion(appVersion);
            expect(scope.selectedVersion).toBe(appVersion);
            scope.$apply();
            expect(scope.buildFilters).toHaveBeenCalled();
            expect(scope.filterProcessDefinition).toHaveBeenCalledWith(appVersion);
            scope.buildFilters.calls.reset();
            scope.filterProcessDefinition.calls.reset();
            scope.selectVersion();
            expect(scope.selectedVersion).toBe(allVersions);
            scope.$apply();
            expect(scope.buildFilters).toHaveBeenCalled();
            expect(scope.filterProcessDefinition).toHaveBeenCalledWith(allVersions);
          });
        });
        describe('filterProcessDefinition', function () {
          beforeEach(inject(function ($controller) {
            $controller('casesListCtrl', {
              '$scope': scope
            });
          }));

          it('should delete selectedProcessDefinition when nothing is passed and not yet initialized', function () {
            scope.filterProcessDefinition();
            expect(scope.selectedProcessDefinition).toBeUndefined();
          });

          it('should delete selectedProcessDefinition when nothing is passed and was previously set', function () {
            scope.selectedProcessDefinition = '54684656872421';
            scope.filterProcessDefinition();
            expect(scope.selectedProcessDefinition).toBeUndefined();
          });
          it('should delete selectedProcessDefinition when nothing is passed and was previously set', function () {
            scope.selectedProcessDefinition = '12321654875431';
            scope.selectedApp = 'Process1';
            scope.apps = [
              {name: 'Process1', version: '1.0', 'id': '32165465132'},
              {name: 'Process1', version: '1.1', 'id': '98762168796'}
            ];
            scope.filterProcessDefinition('1.1');
            expect(scope.selectedProcessDefinition).toBe('98762168796');
          });
          it('should delete selectedProcessDefinition when nothing is passed and was previously set and wobbly apps', function () {
            scope.selectedProcessDefinition = '12321654875431';
            scope.selectedApp = 'Process1';
            scope.apps = [
              {name: 'Process1', version: '1.0'},
              {name: 'Process1', version: '1.1', 'id': '98762168796'},
              undefined
            ];
            scope.filterProcessDefinition('1.1');
            expect(scope.selectedProcessDefinition).toBe('98762168796');
            scope.selectedApp = 'Process1';
            scope.apps = [
              {name: 'Process1', version: '1.0'},
              {name: '', version: '1.2', 'id': '98762168796'},
              undefined
            ];
            scope.filterProcessDefinition('1.1');
            expect(scope.selectedProcessDefinition).toBeUndefined();
          });
        });
      });
      describe('filter updates', function () {
        describe('watch on filters', function () {
          beforeEach(inject(function ($controller) {
            $controller('casesListCtrl', {
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
                    '$promise': {
                      then: function () {
                      }
                    }
                  };
                }
              }
            });
            scope.$apply();
            spyOn(scope, 'searchForCases');
          }));
          it('should call search when filters update', function () {
            scope.filters = [
              {}
            ];
            scope.$apply();
            expect(scope.searchForCases).toHaveBeenCalled();
          });
        });
      });
      describe('build filter', function () {
        beforeEach(inject(function ($controller) {
          $controller('casesListCtrl', {
            '$scope': scope,
          });
        }));
        it('should have process definition Id', function () {
          var processId = '2121354687951';
          scope.selectedProcessDefinition = processId;
          expect(scope.buildFilters()).toEqual(['processDefinitionId=' + processId]);
        });
        it('should have process definition Id only even id app name is set', function () {
          var processId = '2121354687951';
          scope.selectedProcessDefinition = processId;
          scope.selectedApp = 'Process1';
          expect(scope.buildFilters()).toEqual(['processDefinitionId=' + processId]);
        });
        it('should have app name', function () {
          var processName = 'Process1';
          scope.selectedApp = processName;
          expect(scope.buildFilters()).toEqual(['name=' + processName]);
        });
      });
    });

    describe('formatContent', function () {
      beforeEach(inject(function ($controller) {
        $controller('casesListCtrl', {
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

    describe('reinitCases', function () {
      it('should remove sort and set page to 1', inject(function ($controller) {
        $controller('casesListCtrl', {
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

    describe('confirmDeleteSelectedCases', function () {
      var modal = {
        open: function () {
        }
      };
      beforeEach(inject(function ($controller) {
        $controller('casesListCtrl', {
          '$scope': scope,
          '$modal': modal
        });
      }));
      it('should do nothing if cases array is empty', function () {
        spyOn(modal, 'open');
        delete scope.cases;
        scope.confirmDeleteSelectedCases();
        expect(modal.open).not.toHaveBeenCalled();
      });
      it('should call open on modal with empty cases list', function () {
        var promise = {
          then: function () {
          }
        };
        spyOn(modal, 'open').and.returnValue({'result': promise});
        spyOn(promise, 'then');
        scope.cases = [];
        scope.confirmDeleteSelectedCases();
        expect(modal.open).toHaveBeenCalled();
        expect(promise.then).toHaveBeenCalledWith(scope.deleteSelectedCases);
        var modalOptions = modal.open.calls.argsFor(0);
        expect(modalOptions[0].resolve.caseItems()).toEqual([]);
      });
      it('should call open on modal with not empty cases list', function () {
        var promise = {
          then: function () {
          }
        };
        spyOn(modal, 'open').and.returnValue({'result': promise});
        spyOn(promise, 'then');
        var case1 = {selected: true};
        var case2 = {selected: false};
        scope.cases = [case1, case2];
        scope.confirmDeleteSelectedCases();
        expect(modal.open).toHaveBeenCalled();
        expect(promise.then).toHaveBeenCalledWith(scope.deleteSelectedCases);
        var modalOptions = modal.open.calls.argsFor(0);
        expect(modalOptions[0].resolve.caseItems()).toEqual([case1]);
      });
    });

    describe('checkCaseIsNotSelected', function () {
      beforeEach(inject(function ($controller) {
        $controller('casesListCtrl', {
          '$scope': scope
        });
      }));
      it('should return false when nothing is in the case array', function () {
        scope.cases = [];
        expect(scope.checkCaseIsNotSelected()).toBeTruthy();
      });
      it('should return false when nothing is selected', function () {
        scope.cases = [{selected: false}, {}];
        expect(scope.checkCaseIsNotSelected()).toBeTruthy();
      });
      it('should return true when somethings selected', function () {
        scope.cases = [{selected: true}, {}];
        expect(scope.checkCaseIsNotSelected()).toBeFalsy();
      });
    });

    describe('deleteSelectedCases', function () {
      var promise, searchSpy;
      var caseAPI = {
        search: function () {
          return {
            '$promise': {
              then: function () {
              }
            }
          };
        },
        delete: function () {
          return {
            '$promise': promise
          };
        }
      };
      beforeEach(inject(function ($controller) {
        $controller('casesListCtrl', {
          '$scope': scope,
          'caseAPI': caseAPI,
          'store': {
            load: function () {
              return {
                then: function () {
                }
              };
            }
          },
        });
        promise = {
          then: function (successMethod, errorMethod) {
            if (successMethod) {
              successMethod();
            }else if (errorMethod) {
              errorMethod();
            }
            return promise;
          }
        };
        spyOn(caseAPI, 'delete').and.callThrough();
        searchSpy = spyOn(caseAPI, 'search').and.callThrough();
      }));
      it('should delete nothing if cases array is empty', function () {
        scope.deleteSelectedCases();
        expect(caseAPI.delete).not.toHaveBeenCalled();
      });
      it('should delete nothing if nothing is selected', function () {
        scope.cases = [{selected: false, id: '1'}, {selected: false, id: '324'}];
        scope.deleteSelectedCases();
        expect(caseAPI.delete).not.toHaveBeenCalled();
        expect(scope.cases).toEqual([{selected: false, id: '1'}, {selected: false, id: '324'}]);
      });
      it('should delete nothing if selected items have no id', function () {
        scope.cases = [{selected: false, id: '1'}, {selected: true}];
        scope.deleteSelectedCases();
        expect(caseAPI.delete).not.toHaveBeenCalled();
        expect(scope.cases).toEqual([{selected: false, id: '1'}, {selected: true}]);
      });
      it('should delete all selected cases', function () {
        scope.cases = [{selected: true, id: '1'}, {selected: true, id: '324'}];
        caseAPI.search.calls.reset();
        searchSpy.and.returnValue({
            '$promise': {
              then: function (success) {
                var resource = [];
                resource.pagination = {total : 0};
                success({resource : resource});
              }
            }
          });
        scope.deleteSelectedCases();
        expect(caseAPI.search).toHaveBeenCalled();
        expect(caseAPI.delete).toHaveBeenCalled();
        expect(caseAPI.delete.calls.allArgs()).toEqual([[{id: '324'}], [{id: '1'}]]);
        expect(scope.alerts.length).toBe(1);
        expect(scope.alerts[0]).toEqual({type: 'success', status: '2 case(s) deleted successfully'});
        expect(scope.cases).toEqual([]);
      });
      it('should delete all cases even if one of them fails', inject(function ($q) {
        scope.cases = [{selected: true, id: '1'}, {selected: true, id: '324'}];
        var deferredError = $q.defer();
        var deferredSuccess = $q.defer();
        promise = deferredError.promise;
        promise.then(undefined, function(){
          promise = deferredSuccess.promise;
        });
        var error = {
          status: 500,
          statusText: 'Internal Server Error',
          data: {resource: 'bpm/case', message: 'impossible to delete'}
        };
        deferredError.reject(error);
        deferredSuccess.resolve();
        caseAPI.search.calls.reset();
        searchSpy.and.returnValue({
            '$promise': {
              then: function (success) {
                var resource = [{name: 'Process1', version: '1.0', 'id': '324'}];
                resource.pagination = {total : 0};
                success({resource : resource});
              }
            }
          });
        scope.deleteSelectedCases();
        scope.$apply();
        expect(caseAPI.search).toHaveBeenCalled();
        expect(caseAPI.delete).toHaveBeenCalled();
        expect(caseAPI.delete.calls.allArgs()).toEqual([[{id: '324'}], [{id: '1'}]]);
        expect(scope.alerts.length).toBe(2);
        expect(scope.alerts[0]).toEqual({ status : 500, statusText : 'Internal Server Error', type : 'danger', errorMsg : 'impossible to delete', resource : 'undefined/bpm/case' });
        expect(scope.alerts[1]).toEqual({type: 'success', status: '1 case(s) deleted successfully'});
        expect(scope.cases).toEqual([{ 'App name' : undefined, Version : undefined, ID : '324', 'Start date' : undefined, 'Started by' : undefined, State : undefined, id : '324' }]);
      }));
      it('should delete nothing even all fails', inject(function ($q) {
        scope.cases = [{selected: true, id: '1'}, {selected: true, id: '324'}];
        var deferredError = $q.defer();
        promise = deferredError.promise;
        var error = {
          status: 500,
          statusText: 'Internal Server Error',
          data: {resource: 'bpm/case', message: 'impossible to delete'}
        };
        deferredError.reject(error);
        caseAPI.search.calls.reset();
        searchSpy.and.returnValue({
          '$promise': {
            then: function (success) {
              var resource = [];
              resource.pagination = {total : 0};
              success({resource : resource});
            }
          }
        });
        scope.deleteSelectedCases();
        expect(caseAPI.search).not.toHaveBeenCalled();
        scope.$apply();
        expect(caseAPI.delete).toHaveBeenCalled();
        expect(caseAPI.delete.calls.allArgs()).toEqual([[{id: '324'}], [{id: '1'}]]);
        expect(scope.alerts.length).toBe(3);
        expect(scope.alerts[0]).toEqual({ status : 500, statusText : 'Internal Server Error', type : 'danger', errorMsg : 'impossible to delete', resource : 'undefined/bpm/case' });
        expect(scope.alerts[1]).toEqual({ status : 500, statusText : 'Internal Server Error', type : 'danger', errorMsg : 'impossible to delete', resource : 'undefined/bpm/case' });
        expect(scope.alerts[2]).toEqual({type: 'success', status: '0 case(s) deleted successfully'});
        expect(scope.cases).toEqual([]);
      }));
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
  });
})();
