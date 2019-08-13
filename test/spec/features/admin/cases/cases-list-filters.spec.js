/** Copyright (C) 2015 Bonitasoft S.A.
 * BonitaSoft, 31 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/* global describe  */
(function () {
  'use strict';
  describe('admin cases list features', function () {

    var scope, globalProcesses, defaultFilters, caseStatesValues, store, caseFiltersCtrl;
    var storeLoadFunction = function (processes) {
      return function () {
        return {
          then: function (successFunction) {
            successFunction(processes);
          }
        };
      };
    };

    beforeEach(module('org.bonitasoft.features.admin.cases.list.filters', 'org.bonitasoft.templates'));

    beforeEach(inject(function ($rootScope, $compile, _defaultFilters_, _caseStatesValues_, _store_) {
      //{appVersion: 'All versions', appName: 'All apps', caseStatus: 'All states'}
      globalProcesses = [];
      defaultFilters = _defaultFilters_;
      caseStatesValues = _caseStatesValues_;
      store = _store_;
      scope = $rootScope.$new();
      scope.buildFilters = function() {};
      scope.selectedFilters = {};
    }));

    it('should load directive without any error', inject(function($compile){
      $compile('<active-case-filters></active-case-filters')(scope);
    }));

    describe('controller initialization', function () {
      describe('process filters init', function () {
        beforeEach(inject(function ($controller) {
          caseFiltersCtrl = $controller('ActiveCaseFilterController', {
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
          spyOn(caseFiltersCtrl, 'filterVersion');
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
          expect(scope.selectedFilters.selectedProcessDefinition).toEqual(undefined);
          expect(scope.selectedFilters.selectedVersion).toBe(defaultSelectedVersion);
          expect(scope.defaultFilters.appName).toEqual(defaultSelectedApp);
        }));

        it('should have the default app value (all Apps) selected on init and apps filter filled', inject(function ($controller) {
          var defaultSelectedApp = 'default App',
            defaultSelectedVersion = 'default Version';
          defaultFilters.appName = defaultSelectedApp;
          defaultFilters.appVersion = defaultSelectedVersion;
          globalProcesses = globalProcesses.concat([
            {name: 'App1', displayName: 'App1'},
            {name: 'App2', displayName: 'App2'},
            {name: 'App3', displayName: 'App3'}
          ]);
          store.load = storeLoadFunction(globalProcesses);
          caseFiltersCtrl = $controller('ActiveCaseFilterController', {
            '$scope': scope,
            'defaultFilters': defaultFilters,
            'store' : store
          });
          //scope.$apply();
          expect(scope.apps).toBe(globalProcesses);
          expect(scope.appNames).toEqual([['App1', 'App1'], ['App2', 'App2'], ['App3', 'App3']]);
          expect(scope.versions).toEqual([]);
          expect(scope.selectedFilters.selectedProcessDefinition).toEqual(undefined);
          expect(scope.selectedFilters.selectedVersion).toBe(defaultSelectedVersion);
          expect(scope.defaultFilters.appName).toEqual(defaultSelectedApp);
        }));

        it('should have the default app value (all Apps) selected on init and apps filter filled', inject(function ($controller) {
          var defaultSelectedApp = 'default App',
          defaultSelectedVersion = 'default Version';

          defaultFilters.appName = defaultSelectedApp;
          defaultFilters.appVersion = defaultSelectedVersion;
          globalProcesses = globalProcesses.concat([
              {},
              {name: 'App2', displayName: 'App2'},
              {name: 'App3', displayName: 'App3'}
            ]);
          store.load = storeLoadFunction(globalProcesses);
          caseFiltersCtrl = $controller('ActiveCaseFilterController', {
            '$scope': scope,
            'defaultFilters': defaultFilters,
            'store' : store
          });
          expect(scope.apps).toBe(globalProcesses);
          expect(scope.appNames).toEqual([['App2', 'App2'], ['App3', 'App3']]);
          expect(scope.versions).toEqual([]);
          expect(scope.selectedFilters.selectedProcessDefinition).toEqual(undefined);
          expect(scope.selectedFilters.selectedVersion).toBe(defaultSelectedVersion);
          expect(scope.defaultFilters.appName).toEqual(defaultSelectedApp);
        }));

        it('should have the default app value (all Apps) selected on init and apps filter filled without duplicata of pair displayName/name', inject(function ($controller) {
          var defaultSelectedApp = 'default App',
            defaultSelectedVersion = 'default Version';

          defaultFilters.appName = defaultSelectedApp;
          defaultFilters.appVersion = defaultSelectedVersion;
          globalProcesses = globalProcesses.concat([
            {name: 'App2', displayName: 'App2', version: '1.0'},
            {name: 'App2', displayName: 'App2', version: '2.0'},
            {name: 'App3', displayName: 'App3', version: '2.0'}
          ]);
          store.load = storeLoadFunction(globalProcesses);
          caseFiltersCtrl = $controller('ActiveCaseFilterController', {
            '$scope': scope,
            'defaultFilters': defaultFilters,
            'store' : store
          });
          expect(scope.apps).toBe(globalProcesses);
          expect(scope.appNames).toEqual([['App2', 'App2'], ['App3', 'App3']]);
          expect(scope.versions).toEqual([]);
          expect(scope.selectedFilters.selectedProcessDefinition).toEqual(undefined);
        }));

        it('should have the default app value (all Apps) selected on init and apps filter filled with all information, while displayName is different between two apps', inject(function ($controller) {
          var defaultSelectedApp = 'default App',
            defaultSelectedVersion = 'default Version';

          defaultFilters.appName = defaultSelectedApp;
          defaultFilters.appVersion = defaultSelectedVersion;
          globalProcesses = globalProcesses.concat([
            {name: 'App2', displayName: 'App2', version: '1.0'},
            {name: 'App3', displayName: 'App2', version: '2.0'},
            {name: 'App4', displayName: 'App4', version: '4.0'}
          ]);
          store.load = storeLoadFunction(globalProcesses);
          caseFiltersCtrl = $controller('ActiveCaseFilterController', {
            '$scope': scope,
            'defaultFilters': defaultFilters,
            'store' : store
          });
          expect(scope.apps).toBe(globalProcesses);
          expect(scope.appNames).toEqual([['App2', 'App2'], ['App3', 'App2'], ['App4', 'App4']]);
          expect(scope.versions).toEqual([]);
          expect(scope.selectedFilters.selectedProcessDefinition).toEqual(undefined);
        }));

        it('should have the default app value (all Apps) selected on init and apps filter filled with all information, while name is different between two apps', inject(function ($controller) {
          var defaultSelectedApp = 'default App',
            defaultSelectedVersion = 'default Version';

          defaultFilters.appName = defaultSelectedApp;
          defaultFilters.appVersion = defaultSelectedVersion;
          globalProcesses = globalProcesses.concat([
            {name: 'App2', displayName: 'App2', version: '1.0'},
            {name: 'App2', displayName: 'App3', version: '2.0'},
            {name: 'App4', displayName: 'App4', version: '4.0'}
          ]);
          store.load = storeLoadFunction(globalProcesses);
          caseFiltersCtrl = $controller('ActiveCaseFilterController', {
            '$scope': scope,
            'defaultFilters': defaultFilters,
            'store' : store
          });
          expect(scope.apps).toBe(globalProcesses);
          expect(scope.appNames).toEqual([['App2', 'App2'], ['App2', 'App3'], ['App4', 'App4']]);
          expect(scope.versions).toEqual([]);
          expect(scope.selectedFilters.selectedProcessDefinition).toEqual(undefined);
        }));
      });
    });

    describe('filters', function () {

      describe('search', function(){
        beforeEach(inject(function($controller){
          caseFiltersCtrl = $controller('ActiveCaseFilterController', {
            '$scope': scope
          });
          spyOn(scope, '$emit');
          scope.pagination = {};
        }));
        it('should emit search event on submitSearch', function(){
          scope.pagination.currentPage = 7;
          caseFiltersCtrl.submitSearch();
          expect(scope.$emit).toHaveBeenCalledWith('caselist:search');
          expect(scope.pagination.currentPage).toBe(1);
        });
      });

      describe('AppName', function () {
        var allApps = ['AllApps', 'AllApps'];
        beforeEach(inject(function ($controller) {
          caseFiltersCtrl = $controller('ActiveCaseFilterController', {
            '$scope': scope,
            'defaultFilters': {appName: 'AllApps'},
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
          spyOn(caseFiltersCtrl, 'filterVersion');

        }));

        it('should change the App Name Filter and update search filter when an app is selected', function () {
          var appName = ['tests', 'tests'];
          caseFiltersCtrl.selectApp(appName[0], appName[1]);
          expect(scope.selectedFilters.selectedApp[0]).toBe(appName[0]);
          expect(scope.selectedFilters.selectedApp[1]).toBe(appName[1]);
          scope.$apply();
          expect(caseFiltersCtrl.filterVersion).toHaveBeenCalledWith(appName[0], appName[1]);
          expect(scope.selectedFilters.selectedProcessDefinition).toBeUndefined();
        });
        it('should do nothing when the same app is selected', function () {
          var appName =  ['tests', 'tests'];
          scope.selectedFilters.selectedApp = appName;
          caseFiltersCtrl.selectApp(appName[0], appName[1]);
          expect(caseFiltersCtrl.filterVersion).not.toHaveBeenCalled();
          expect(scope.selectedFilters.selectedApp[0]).toBe(appName[0]);
          expect(scope.selectedFilters.selectedApp[1]).toBe(appName[1]);
        });
        it('should change the App Name Filter and reset search filter when all apps is selected', function () {
          var appName = allApps;
          scope.selectedFilters.selectedApp = ['tests', 'tests'];
          caseFiltersCtrl.selectApp(appName[0], appName[1]);
          expect(scope.selectedFilters.selectedApp[0]).toBe(allApps[0]);
          expect(scope.selectedFilters.selectedApp[1]).toBe(allApps[1]);
          scope.$apply();
          expect(caseFiltersCtrl.filterVersion).toHaveBeenCalled();
        });
        it('should change the App Name Filter and reset search filter when empty app is selected', function () {
          scope.selectedFilters.selectedApp =  ['tests', 'tests'];
          caseFiltersCtrl.selectApp();
          expect(scope.selectedFilters.selectedApp[0]).toBe(allApps[0]);
          expect(scope.selectedFilters.selectedApp[1]).toBe(allApps[1]);
          scope.$apply();
          expect(caseFiltersCtrl.filterVersion).toHaveBeenCalled();
        });

        it('should set process displayName, process version and available process version when processId is set', function () {
          scope.selectedFilters.processId = 123;
          var processes = [{id:123, displayName:'Process1', name:'Process1', version:'1.0'}, {id:12, displayName:'Process1', name:'Process1', version:'1.1'}, {id:3, displayName:'Process2', name:'Process2', version:'1.0'}];
          caseFiltersCtrl.initFilters(processes);
          expect(scope.selectedFilters.selectedApp[0]).toBe(processes[0].displayName);
          expect(scope.selectedFilters.selectedApp[1]).toBe(processes[0].name);
          expect(scope.selectedFilters.selectedVersion).toBe(processes[0].version);
          expect(caseFiltersCtrl.filterVersion).toHaveBeenCalledWith(processes[0].name, processes[0].displayName);
          expect(scope.appNames).toEqual([[processes[0].name, processes[0].displayName], [processes[2].name, processes[2].displayName]]);
        });

      });

      describe('Version Contengency', function () {
        var allVersions = 'All Versions';
        describe('version filter update ', function () {
          beforeEach(inject(function ($controller) {
            caseFiltersCtrl = $controller('ActiveCaseFilterController', {
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
            spyOn(caseFiltersCtrl, 'filterProcessDefinition');
          }));
          it('should fill versions array with nothing', function () {
            caseFiltersCtrl.filterVersion();
            expect(scope.versions).toEqual([]);
            expect(scope.selectedFilters.selectedVersion).toEqual(allVersions);
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).not.toHaveBeenCalled();
          });
          it('should fill versions array with appropriate versions', function () {
            scope.apps = [
              {displayName: 'Process1', name: 'Process1', version: '1.0'},
              {displayName: 'Process1', name: 'Process1', version: '1.1'}
            ];
            caseFiltersCtrl.filterVersion('Process1', 'Process1');
            expect(scope.versions).toEqual(['1.0', '1.1']);
            expect(scope.selectedFilters.selectedVersion).toEqual(allVersions);
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).not.toHaveBeenCalled();
          });
          it('should fill versions array with appropriate versions when apps is wobbly', function () {
            scope.apps = [
              {displayName: 'Process1', name: 'Process1'},
              {displayName: 'Process1', name: 'Process1', version: '1.1'},
              undefined
            ];
            caseFiltersCtrl.filterVersion('Process1', 'Process1');
            expect(scope.versions).toEqual(['1.1']);
            expect(scope.selectedFilters.selectedVersion).toEqual('1.1');
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).toHaveBeenCalledWith('1.1');
          });
          it('should fill versions array with appropriate versions when displayName and name are different', function () {
            scope.apps = [
              {displayName: 'Process1', name: 'Process1', version: '1.0'},
              {displayName: 'Process1', name: 'Process1', version: '1.1'},
              {displayName: 'Process2', name: 'Process3', version: '1.3'},
              {displayName: 'Process3', name: 'Process3', version: '5.4'}
            ];
            caseFiltersCtrl.filterVersion('Process1', 'Process1');
            expect(scope.versions).toEqual(['1.0', '1.1']);
            expect(scope.selectedFilters.selectedVersion).toEqual(allVersions);
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).not.toHaveBeenCalled();

            caseFiltersCtrl.filterVersion('Process3', 'Process2');
            expect(scope.versions).toEqual(['1.3']);
            expect(scope.selectedFilters.selectedVersion).toEqual('1.3');
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).toHaveBeenCalledWith('1.3');

            caseFiltersCtrl.filterVersion('Process3', 'Process3');
            expect(scope.versions).toEqual(['5.4']);
            expect(scope.selectedFilters.selectedVersion).toEqual('5.4');
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).toHaveBeenCalledWith('5.4');
          });
        });

        describe('App Version selection', function () {
          beforeEach(inject(function ($controller) {
            caseFiltersCtrl = $controller('ActiveCaseFilterController', {
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
            spyOn(caseFiltersCtrl, 'filterProcessDefinition');
          }));

          it('should change the App Version Filter and update search filter when an version is selected', function () {
            var appVersion = '1.0';
            caseFiltersCtrl.selectVersion(appVersion);
            expect(scope.selectedFilters.selectedVersion).toBe(appVersion);
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).toHaveBeenCalledWith('1.0');
          });
          it('should do nothing when the same version is selected', function () {
            var appVersion = '1.0';
            caseFiltersCtrl.selectVersion(appVersion);
            expect(scope.selectedFilters.selectedVersion).toBe(appVersion);
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).toHaveBeenCalledWith(appVersion);
            caseFiltersCtrl.filterProcessDefinition.calls.reset();
            caseFiltersCtrl.selectVersion(appVersion);
            expect(scope.selectedFilters.selectedVersion).toBe(appVersion);
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).not.toHaveBeenCalled();
          });
          it('should change the App Version when all apps is selected', function () {
            var appVersion = '1.0';
            caseFiltersCtrl.selectVersion(appVersion);
            expect(scope.selectedFilters.selectedVersion).toBe(appVersion);
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).toHaveBeenCalledWith(appVersion);
            caseFiltersCtrl.filterProcessDefinition.calls.reset();
            caseFiltersCtrl.selectVersion(allVersions);
            expect(scope.selectedFilters.selectedVersion).toBe(allVersions);
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).toHaveBeenCalledWith(allVersions);
          });
          it('should change the App Name Filter and reset search filter when empty app is selected', function () {
            var appVersion = '1.0';
            caseFiltersCtrl.selectVersion(appVersion);
            expect(scope.selectedFilters.selectedVersion).toBe(appVersion);
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).toHaveBeenCalledWith(appVersion);
            caseFiltersCtrl.filterProcessDefinition.calls.reset();
            caseFiltersCtrl.selectVersion();
            expect(scope.selectedFilters.selectedVersion).toBe(allVersions);
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).toHaveBeenCalledWith(allVersions);
          });
        });
        describe('filterProcessDefinition', function () {
          beforeEach(inject(function ($controller) {
            caseFiltersCtrl = $controller('ActiveCaseFilterController', {
              '$scope': scope
            });
          }));

          it('should delete selectedProcessDefinition when nothing is passed and not yet initialized', function () {
            caseFiltersCtrl.filterProcessDefinition();
            expect(scope.selectedFilters.selectedProcessDefinition).toBeUndefined();
          });

          it('should delete selectedProcessDefinition when nothing is passed and was previously set', function () {
            scope.selectedFilters.selectedProcessDefinition = '54684656872421';
            caseFiltersCtrl.filterProcessDefinition();
            expect(scope.selectedFilters.selectedProcessDefinition).toBeUndefined();
          });
          it('should delete selectedProcessDefinition when nothing is passed and was previously set', function () {
            scope.selectedFilters.selectedProcessDefinition = '12321654875431';
            scope.selectedFilters.selectedApp = ['Process1', 'Process1'];
            scope.apps = [
              {displayName: 'Process1', name: 'Process1', version: '1.0', 'id': '32165465132'},
              {displayName: 'Process1', name: 'Process1', version: '1.1', 'id': '98762168796'}
            ];
            caseFiltersCtrl.filterProcessDefinition('1.1');
            expect(scope.selectedFilters.selectedProcessDefinition).toBe('98762168796');
          });
          it('should delete selectedProcessDefinition when nothing is passed and was previously set and wobbly apps', function () {
            scope.selectedFilters.selectedProcessDefinition = '12321654875431';
            scope.selectedFilters.selectedApp = ['Process1', 'Process1'];
            scope.apps = [
              {displayName: 'Process1', name: 'Process1', version: '1.0'},
              {displayName: 'Process1', name: 'Process1', version: '1.1', 'id': '98762168796'},
              undefined
            ];
            caseFiltersCtrl.filterProcessDefinition('1.1');
            expect(scope.selectedFilters.selectedProcessDefinition).toBe('98762168796');
            scope.selectedFilters.selectedApp = 'Process1';
            scope.apps = [
              {displayName: 'Process1', name: 'Process1', version: '1.0'},
              {displayName: '', name: '', version: '1.2', 'id': '98762168796'},
              undefined
            ];
            caseFiltersCtrl.filterProcessDefinition('1.1');
            expect(scope.selectedFilters.selectedProcessDefinition).toBeUndefined();
          });
        });
        describe('filterStatus', function(){
          var allStatus = 'allStatus'  ;
          beforeEach(inject(function ($controller) {
            caseFiltersCtrl = $controller('ActiveCaseFilterController', {
              '$scope': scope,
              'defaultFilters' : {caseStatus : allStatus}
            });
          }));
          it('should load case stat filter from URL', function(){
            inject(function ($controller) {
              caseFiltersCtrl = $controller('ActiveCaseFilterController', {
                '$scope': scope,
                '$stateParams': { 'caseStateFilter' : 'error' }
              });
            });
            expect(scope.selectedFilters.selectedStatus).toBe('error');
            caseFiltersCtrl.selectCaseStatus('allStatus');
            expect(scope.selectedFilters.selectedStatus).toBe('allStatus');
          });
          it('should not change anything if the same filter ', function(){
            var startedStatus = 'started';
            scope.selectedStatus = startedStatus;
            caseFiltersCtrl.selectCaseStatus(scope.selectedStatus);
            expect(scope.selectedStatus).toBe(scope.selectedStatus);
          });
          it('should not change anything if the same all status filter ', function(){
            caseFiltersCtrl.selectCaseStatus(allStatus);
            expect(scope.selectedFilters.selectedStatus).toBe(allStatus);
          });
          it('should set initial selected case to all Status', function(){
            expect(scope.selectedFilters.selectedStatus).toBe(allStatus);
          });
          it('should change the case status', function(){
            scope.selectedStatus = 'started';
            caseFiltersCtrl.selectCaseStatus(allStatus);
            expect(scope.selectedFilters.selectedStatus).toBe(allStatus);
          });
        });
        describe('filter status update', function(){
          var allStatus = 'allStatus';
          beforeEach(inject(function ($controller) {
            caseFiltersCtrl = $controller('ActiveCaseFilterController', {
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
          }));

          it('should update the filters when the selected case has change', function(){
            caseFiltersCtrl.selectCaseStatus(allStatus);
            scope.$apply();
            expect(scope.selectedFilters.selectedStatus).toBe(allStatus);
          });
          it('should update the filters when the selected case has change', function(){
            var caseStatus = 'started';
            caseFiltersCtrl.selectCaseStatus(caseStatus);
            scope.$apply();
            expect(scope.selectedFilters.selectedStatus).toBe(caseStatus);
          });
        });
      });
    });
  });
})();
