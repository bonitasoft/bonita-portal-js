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

    var scope, globalProcesses, defaultFilters, caseStatesValues, processAPI, searchProcessesDeferred, getProcessDeferred, caseFiltersCtrl, debounce, $timeout;

    beforeEach(module('org.bonitasoft.features.admin.cases.list.filters', 'org.bonitasoft.templates', 'org.bonitasoft.service.debounce'));

    beforeEach(inject(function ($rootScope, $compile, $q, _defaultFilters_, _caseStatesValues_, _debounce_, _$timeout_) {
      //{processVersion: 'All versions', processName: 'All processs', caseStatus: 'All states'}
      globalProcesses = [];
      defaultFilters = _defaultFilters_;
      caseStatesValues = _caseStatesValues_;
      debounce = _debounce_;
      $timeout = _$timeout_;
      scope = $rootScope.$new();
      scope.buildFilters = function() {};
      scope.selectedFilters = {};
      processAPI = jasmine.createSpyObj('processAPI', ['search', 'get']);
      searchProcessesDeferred = $q.defer();
      processAPI.search.and.returnValue({
        $promise: searchProcessesDeferred.promise
      });
      getProcessDeferred = $q.defer();
      processAPI.get.and.returnValue({
        $promise: getProcessDeferred.promise
      });
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
            'processAPI': processAPI
          });
          spyOn(caseFiltersCtrl, 'updateVersionFilterList');
        }));

        it('should have the default process value (all) selected on init when there is no processes', inject(function ($controller) {
          var defaultSelectedProcess = 'default App',
            defaultSelectedVersion = 'default Version';
          defaultFilters.processName = defaultSelectedProcess;
          defaultFilters.processVersion = defaultSelectedVersion;
          $controller('ActiveCaseFilterController', {
            '$scope': scope,
            'defaultFilters': defaultFilters,
            'processAPI': processAPI
          });
          searchProcessesDeferred.resolve({
            data: globalProcesses,
            resource: {
              pagination: {
                total: globalProcesses.length
              }
            }
          });
          scope.$apply();
          $timeout.flush();
          expect(scope.processFilterList).toEqual([]);
          expect(scope.selectedFilters.selectedProcessDefinition).toEqual(undefined);
          expect(scope.selectedFilters.selectedProcessVersion).toBe(defaultSelectedVersion);
          expect(scope.defaultFilters.processName).toEqual(defaultSelectedProcess);
        }));

        it('should have the default process value (all) selected on init and process filter filled', inject(function ($controller) {
          var defaultSelectedProcess = 'default App',
            defaultSelectedVersion = 'default Version';
          defaultFilters.processName = defaultSelectedProcess;
          defaultFilters.processVersion = defaultSelectedVersion;
          globalProcesses = globalProcesses.concat([
            {name: 'App1', displayName: 'App1'},
            {name: 'App2', displayName: 'App2'},
            {name: 'App3', displayName: 'App3'}
          ]);
          caseFiltersCtrl = $controller('ActiveCaseFilterController', {
            '$scope': scope,
            'defaultFilters': defaultFilters,
            'processAPI': processAPI
          });
          searchProcessesDeferred.resolve({
            data: globalProcesses,
            resource: {
              pagination: {
                total: globalProcesses.length
              }
            }
          });
          scope.$apply();
          $timeout.flush();
          expect(scope.processFilterList).toBe(globalProcesses);
          expect(scope.selectedFilters.selectedProcessDefinition).toEqual(undefined);
          expect(scope.selectedFilters.selectedProcessVersion).toBe(defaultSelectedVersion);
          expect(scope.defaultFilters.processName).toEqual(defaultSelectedProcess);
        }));

        it('should have the default process value (all) selected on init and processes filter filled', inject(function ($controller) {
          var defaultSelectedProcess = 'default App',
          defaultSelectedVersion = 'default Version';

          defaultFilters.processName = defaultSelectedProcess;
          defaultFilters.processVersion = defaultSelectedVersion;
          globalProcesses = globalProcesses.concat([
              {},
              {name: 'App2', displayName: 'App2'},
              {name: 'App3', displayName: 'App3'}
            ]);
          caseFiltersCtrl = $controller('ActiveCaseFilterController', {
            '$scope': scope,
            'defaultFilters': defaultFilters,
            'processAPI': processAPI
          });
          searchProcessesDeferred.resolve({
            data: globalProcesses,
            resource: {
              pagination: {
                total: globalProcesses.length
              }
            }
          });
          scope.$apply();
          $timeout.flush();
          expect(scope.processFilterList).toBe(globalProcesses);
          expect(scope.selectedFilters.selectedProcessDefinition).toEqual(undefined);
          expect(scope.selectedFilters.selectedProcessVersion).toBe(defaultSelectedVersion);
          expect(scope.defaultFilters.processName).toEqual(defaultSelectedProcess);
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

      describe('processName', function () {
        beforeEach(inject(function ($controller) {
          caseFiltersCtrl = $controller('ActiveCaseFilterController', {
            '$scope': scope,
            'defaultFilters': {processName: undefined},
            'processAPI': processAPI
          });
          spyOn(caseFiltersCtrl, 'updateVersionFilterList');

        }));

        it('should change the Process Name Filter and update search filter when a process is selected', function () {
          var processName = 'tests';
          caseFiltersCtrl.selectProcess(processName);
          expect(scope.selectedFilters.selectedProcessName).toBe(processName);
          scope.$apply();
          expect(caseFiltersCtrl.updateVersionFilterList).toHaveBeenCalledWith(true);
          expect(scope.selectedFilters.selectedProcessDefinition).toBeUndefined();
        });
        it('should do nothing when the same process is selected', function () {
          var processName = 'tests';
          scope.selectedFilters.selectedProcessName = processName;
          caseFiltersCtrl.selectProcess(processName);
          expect(caseFiltersCtrl.updateVersionFilterList).not.toHaveBeenCalled();
          expect(scope.selectedFilters.selectedProcessName).toBe(processName);
        });
        it('should change the Process Name Filter and reset search filter when empty process is selected', function () {
          scope.selectedFilters.selectedProcessName = 'tests';
          caseFiltersCtrl.selectProcess();
          expect(scope.selectedFilters.selectedProcessName).toBe(undefined);
          scope.$apply();
          expect(caseFiltersCtrl.updateVersionFilterList).toHaveBeenCalled();
        });

        it('should set process name, process version and available process version when processId is set', function () {
          scope.selectedFilters.processId = 123;
          var process = {id:123, displayName:'Process1', version:'1.0'};
          caseFiltersCtrl.selectProcessIfDefined();
          getProcessDeferred.resolve(process);
          scope.$apply();
          expect(scope.selectedFilters.selectedProcessName).toBe(process.name);
          expect(scope.selectedFilters.selectedProcessVersion).toBe(process.version);
          expect(caseFiltersCtrl.updateVersionFilterList).toHaveBeenCalledWith(true);
        });

      });

      describe('Version Contingency', function () {
        var allVersions = 'All Versions';
        describe('version filter update ', function () {
          beforeEach(inject(function ($controller) {
            caseFiltersCtrl = $controller('ActiveCaseFilterController', {
              '$scope': scope,
              'defaultFilters': {processVersion: allVersions},
              'processAPI': processAPI
            });
            scope.$apply();
            spyOn(caseFiltersCtrl, 'filterProcessDefinition');
          }));
          it('should fill versions array with nothing', function () {
            caseFiltersCtrl.updateVersionFilterList();
            searchProcessesDeferred.resolve({
              data: [],
              resource: {
                pagination: {
                  total: 0
                }
              }
            });
            scope.$apply();
            expect(scope.versions).toEqual([]);
            expect(scope.selectedFilters.selectedProcessVersion).toEqual(allVersions);
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).not.toHaveBeenCalled();
          });
          it('should fill versions array with appropriate versions', function () {
            var processes= [
              {displayName: 'Process1', name: 'Process1', version: '1.0'},
              {displayName: 'Process1', name: 'Process1', version: '1.1'}
            ];
            scope.selectedFilters.selectedProcessName = 'Process1';
            caseFiltersCtrl.updateVersionFilterList(true);
            searchProcessesDeferred.resolve({
              data: processes,
              resource: {
                pagination: {
                  total: processes.length
                }
              }
            });
            scope.$apply();
            expect(scope.selectedFilters.selectedProcessVersion).toEqual(allVersions);
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).not.toHaveBeenCalled();
          });
          it('should fill versions array with appropriate versions when processes is wobbly', function () {
            var processes = [
              {displayName: 'Process1', name: 'Process1'},
              {displayName: 'Process1', name: 'Process1', version: '1.1'},
              undefined
            ];
            scope.selectedFilters.selectedProcessName = 'Process1';
            caseFiltersCtrl.updateVersionFilterList(true);
            searchProcessesDeferred.resolve({
              data: processes,
              resource: {
                pagination: {
                  total: processes.length
                }
              }
            });
            scope.$apply();
            expect(scope.versions).toEqual(['1.1']);
            expect(scope.selectedFilters.selectedProcessVersion).toEqual('1.1');
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).toHaveBeenCalledWith('1.1');
          });
          it('should fill versions array with appropriate versions when version is unique', function () {
            var processes = [
              {displayName: 'Process1', name: 'Process1', version: '1.0'}
            ];
            scope.selectedFilters.selectedProcessName = 'Process1';
            caseFiltersCtrl.updateVersionFilterList(true);
            searchProcessesDeferred.resolve({
              data: processes,
              resource: {
                pagination: {
                  total: processes.length
                }
              }
            });
            scope.$apply();
            expect(scope.versions).toEqual(['1.0']);
            expect(scope.selectedFilters.selectedProcessVersion).toEqual('1.0');
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).toHaveBeenCalledWith('1.0');
          });
        });

        describe('Process Version selection', function () {
          beforeEach(inject(function ($controller) {
            caseFiltersCtrl = $controller('ActiveCaseFilterController', {
              '$scope': scope,
              'defaultFilters': {processVersion: allVersions},
              'processAPI': processAPI
            });
            scope.$apply();
            spyOn(caseFiltersCtrl, 'filterProcessDefinition');
          }));

          it('should change the Process Version Filter and update search filter when a version is selected', function () {
            var processVersion = '1.0';
            caseFiltersCtrl.selectVersion(processVersion);
            expect(scope.selectedFilters.selectedProcessVersion).toBe(processVersion);
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).toHaveBeenCalledWith('1.0');
          });
          it('should do nothing when the same version is selected', function () {
            var processVersion = '1.0';
            caseFiltersCtrl.selectVersion(processVersion);
            expect(scope.selectedFilters.selectedProcessVersion).toBe(processVersion);
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).toHaveBeenCalledWith(processVersion);
            caseFiltersCtrl.filterProcessDefinition.calls.reset();
            caseFiltersCtrl.selectVersion(processVersion);
            expect(scope.selectedFilters.selectedProcessVersion).toBe(processVersion);
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).not.toHaveBeenCalled();
          });
          it('should change the Process Version when all processes is selected', function () {
            var processVersion = '1.0';
            caseFiltersCtrl.selectVersion(processVersion);
            expect(scope.selectedFilters.selectedProcessVersion).toBe(processVersion);
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).toHaveBeenCalledWith(processVersion);
            caseFiltersCtrl.filterProcessDefinition.calls.reset();
            caseFiltersCtrl.selectVersion(allVersions);
            expect(scope.selectedFilters.selectedProcessVersion).toBe(allVersions);
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).toHaveBeenCalledWith(allVersions);
          });
          it('should change the Process Name Filter and reset search filter when empty process is selected', function () {
            var processVersion = '1.0';
            caseFiltersCtrl.selectVersion(processVersion);
            expect(scope.selectedFilters.selectedProcessVersion).toBe(processVersion);
            scope.$apply();
            expect(caseFiltersCtrl.filterProcessDefinition).toHaveBeenCalledWith(processVersion);
            caseFiltersCtrl.filterProcessDefinition.calls.reset();
            caseFiltersCtrl.selectVersion();
            expect(scope.selectedFilters.selectedProcessVersion).toBe(allVersions);
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
            scope.selectedFilters.selectedProcessName = 'Process1';
            scope.versionFilterListProcesses = [
              {displayName: 'Process1', name: 'Process1', version: '1.0', 'id': '32165465132'},
              {displayName: 'Process1', name: 'Process1', version: '1.1', 'id': '98762168796'}
            ];
            caseFiltersCtrl.filterProcessDefinition('1.1');
            expect(scope.selectedFilters.selectedProcessDefinition).toBe('98762168796');
          });
          it('should delete selectedProcessDefinition when nothing is passed and was previously set and wobbly processes', function () {
            scope.selectedFilters.selectedProcessDefinition = '12321654875431';
            scope.selectedFilters.selectedProcessName = 'Process1';
            scope.versionFilterListProcesses = [
              {displayName: 'Process1', name: 'Process1', version: '1.0'},
              {displayName: 'Process1', name: 'Process1', version: '1.1', 'id': '98762168796'},
              undefined
            ];
            caseFiltersCtrl.filterProcessDefinition('1.1');
            expect(scope.selectedFilters.selectedProcessDefinition).toBe('98762168796');
            scope.selectedFilters.selectedProcessName = 'Process1';
            scope.versionFilterListProcesses = [
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
              'processAPI': processAPI
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
