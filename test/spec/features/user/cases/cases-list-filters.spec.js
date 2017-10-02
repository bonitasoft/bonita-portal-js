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
  describe('user cases list features', function () {

    var scope, globalProcesses , defaultUserFilters, caseStatesUserValues, store, caseFiltersCtrl;
    var storeLoadFunction = function (processes) {
      return function () {
        return {
          then: function (successFunction) {
            successFunction(processes);
          }
        };
      };
    };

    beforeEach(module('org.bonitasoft.features.user.cases.list.filters', 'org.bonitasoft.templates'));

    beforeEach(inject(function ($rootScope, $compile, _defaultUserFilters_, _caseStatesUserValues_, _store_) {
      //{appVersion: 'All versions', appName: 'All apps', caseStatus: 'All states'}
      globalProcesses = [];
      defaultUserFilters = _defaultUserFilters_;
      caseStatesUserValues = _caseStatesUserValues_;
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
          caseFiltersCtrl = $controller('ActiveCaseUserFilterController', {
            '$scope': scope,
            'defaultUserFilters': {},
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
          defaultUserFilters.appName = defaultSelectedApp;
          defaultUserFilters.appVersion = defaultSelectedVersion;
          $controller('ActiveCaseUserFilterController', {
            '$scope': scope,
            'defaultUserFilters': defaultUserFilters
          });
          store.load = storeLoadFunction(globalProcesses);
          expect(scope.apps).toEqual([]);
          expect(scope.appNames).toEqual([]);
          expect(scope.versions).toEqual([]);
          expect(scope.selectedFilters.selectedProcessDefinition).toEqual(undefined);
          expect(scope.selectedFilters.selectedVersion).toBe(defaultSelectedVersion);
          expect(scope.defaultUserFilters.appName).toEqual(defaultSelectedApp);
        }));

        it('should have the default app value (all Apps) selected on init and apps filter filled', inject(function ($controller) {
          var defaultSelectedApp = 'default App',
            defaultSelectedVersion = 'default Version';
          defaultUserFilters.appName = defaultSelectedApp;
          defaultUserFilters.appVersion = defaultSelectedVersion;
          globalProcesses = globalProcesses.concat([
            {displayName: 'App1'},
            {displayName: 'App2'},
            {displayName: 'App3'}
          ]);
          store.load = storeLoadFunction(globalProcesses);
          caseFiltersCtrl = $controller('ActiveCaseUserFilterController', {
            '$scope': scope,
            'defaultUserFilters': defaultUserFilters,
            'store' : store
          });
          //scope.$apply();
          expect(scope.apps).toBe(globalProcesses);
          expect(scope.appNames).toEqual(['App1', 'App2', 'App3']);
          expect(scope.versions).toEqual([]);
          expect(scope.selectedFilters.selectedProcessDefinition).toEqual(undefined);
          expect(scope.selectedFilters.selectedVersion).toBe(defaultSelectedVersion);
          expect(scope.defaultUserFilters.appName).toEqual(defaultSelectedApp);
        }));

        it('should have the default app value (all Apps) selected on init and apps filter filled', inject(function ($controller) {
          var defaultSelectedApp = 'default App',
          defaultSelectedVersion = 'default Version';

          defaultUserFilters.appName = defaultSelectedApp;
          defaultUserFilters.appVersion = defaultSelectedVersion;
          globalProcesses = globalProcesses.concat([
              {},
              {displayName: 'App2'},
              {displayName: 'App3'}
            ]);
          store.load = storeLoadFunction(globalProcesses);
          caseFiltersCtrl = $controller('ActiveCaseUserFilterController', {
            '$scope': scope,
            'defaultUserFilters': defaultUserFilters,
            'store' : store
          });
          expect(scope.apps).toBe(globalProcesses);
          expect(scope.appNames).toEqual(['App2', 'App3']);
          expect(scope.versions).toEqual([]);
          expect(scope.selectedFilters.selectedProcessDefinition).toEqual(undefined);
          expect(scope.selectedFilters.selectedVersion).toBe(defaultSelectedVersion);
          expect(scope.defaultUserFilters.appName).toEqual(defaultSelectedApp);
        }));
      });
    });

    describe('filters', function () {

      describe('search', function(){
        beforeEach(inject(function($controller){
          caseFiltersCtrl = $controller('ActiveCaseUserFilterController', {
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
        var allApps = 'AllApps';
        beforeEach(inject(function ($controller) {
          caseFiltersCtrl = $controller('ActiveCaseUserFilterController', {
            '$scope': scope,
            'defaultUserFilters': {appName: allApps},
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
          var appName = 'tests';
          caseFiltersCtrl.selectApp(appName);
          expect(scope.selectedFilters.selectedApp).toBe(appName);
          scope.$apply();
          expect(caseFiltersCtrl.filterVersion).toHaveBeenCalledWith(appName);
          expect(scope.selectedFilters.selectedProcessDefinition).toBeUndefined();
        });
        it('should do nothing when the same app is selected', function () {
          var appName = 'tests';
          scope.selectedFilters.selectedApp = appName;
          caseFiltersCtrl.selectApp(appName);
          expect(caseFiltersCtrl.filterVersion).not.toHaveBeenCalled();
          expect(scope.selectedFilters.selectedApp).toBe(appName);
        });
        it('should change the App Name Filter and reset search filter when all apps is selected', function () {
          var appName = allApps;
          scope.selectedFilters.selectedApp = 'tests';
          caseFiltersCtrl.selectApp(appName);
          expect(scope.selectedFilters.selectedApp).toBe(allApps);
          scope.$apply();
          expect(caseFiltersCtrl.filterVersion).toHaveBeenCalled();
        });
        it('should change the App Name Filter and reset search filter when empty app is selected', function () {
          scope.selectedFilters.selectedApp = 'tests';
          caseFiltersCtrl.selectApp();
          expect(scope.selectedFilters.selectedApp).toBe(allApps);
          scope.$apply();
          expect(caseFiltersCtrl.filterVersion).toHaveBeenCalled();
        });

        it('should set process displayName, process version and available process version when processId is set', function () {
          scope.selectedFilters.processId = 123;
          var processes = [{id:123, displayName:'Process1', version:'1.0'}, {id:12, displayName:'Process1', version:'1.1'}, {id:3, displayName:'Process2', version:'1.0'}];
          caseFiltersCtrl.initFilters(processes);
          expect(scope.selectedFilters.selectedApp).toBe(processes[0].displayName);
          expect(scope.selectedFilters.selectedVersion).toBe(processes[0].version);
          expect(caseFiltersCtrl.filterVersion).toHaveBeenCalledWith(processes[0].displayName);
          expect(scope.appNames).toEqual([processes[0].displayName, processes[2].displayName]);
        });

      });

      describe('Version Contengency', function () {
        var allVersions = 'All Versions';
        describe('version filter update ', function () {
          beforeEach(inject(function ($controller) {
            caseFiltersCtrl = $controller('ActiveCaseUserFilterController', {
              '$scope': scope,
              'defaultUserFilters': {appVersion: allVersions},
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
              {displayName: 'Process1', version: '1.0'},
              {displayName: 'Process1', version: '1.1'}
            ];
            caseFiltersCtrl.filterVersion('Process1');
            expect(scope.versions).toEqual(['1.0', '1.1']);
            expect(scope.selectedFilters.selectedVersion).toEqual(allVersions);
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).not.toHaveBeenCalled();
          });
          it('should fill versions array with appropriate versions when apps is wobbly', function () {
            scope.apps = [
              {displayName: 'Process1'},
              {displayName: 'Process1', version: '1.1'},
              undefined
            ];
            caseFiltersCtrl.filterVersion('Process1');
            expect(scope.versions).toEqual(['1.1']);
            expect(scope.selectedFilters.selectedVersion).toEqual('1.1');
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).toHaveBeenCalledWith('1.1');
          });
        });

        describe('App Version selection', function () {
          beforeEach(inject(function ($controller) {
            caseFiltersCtrl = $controller('ActiveCaseUserFilterController', {
              '$scope': scope,
              'defaultUserFilters': {appVersion: allVersions},
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
            caseFiltersCtrl = $controller('ActiveCaseUserFilterController', {
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
            scope.selectedFilters.selectedApp = 'Process1';
            scope.apps = [
              {displayName: 'Process1', version: '1.0', 'id': '32165465132'},
              {displayName: 'Process1', version: '1.1', 'id': '98762168796'}
            ];
            caseFiltersCtrl.filterProcessDefinition('1.1');
            expect(scope.selectedFilters.selectedProcessDefinition).toBe('98762168796');
          });
          it('should delete selectedProcessDefinition when nothing is passed and was previously set and wobbly apps', function () {
            scope.selectedFilters.selectedProcessDefinition = '12321654875431';
            scope.selectedFilters.selectedApp = 'Process1';
            scope.apps = [
              {displayName: 'Process1', version: '1.0'},
              {displayName: 'Process1', version: '1.1', 'id': '98762168796'},
              undefined
            ];
            caseFiltersCtrl.filterProcessDefinition('1.1');
            expect(scope.selectedFilters.selectedProcessDefinition).toBe('98762168796');
            scope.selectedFilters.selectedApp = 'Process1';
            scope.apps = [
              {displayName: 'Process1', version: '1.0'},
              {displayName: '', version: '1.2', 'id': '98762168796'},
              undefined
            ];
            caseFiltersCtrl.filterProcessDefinition('1.1');
            expect(scope.selectedFilters.selectedProcessDefinition).toBeUndefined();
          });
        });
        describe('filterCaseStartedBy', function(){
          var meFilter = 'Me';
          beforeEach(inject(function ($controller) {
            caseFiltersCtrl = $controller('ActiveCaseUserFilterController', {
              '$scope': scope/*,
              'defaultUserFilters' : {selectedStartedBy : meFilter}*/
            });
          }));
          it('should not change anything if the same filter ', function(){
            var meFilter = 'Me';
            scope.selectedStartedBy = meFilter;
            caseFiltersCtrl.selectCaseStartedBy(scope.selectedStartedBy);
            expect(scope.selectedStartedBy).toBe(scope.selectedStartedBy);
          });
          it('should not change anything if the same all users filter ', function(){
            caseFiltersCtrl.selectCaseStartedBy(meFilter);
            expect(scope.selectedFilters.selectedStartedBy).toBe(meFilter);
          });
          it('should set initial selected case filter to anyone', function(){
            expect(scope.selectedFilters.selectedStartedBy).toBe('Anyone');
          });
          it('should change the case startedby', function(){
            scope.selectedStartedBy = 'Anyone';
            caseFiltersCtrl.selectCaseStartedBy(meFilter);
            expect(scope.selectedFilters.selectedStartedBy).toBe(meFilter);
          });
        });
      });
    });
  });
})();
