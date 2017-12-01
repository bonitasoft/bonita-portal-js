(function () {
  'use strict';

  var scope, controller, q, processMenuCtrl, processAPI, modal, state, processResolutionProblems,
    processMoreDetailsResolveService, growl, manageTopUrl, tokenExtensionService, $window;

  describe('processMenuCtrl', function () {
    var menu, process;

    beforeEach(module('org.bonitasoft.features.admin.processes.details'));

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

    beforeEach(function () {
      process = {
        id: 1230
      };
      menu = [{
        name: 'Information',
        resolutionLabel: 'general',
        state: 'informationStateName'
      }, {
        name: 'Actor Mapping',
        resolutionLabel: 'actor',
        state: 'actorsMappingStateName'
      }, {
        name: 'Parameters',
        resolutionLabel: 'parameter',
        state: 'paramsStateName'
      }, {
        name: 'Connectors',
        resolutionLabel: 'connector',
        state: 'processConnectorsStateName'
      }];
      scope.$on = jasmine.createSpy();
      state = {
        current: {
          name: 'information'
        },
        includes: jasmine.createSpy()
      };
      processAPI = jasmine.createSpyObj('processAPI', ['get', 'update', 'delete']);
      processMenuCtrl = controller('ProcessMenuCtrl', {
        $window: $window,
        $scope: scope,
        process: process,
        processAPI: processAPI,
        menuContent: menu,
        $modal: modal,
        $state: state,
        processResolutionProblems: processResolutionProblems,
        TokenExtensionService: tokenExtensionService,
        growl: growl,
        manageTopUrl: manageTopUrl
      });
    });


    it('should call browser history on back function', function () {
      processMenuCtrl.goBack();
      expect($window.history.back).toHaveBeenCalled();
    });

    it('init should listen toggle event and push menu and process to view model', function () {
      expect(processMenuCtrl.menuContent).toEqual(menu);
      processMenuCtrl.menuContent.forEach(function (entry) {
        expect(entry.state).toBeDefined();
        expect(entry.resolutionLabel).toBeDefined();
        expect(entry.name).toBeDefined();
      });
      expect(processMenuCtrl.process).toEqual(process);
      state.includes.and.returnValue(true);
      expect(processMenuCtrl.includesCurrentState('parameter')).toBeTruthy();
      expect(state.includes).toHaveBeenCalledWith('parameter');
      expect(scope.$on.calls.allArgs()).toEqual([
        ['button.toggle', processMenuCtrl.toggleProcessActivation],
        ['process.refresh', processMenuCtrl.refreshProcess]
      ]);
    });

    it('toggleProcessActivation should update process via REST API and process in view model', function () {
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

    it('opens the deletion modal when delete button is clicked and display error on deletion failure', function () {
      var deferred = q.defer();
      modal.open.and.returnValue({
        result: deferred.promise
      });
      deferred.reject({
        message: 'Network Unreachable'
      });
      processMenuCtrl.deleteProcess();
      scope.$apply();
      expect(modal.open).toHaveBeenCalled();
      var options = modal.open.calls.mostRecent().args[0];
      expect(options.templateUrl).toEqual('features/admin/processes/details/delete-process-modal.html');
      expect(options.controller).toEqual('DeleteProcessModalInstanceCtrl');
      expect(options.controllerAs).toEqual('deleteProcessModalInstanceCtrl');
      expect(options.size).toEqual('sm');
      expect(options.resolve.process()).toEqual(process);
    });


    it('should open the deletion modal when delete button is clicked', function () {
      modal.open.and.returnValue({result: q.when({})});

      processMenuCtrl.deleteProcess();

      expect(modal.open).toHaveBeenCalled();
    });

    it('should delete process when modal is closed', function () {
      let process = {id: 42};
      modal.open.and.returnValue({result: q.when(process)});
      processAPI.delete.and.returnValue({$promise: q.when({})});
      tokenExtensionService.tokenExtensionValue = 'pm';

      processMenuCtrl.deleteProcess();
      scope.$apply();

      expect(processAPI.delete).toHaveBeenCalledWith(process);
    });

    it('should a redirect to listing page when delete is successful', function () {
      modal.open.and.returnValue({result: q.when({id: 42})});
      processAPI.delete.and.returnValue({$promise: q.when({})});
      tokenExtensionService.tokenExtensionValue = 'pm';

      processMenuCtrl.deleteProcess();
      scope.$apply();

      expect(manageTopUrl.goTo).toHaveBeenCalledWith({
        token: 'processlistingpm'
      });

    });

    it('opens the deletion modal when delete button is clicked and do noop on cancel', function () {
      var deferred = q.defer();
      modal.open.and.returnValue({
        result: deferred.promise
      });
      deferred.reject();
      processMenuCtrl.deleteProcess();
      scope.$apply();
      expect(modal.open).toHaveBeenCalled();
    });


    it('should find the resolution message of a given problem type', function () {
      processMenuCtrl.processResolutionProblems = [];
      expect(processMenuCtrl.hasResolutionProblem('parameter')).toBeFalsy();
      processMenuCtrl.processResolutionProblems.push({
        type: 'parameter'
      }, {
        type: 'actor'
      });
      expect(processMenuCtrl.hasResolutionProblem('parameter')).toBeTruthy();
      expect(processMenuCtrl.hasResolutionProblem('connector')).toBeFalsy();
      expect(processMenuCtrl.hasResolutionProblem('actor')).toBeTruthy();
    });
  });

})();
