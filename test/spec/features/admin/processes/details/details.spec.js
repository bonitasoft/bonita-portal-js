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

(function () {
  'use strict';

  describe('monitoringStatus Directive and Controller in Process More Details',
    function () {
      var scope, controller, q, processAPI, categoryAPI, processResolutionProblemAPI, parameterAPI,
        processConnectorAPI, store, modal, processResolutionProblems, processMoreDetailsResolveService,
        processProblemResolutionService, growl, manageTopUrl, tokenExtensionService, $window;

      beforeEach(module('org.bonitasoft.features.admin.processes.details'));

      beforeEach(function () {
        processAPI = jasmine.createSpyObj('processAPI', ['get', 'update', 'delete']);
        categoryAPI = jasmine.createSpyObj('categoryAPI', ['get', 'update']);
        processResolutionProblemAPI = jasmine.createSpyObj('processResolutionProblemAPI', ['get', 'update']);
        parameterAPI = jasmine.createSpyObj('parameterAPI', ['get', 'update']);
        processConnectorAPI = jasmine.createSpyObj('processConnectorAPI', ['get', 'update']);
        store = jasmine.createSpyObj('store', ['load']);
        processProblemResolutionService = jasmine.createSpyObj('processProblemResolutionService', ['buildProblemsList']);
        manageTopUrl = jasmine.createSpyObj('manageTopUrl', ['goTo', 'getCurrentPageToken']);

        module(function ($provide) {
          $provide.value('processAPI', processAPI);
          $provide.value('categoryAPI', categoryAPI);
          $provide.value('processResolutionProblemAPI', processResolutionProblemAPI);
          $provide.value('parameterAPI', parameterAPI);
          $provide.value('processConnectorAPI', processConnectorAPI);
          $provide.value('store', store);
          $provide.value('ProcessProblemResolutionService', processProblemResolutionService);
          $provide.value('manageTopUrl', manageTopUrl);
        });

      });

      beforeEach(inject(function ($rootScope, $compile, $controller, $q, ProcessMoreDetailsResolveService) {
        scope = $rootScope.$new();
        controller = $controller;
        q = $q;
        modal = jasmine.createSpyObj('$modal', ['open']);
        processResolutionProblems = jasmine.createSpyObj('processResolutionProblems', ['retrieveProcess']);
        processMoreDetailsResolveService = ProcessMoreDetailsResolveService;
        tokenExtensionService = {
          tokenExtensionValue: 'admin'
        };
        growl = jasmine.createSpyObj('growl', ['error']);
        manageTopUrl = jasmine.createSpyObj('manageTopUrl', ['goTo', 'getCurrentPageToken']);
        $window = {
          history: jasmine.createSpyObj('history', ['back'])
        };
      }));


      describe('processMoreDetailsResolveService', function () {
        it('retrieveProcess should get the process from the API', function () {
          let process = {id: 1230};
          processAPI.get.and.returnValue(process);

          expect(processMoreDetailsResolveService.retrieveProcess(12)).toBe(process);
        });
        it('retrieveCategories should get the categories from the API', function () {
          var categories = [];
          store.load.and.returnValue(categories);
          expect(processMoreDetailsResolveService.retrieveCategories(12)).toBe(categories);
          expect(store.load.calls.mostRecent().args[0]).toBe(categoryAPI);
          expect(store.load.calls.mostRecent().args[1]).toEqual({
            f: ['id=12']
          });
        });

        it('retrieveProcessResolutionProblem should get the ProcessResolutionProblem from the API', function () {
          var processResolutionProblem = [{
              message: 'Parameter \'copyrightYear\' is not set.',
              'ressource_id': undefined,
              'target_type': 'parameter'
            }],
            deferred = q.defer();
          store.load.and.returnValue(deferred.promise);
          processProblemResolutionService.buildProblemsList.and.returnValue('Parameters must be resolved before enabling the Process.');
          deferred.resolve(processResolutionProblem);
          processMoreDetailsResolveService.retrieveProcessResolutionProblem(12).then(function (problems) {
            expect(problems).toEqual('Parameters must be resolved before enabling the Process.');
          });
          scope.$apply();
          expect(store.load.calls.mostRecent().args[0]).toBe(processResolutionProblemAPI);
          expect(store.load.calls.mostRecent().args[1]).toEqual({
            f: ['process_id=12']
          });
          expect(processProblemResolutionService.buildProblemsList).toHaveBeenCalledWith([{
            type: 'parameter',
            'ressource_id': undefined
          }]);
        });

        it('retrieveParameters should get the Parameters from the API', function () {
          var parameters = [];
          store.load.and.returnValue(parameters);
          expect(processMoreDetailsResolveService.retrieveParameters(12)).toBe(parameters);
          expect(store.load.calls.mostRecent().args[0]).toBe(parameterAPI);
          expect(store.load.calls.mostRecent().args[1]).toEqual({
            f: ['process_id=12'],
            o: ['name ASC']
          });
        });

        it('retrieveConnectors should get the Connectors from the API', function () {
          var connectors = [];
          store.load.and.returnValue(connectors);
          expect(processMoreDetailsResolveService.retrieveConnectors(12)).toBe(connectors);
          expect(store.load.calls.mostRecent().args[0]).toBe(processConnectorAPI);
          expect(store.load.calls.mostRecent().args[1]).toEqual({
            o: 'definition_id ASC',
            f: 'process_id=12'
          });
        });
      });

    });
})();
