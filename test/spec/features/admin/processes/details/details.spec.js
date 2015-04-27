(function() {
  'use strict';

  describe('monitoringStatus Directive and Controller in Process More Details',
    function() {
      var scope, controller, q, processMenuCtrl, processAPI, categoryAPI, processResolutionProblemAPI, parameterAPI, processConnectorAPI, store, modal, state, processResolutionProblems, processMoreDetailsResolveService, processProblemResolutionService;

      beforeEach(module('org.bonitasoft.features.admin.processes.details'));

      beforeEach(function() {
        processAPI = jasmine.createSpyObj('processAPI', ['get', 'update']);
        categoryAPI = jasmine.createSpyObj('categoryAPI', ['get', 'update']);
        processResolutionProblemAPI = jasmine.createSpyObj('processResolutionProblemAPI', ['get', 'update']);
        parameterAPI = jasmine.createSpyObj('parameterAPI', ['get', 'update']);
        processConnectorAPI = jasmine.createSpyObj('processConnectorAPI', ['get', 'update']);
        store = jasmine.createSpyObj('store', ['load']);
        processProblemResolutionService = jasmine.createSpyObj('processProblemResolutionService', ['buildProblemsList']);

        module(function($provide) {
          $provide.value('processAPI', processAPI);
          $provide.value('categoryAPI', categoryAPI);
          $provide.value('processResolutionProblemAPI', processResolutionProblemAPI);
          $provide.value('parameterAPI', parameterAPI);
          $provide.value('processConnectorAPI', processConnectorAPI);
          $provide.value('store', store);
          $provide.value('ProcessProblemResolutionService', processProblemResolutionService);
        });
      });

      beforeEach(inject(function($rootScope, $compile, $controller, $q, ProcessMoreDetailsResolveService) {
        scope = $rootScope.$new();
        controller = $controller;
        q = $q;
        modal = jasmine.createSpyObj('$modal', ['open']);
        processResolutionProblems = jasmine.createSpyObj('processResolutionProblems', ['retrieveProcess']);
        processMoreDetailsResolveService = ProcessMoreDetailsResolveService;
      }));


      describe('processMenuCtrl', function() {
        var menu, process;
        beforeEach(function() {
          process = {id: 1230};
          menu = [{
            name: 'Information',
            link: '',
            state: 'informationStateName'
          }, {
            name: 'Actor Mapping',
            link: 'actorsMapping',
            state: 'actorsMappingStateName'
          }, {
            name: 'Parameters',
            link: 'params',
            state: 'paramsStateName'
          }, {
            name: 'Connectors',
            link: 'connectors',
            state: 'processConnectorsStateName'
          }];
          scope.$on = jasmine.createSpy();
          state = {
            current: {
              name: 'information'
            }
          };
          processMenuCtrl = controller('ProcessMenuCtrl', {
            $scope: scope,
            process: process,
            processAPI: processAPI,
            menuContent: menu,
            $modal: modal,
            $state: state,
            processResolutionProblems: processResolutionProblems
          });
        });

        describe('processMoreDetailsResolveService', function() {
          it('retrieveProcess should get the process from the API', function() {
            processAPI.get.and.returnValue(process);
            expect(processMoreDetailsResolveService.retrieveProcess(12)).toBe(process);
          });
          it('retrieveCategories should get the categories from the API', function() {
            var categories = [];
            store.load.and.returnValue(categories);
            expect(processMoreDetailsResolveService.retrieveCategories(12)).toBe(categories);
            expect(store.load.calls.mostRecent().args[0]).toBe(categoryAPI);
            expect(store.load.calls.mostRecent().args[1]).toEqual({
              f: ['id=12']
            });
          });

          it('retrieveProcessResolutionProblem should get the ProcessResolutionProblem from the API', function() {
            var processResolutionProblem = [{
                message: 'Parameter \'copyrightYear\' is not set.',
                'ressource_id': undefined,
                'target_type': 'parameter'
              }],
              deferred = q.defer();
            store.load.and.returnValue(deferred.promise);
            processProblemResolutionService.buildProblemsList.and.returnValue('Parameters must be resolved before enabling the Process.');
            deferred.resolve(processResolutionProblem);
            processMoreDetailsResolveService.retrieveProcessResolutionProblem(12).then(function(problems){
              expect(problems).toEqual('Parameters must be resolved before enabling the Process.');
            });
            scope.$apply();
            expect(store.load.calls.mostRecent().args[0]).toBe(processResolutionProblemAPI);
            expect(store.load.calls.mostRecent().args[1]).toEqual({
              f: ['process_id=12']
            });
            expect(processProblemResolutionService.buildProblemsList).toHaveBeenCalledWith([{type: 'parameter', 'ressource_id': undefined}]);
          });

          it('retrieveParameters should get the Parameters from the API', function() {
            var parameters = [];
            store.load.and.returnValue(parameters);
            expect(processMoreDetailsResolveService.retrieveParameters(12)).toBe(parameters);
            expect(store.load.calls.mostRecent().args[0]).toBe(parameterAPI);
            expect(store.load.calls.mostRecent().args[1]).toEqual({
              f: ['process_id=12'],
              o: ['name ASC']
            });
          });

          it('retrieveConnectors should get the Connectors from the API', function() {
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

        it('init should listen toggle event and push menu and process to view model', function() {
          expect(processMenuCtrl.menuContent).toEqual(menu);
          processMenuCtrl.menuContent.forEach(function(entry) {
            expect(entry.state).toBeDefined();
            expect(entry.link).toBeDefined();
            expect(entry.name).toBeDefined();
          });
          expect(processMenuCtrl.process).toEqual(process);
          expect(processMenuCtrl.getCurrentStateName()).toEqual(state.current.name);
          expect(scope.$on.calls.allArgs()).toEqual([
            ['button.toggle', processMenuCtrl.toggleProcessActivation],
            ['process.refresh', processMenuCtrl.refreshProcess]
          ]);
        });

        it('toggleProcessActivation should update process via REST API and process in view model', function() {
          var deferred = q.defer();
          process.id = 45654;
          processAPI.update.and.returnValue({
            $promise: deferred.promise
          });
          processMenuCtrl.toggleProcessActivation({}, {
            value: true
          });
          deferred.resolve();
          scope.$apply();
          expect(processAPI.update.calls.count()).toEqual(1);
          expect(processAPI.update.calls.mostRecent().args).toEqual([{
            id: process.id,
            activationState: 'ENABLED'
          }]);
          expect(process.activationState).toEqual('ENABLED');
          processAPI.update.calls.reset();
          processMenuCtrl.toggleProcessActivation({}, {
            value: false
          });
          scope.$apply();
          expect(processAPI.update.calls.count()).toEqual(1);
          expect(processAPI.update.calls.mostRecent().args).toEqual([{
            id: process.id,
            activationState: 'DISABLED'
          }]);
          expect(process.activationState).toEqual('DISABLED');
        });

        it('should refresh process configuration state from what is received from API when refreshProcess is called', function() {
          var deferred = q.defer();
          processAPI.get.and.returnValue({
            $promise: deferred.promise
          });
          deferred.resolve({
            configurationState: 'RESOLVED'
          });
          processMenuCtrl.refreshProcess();
          scope.$apply();
          expect(processAPI.get).toHaveBeenCalledWith({
            id: process.id,
            d: ['deployedBy'],
            n: ['openCases', 'failedCases']
          });
          expect(process.configurationState).toEqual('RESOLVED');
        });

        it('opens the deletion modal when delete button is clicked', function() {
          processMenuCtrl.deleteProcess();
          expect(modal.open).toHaveBeenCalled();
          var options = modal.open.calls.mostRecent().args[0];
          expect(options.templateUrl).toEqual('features/admin/processes/details/delete-process-modal.html');
          expect(options.controller).toEqual('DeleteProcessModalInstanceCtrl');
          expect(options.controllerAs).toEqual('deleteProcessModalInstanceCtrl');
          expect(options.size).toEqual('sm');
          expect(options.resolve.process()).toEqual(process);
        });
      });
    });
})();
