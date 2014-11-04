/* global describe  */
(function () {
  'use strict';
  describe('admin cases list features', function () {

    var scope, globalProcesses , defaultFilters, caseStatusValues, store;
    var storeLoadFunction = function (processes) {
      return function () {
        return {
          then: function (successFunction) {
            successFunction(processes);
          }
        };
      };
    };

    beforeEach(module('features/admin/cases/cases-list-filters.html'));

    beforeEach(module('org.bonita.features.admin.cases.list'));
    beforeEach(inject(function ($rootScope, $compile, _defaultFilters_, _caseStatusValues_, _store_) {
      //{appVersion: 'All versions', appName: 'All apps', caseStatus: 'All states'}
      globalProcesses = [];
      defaultFilters = _defaultFilters_;
      caseStatusValues = _caseStatusValues_;
      store = _store_;
      scope = $rootScope.$new();
      scope.buildFilters = function() {};

    }));

    it('should load directive without any error', inject(function($compile){
      $compile('<active-case-filters></active-case-filters')(scope);
    }));

    describe('controller initialization', function () {
      describe('process filters init', function () {
        beforeEach(inject(function ($controller) {
          $controller('ActiveCaseFilterController', {
            '$scope': scope,
            'defaultFilters': {},
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

        it('should have the default app value (all Apps) selected on init when there is no processes', inject(function ($controller) {
          var defaultSelectedApp = 'default App',
            defaultSelectedVersion = 'default Version';
          defaultFilters.appName = defaultSelectedApp;
          defaultFilters.appVersion = defaultSelectedVersion;
          $controller('ActiveCaseFilterController', {
            '$scope': scope,
            'defaultFilters': defaultFilters
          });
          store.load = storeLoadFunction(globalProcesses);
          expect(scope.apps).toEqual([]);
          expect(scope.appNames).toEqual([]);
          expect(scope.versions).toEqual([]);
          expect(scope.selectedProcessDefinition).toEqual(undefined);
          expect(scope.selectedVersion).toBe(defaultSelectedVersion);
          expect(scope.defaultFilters.appName).toEqual(defaultSelectedApp);
        }));

        it('should have the default app value (all Apps) selected on init and apps filter filled', inject(function ($controller) {
          var defaultSelectedApp = 'default App',
            defaultSelectedVersion = 'default Version';
          defaultFilters.appName = defaultSelectedApp;
          defaultFilters.appVersion = defaultSelectedVersion;
          globalProcesses = globalProcesses.concat([
            {name: 'App1'},
            {name: 'App2'},
            {name: 'App3'}
          ]);
          store.load = storeLoadFunction(globalProcesses);
          $controller('ActiveCaseFilterController', {
            '$scope': scope,
            'defaultFilters': defaultFilters,
            'store' : store
          });
          //scope.$apply();
          expect(scope.apps).toBe(globalProcesses);
          expect(scope.appNames).toEqual(['App1', 'App2', 'App3']);
          expect(scope.versions).toEqual([]);
          expect(scope.selectedProcessDefinition).toEqual(undefined);
          expect(scope.selectedVersion).toBe(defaultSelectedVersion);
          expect(scope.defaultFilters.appName).toEqual(defaultSelectedApp);
        }));

        it('should have the default app value (all Apps) selected on init and apps filter filled', inject(function ($controller) {
          var defaultSelectedApp = 'default App',
          defaultSelectedVersion = 'default Version';

          defaultFilters.appName = defaultSelectedApp;
          defaultFilters.appVersion = defaultSelectedVersion;
          globalProcesses = globalProcesses.concat([
              {},
              {name: 'App2'},
              {name: 'App3'}
            ]);
          store.load = storeLoadFunction(globalProcesses);
          $controller('ActiveCaseFilterController', {
            '$scope': scope,
            'defaultFilters': defaultFilters,
            'store' : store
          });
          expect(scope.apps).toBe(globalProcesses);
          expect(scope.appNames).toEqual(['App2', 'App3']);
          expect(scope.versions).toEqual([]);
          expect(scope.selectedProcessDefinition).toEqual(undefined);
          expect(scope.selectedVersion).toBe(defaultSelectedVersion);
          expect(scope.defaultFilters.appName).toEqual(defaultSelectedApp);
        }));
      });

    });

    describe('filters', function () {
      describe('AppName', function () {
        var allApps = 'AllApps';
        beforeEach(inject(function ($controller) {
          $controller('ActiveCaseFilterController', {
            '$scope': scope,
            'defaultFilters': {appName: allApps},
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
          spyOn(scope, 'buildFilters');

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
            $controller('ActiveCaseFilterController', {
              '$scope': scope,
              'defaultFilters': {appVersion: allVersions},
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
            spyOn(scope, 'buildFilters');
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
            $controller('ActiveCaseFilterController', {
              '$scope': scope,
              'defaultFilters': {appVersion: allVersions},
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
            spyOn(scope, 'buildFilters');
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
            $controller('ActiveCaseFilterController', {
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
        describe('filterStatus', function(){
          var allStatus = 'allStatus'  ;
          beforeEach(inject(function ($controller) {
            $controller('ActiveCaseFilterController', {
              '$scope': scope,
              'defaultFilters' : {caseStatus : allStatus}
            });
          }));
          it('should not change anything if the same filter ', function(){
            var startedStatus = 'started';
            scope.selectedStatus = startedStatus;
            scope.selectCaseStatus(scope.selectedStatus);
            expect(scope.selectedStatus).toBe(scope.selectedStatus);
          });
          it('should not change anything if the same all status filter ', function(){
            scope.selectCaseStatus(allStatus);
            expect(scope.selectedStatus).toBe(allStatus);
          });
          it('should set initial selected case to all Status', function(){
            expect(scope.selectedStatus).toBe(allStatus);
          });
          it('should change the case status', function(){
            scope.selectedStatus = 'started';
            scope.selectCaseStatus(allStatus);
            expect(scope.selectedStatus).toBe(allStatus);
          });
        });
        describe('filter status update', function(){
          var allStatus = 'allStatus';
          beforeEach(inject(function ($controller) {
            $controller('ActiveCaseFilterController', {
              '$scope': scope,
              'defaultFilters':  {caseStatus : allStatus},
              'store': {
                load: function () {
                  return {
                    then: function () {
                    }
                  };
                }
              }
            });
            scope.$apply();
            spyOn(scope, 'buildFilters');
          }));

          it('should update the filters when the selected case has change', function(){
            scope.selectCaseStatus(allStatus);
            scope.$apply();
            expect(scope.selectedStatus).toBe(allStatus);
            expect(scope.buildFilters).not.toHaveBeenCalled();
          });
          it('should update the filters when the selected case has change', function(){
            var caseStatus = 'started';
            scope.selectCaseStatus(caseStatus);
            scope.$apply();
            expect(scope.selectedStatus).toBe(caseStatus);
            expect(scope.buildFilters).toHaveBeenCalled();
          });
        });
      });
    });
  });
})();
