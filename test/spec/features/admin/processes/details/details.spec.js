(function() {
  'use strict';

  describe('monitoringStatus Directive and Controller in Process More Details',
    function() {
      var scope, controller, q, processMenuCtrl, processAPI, categoryAPI, store, modal;

      beforeEach(module('org.bonitasoft.features.admin.processes.details'));

      beforeEach(inject(function($rootScope, $compile, $controller, $q) {
        scope = $rootScope.$new();
        controller = $controller;
        q = $q;
        processAPI = jasmine.createSpyObj('processAPI', ['get', 'update']);
        categoryAPI = jasmine.createSpyObj('categoryAPI', ['get', 'update']);
        store = jasmine.createSpyObj('store', ['load']);
        modal = jasmine.createSpyObj('$modal', ['open']);
      }));

      describe('processMenuCtrl', function() {
        var menu, process;
        beforeEach(function() {
          process = {};
          menu = {};
          scope.$on = jasmine.createSpy();
          processMenuCtrl = controller('processMenuCtrl', {
            $scope: scope,
            process: process,
            processAPI: processAPI,
            menuContent : menu,
            $modal: modal
          });
        });
        it('retrieveProcess should get the process from the API', function() {
          processAPI.get.and.returnValue(process);
          expect(processMenuCtrl.retrieveProcess(processAPI, {processId: 12})).toBe(process);
        });
        it('retrieveCategories should get the categories from the API', function() {
          var categories = [];
          store.load.and.returnValue(categories);
          expect(processMenuCtrl.retrieveCategories(store, categoryAPI, {processId: 12})).toBe(categories);
          expect(store.load.calls.mostRecent().args[0]).toBe(categoryAPI);
          expect(store.load.calls.mostRecent().args[1]).toEqual({f: ['id=12']});
        });
        it('init should listen toggle event and push menu and process to view model', function(){
          expect(processMenuCtrl.menuContent).toEqual(menu);
          expect(processMenuCtrl.process).toEqual(process);
          expect(scope.$on.calls.mostRecent().args).toEqual(['button.toggle', processMenuCtrl.toogleProcessActivation]);
        });

        it('toogleProcessActivation should update process via REST API and process in view model', function(){
          var deferred = q.defer();
          process.id = 45654;
          processAPI.update.and.returnValue({$promise : deferred.promise});
          processMenuCtrl.toogleProcessActivation({}, {value: true});
          deferred.resolve();
          scope.$apply();
          expect(processAPI.update.calls.count()).toEqual(1);
          expect(processAPI.update.calls.mostRecent().args).toEqual([ { id: process.id, activationState: 'ENABLED' } ]);
          expect(process.activationState).toEqual('ENABLED');
          processAPI.update.calls.reset();
          processMenuCtrl.toogleProcessActivation({}, {value: false});
          scope.$apply();
          expect(processAPI.update.calls.count()).toEqual(1);
          expect(processAPI.update.calls.mostRecent().args).toEqual([ { id: process.id, activationState: 'DISABLED' } ]);
          expect(process.activationState).toEqual('DISABLED');
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
