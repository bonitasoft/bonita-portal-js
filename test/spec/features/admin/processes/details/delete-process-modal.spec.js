(function() {
  'use strict';

  describe('monitoringStatus Directive and Controller in Process More Details',
    function() {
      var scope, modal, controller, q;

      beforeEach(module('org.bonitasoft.features.admin.processes.details'));

      beforeEach(inject(function($rootScope, $modal, $controller, $q) {
        scope = $rootScope.$new();
        modal = $modal;
        controller = $controller;
        q = $q;
      }));

      describe('DeleteProcessModalInstanceCtrl', function() {
        var deleteProcessModalInstanceCtrl, modalInstance, manageTopUrl, processAPI, process;
        beforeEach(function() {
          modalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss']);
          manageTopUrl = jasmine.createSpyObj('manageTopUrl', ['goTo']);
          processAPI = jasmine.createSpyObj('processAPI', ['delete']);
          process = {
              id: '1248',
              name: 'SupportProcess',
              version: '1.12.008'
            };
          
          deleteProcessModalInstanceCtrl = controller('DeleteProcessModalInstanceCtrl', {
            $scope: scope,
            process: process,
            $modalInstance: modalInstance,
            manageTopUrl: manageTopUrl,
            processAPI: processAPI
          });
        });
        it('should init view model datas', function() {
          expect(deleteProcessModalInstanceCtrl.process).toBe(process);
          deleteProcessModalInstanceCtrl.cancel();
          expect(modalInstance.dismiss).toHaveBeenCalled();
        });
        describe('should call delete on processAPI when "Delete" is clicked', function() {
          it('should redirect to process listing page on delete success', function() {
            var deferred = q.defer();
            processAPI.delete.and.returnValue({$promise : deferred.promise});
            deleteProcessModalInstanceCtrl.delete();
            deferred.resolve();
            scope.$apply();
            expect(processAPI.delete).toHaveBeenCalledWith({id : process.id});
            expect(modalInstance.close).toHaveBeenCalled();
          });
        });
      });
    });
}());