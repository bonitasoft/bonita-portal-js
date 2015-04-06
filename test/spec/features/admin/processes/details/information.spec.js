(function() {
  'use strict';
  fdescribe('bonitags directive', function(){
    var scope, controller, processInformationCtrl, process, categories, q, growl;
     
    beforeEach(module('org.bonitasoft.common.filters.date.parser'));
    beforeEach(module('org.bonitasoft.features.admin.processes.details.information'));

    beforeEach(inject(function($rootScope, $controller, $q) {
      scope = $rootScope.$new();
      controller = $controller;
      q = $q;
      var cat1 = {id:111, name: 'catego1'},
        cat2 = {id:222, name: 'catego2'},
        cat3 = {id:333, name: 'catego3'};
      categories = [cat1, cat2, cat3];
      process = {};
      growl = jasmine.createSpyObj('growl', ['success', 'error']);
    }));
    it('should init the controller', function(){
      processInformationCtrl = controller('ProcessInformationCtrl', {
        $scope : scope,
        process : process,
        categories : categories,
        dateParser : {parseAndFormat : jasmine.createSpy()}
      });
      expect(processInformationCtrl.process).toBe(process);
      expect(processInformationCtrl.parseAndFormat).toBeDefined();
      expect(processInformationCtrl.selectedCategories).toEqual(['catego1', 'catego2', 'catego3']);
      expect(processInformationCtrl.categories).toEqual(categories);
    });
    describe('openProcessCategoryManagementModal function', function(){
      var store, categoryAPI, modal, modalInstance;
      beforeEach(function(){
        store = jasmine.createSpyObj('store', ['load']);
        categoryAPI = jasmine.createSpyObj('categoryAPI', ['search']);
        modal = jasmine.createSpyObj('$modal', ['open']);
        modalInstance = {};
        modal.open.and.returnValue(modalInstance);
        processInformationCtrl = controller('ProcessInformationCtrl', {
          $scope : scope,
          process : process,
          categories : categories,
          dateParser : {parseAndFormat : jasmine.createSpy()},
          store : store,
          categoryAPI : categoryAPI,
          $modal : modal,
          growl : growl
        });
      });
      it('should open modal retrieving categories', function(){
        var deferredStore = q.defer();
        store.load.and.returnValue(deferredStore.promise);
        modalInstance.result = jasmine.createSpyObj('promise', ['then']);
        processInformationCtrl.openProcessCategoryManagementModal();
        var options = modal.open.calls.mostRecent().args[0];
        expect(options.templateUrl).toEqual('features/admin/processes/details/manage-category-mapping-modal.html');
        expect(options.controller).toEqual('ManageCategoryMappingModalInstanceCtrl');
        expect(options.controllerAs).toEqual('manageCategoryMappingInstanceCtrl');
        expect(options.resolve.process()).toEqual(process);
        expect(options.resolve.initiallySelectedCategories()).toEqual(processInformationCtrl.categories);
        expect(options.resolve.allCategories()).toBe(deferredStore.promise);
        expect(modalInstance.result.then).toHaveBeenCalledWith(processInformationCtrl.waitForPromiseAndUpdateTagsAndAlertUser, jasmine.any(Function));
      });
      describe('waitForPromiseAndUpdateTagsAndAlertUser function', function(){
        it('should wait For Promise And Update Tags And Alert User', function(){
          var deferred1 = q.defer(),
            deferred2 = q.defer();
          var cat1 = {id:111, name: 'cate1'},
            cat2 = {id:222, name: 'cate2'},
            cat3 = {id:333, name: 'cate3'}, categories = [cat1, cat2, cat3];
          deferred1.resolve();
          deferred2.resolve();
          processInformationCtrl.waitForPromiseAndUpdateTagsAndAlertUser({promises : [deferred1.promise, deferred2.promise], categories : categories});
          scope.$apply();
          expect(processInformationCtrl.categories).toEqual(categories);
          expect(processInformationCtrl.selectedCategories).toEqual(['cate1', 'cate2', 'cate3']);
          expect(growl.success.calls.mostRecent().args[0]).toEqual('successfully updated categories');
        });
      });
    });
  });
})();