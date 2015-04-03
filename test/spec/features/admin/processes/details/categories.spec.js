(function() {
  'use strict';

  describe('monitoringStatus Directive and Controller in Process More Details',
    function() {
      var scope, controller, q;

      beforeEach(module('org.bonitasoft.features.admin.processes.details.categories'));

      beforeEach(inject(function($rootScope, $controller, $q) {
        scope = $rootScope.$new();
        controller = $controller;
        q = $q;
      }));
      describe('ProcessCategoriesCtrl', function() {
        var processCategoriesCtrl, modal, categoryAPI, process, categories, store, deferred, growl;
        beforeEach(function() {
          modal = jasmine.createSpyObj('modal', ['open']);
          store = jasmine.createSpyObj('store', ['load']);
          growl = jasmine.createSpyObj('growl', ['success']);
          categoryAPI = jasmine.createSpyObj('categoryAPI', ['search']);
          process = {
              id: '1248',
              name: 'SupportProcess',
              version: '1.12.008'
            };
          categories = [];
          deferred = q.defer();
          store.load.and.returnValue(deferred.promise);
          processCategoriesCtrl = controller('ProcessCategoriesCtrl', {
            $scope: scope,
            process: process,
            $modal: modal,
            store : store,
            categoryAPI : categoryAPI,
            growl: growl
          });
        });
        it('should init the category array with all the categories for the current process', function() {
          expect(processCategoriesCtrl.process).toBe(process);
          var cat1 = {}, cat2 = {};
          deferred.resolve([cat1, cat2]);
          scope.$apply();
          expect(store.load.calls.allArgs()).toEqual([[categoryAPI, {
            f: ['id='+process.id]
          }]]);
          expect(processCategoriesCtrl.categories).toEqual([cat1, cat2]);
        });
        
        it('opens the create category modal when Create button is clicked', function() {
          var deffered = q.defer();
          deffered.resolve({promises: [], categories:[]});
          modal.open.and.returnValue({result : deffered.promise});
          processCategoriesCtrl.openCreateCategoryAnMapItModal();
          expect(modal.open).toHaveBeenCalled();
          var options = modal.open.calls.mostRecent().args[0];
          expect(options.templateUrl).toEqual('features/admin/processes/details/create-category-modal.html');
          expect(options.controller).toEqual('CreateCategoryModalInstanceCtrl');
          expect(options.controllerAs).toEqual('createCategoryModalInstanceCtrl');
          expect(options.resolve.process()).toEqual(process);
        });
        it('opens the add category mapping modal when add button is clicked', function() {
          var cat1 = {id:1},cat2 = {id:2};
          var deffered = q.defer();
          var deferredArray = [q.defer(), q.defer(), q.defer()];
          deffered.resolve({promises: [deferredArray.map(function(deferred){ return deferred.promise;})], categories:[cat1, cat2]});
          modal.open.and.returnValue({result : deffered.promise});
          processCategoriesCtrl.openProcessCategoryMappingModal();
          expect(modal.open).toHaveBeenCalled();
          var options = modal.open.calls.mostRecent().args[0];
          expect(options.templateUrl).toEqual('features/admin/processes/details/add-category-mapping-modal.html');
          expect(options.controller).toEqual('AddCategoryMappingModalInstanceCtrl');
          expect(options.controllerAs).toEqual('addCategoryMappingInstanceCtrl');
          expect(options.resolve.process()).toBe(process);
          expect(options.resolve.alreadySelectedCategories()).toBe(processCategoriesCtrl.categories);

          deferredArray.forEach(function(deferred) {
            deferred.resolve();
          });
          scope.$apply();
          expect(processCategoriesCtrl.categories).toEqual([cat1, cat2]);
          expect(growl.success).toHaveBeenCalled();
        });
      });
      describe('AddCategoryMappingModalInstanceCtrl', function() {
        var addCategoryMappingModalInstanceCtrl, modalInstance, processCategoryAPI, categoryAPI, process, categories, store, deferred;
        beforeEach(function() {
          modalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss']);
          store = jasmine.createSpyObj('store', ['load']);
          processCategoryAPI = jasmine.createSpyObj('processCategoryAPI', ['save', 'delete']);
          categoryAPI = jasmine.createSpyObj('categoryAPI', ['search']);
          process = {
              id: '1248',
              name: 'SupportProcess',
              version: '1.12.008'
            };
          categories = [];
          deferred = q.defer();
          store.load.and.returnValue(deferred.promise);
          addCategoryMappingModalInstanceCtrl = controller('AddCategoryMappingModalInstanceCtrl', {
            $scope: scope,
            process: process,
            $modalInstance: modalInstance,
            store : store,
            categoryAPI : categoryAPI,
            processCategoryAPI: processCategoryAPI,
            alreadySelectedCategories : []
          });
        });

        it('should update correctly the categories selected or not', function(){
          /*jshint camelcase: false */
          var cat1 = {id:1, ticked: true, tickedInitially: true},
           cat2 = {id:2},
           cat3 = {id:3},
           cat4 = {id:4};
          addCategoryMappingModalInstanceCtrl.categories = [cat1, cat2, cat3, cat4];
          addCategoryMappingModalInstanceCtrl.selectedCategories = [{id:2, ticked: true}, {id:3, ticked: true}];
          var processCategoryAPIResponse = {};
          processCategoryAPI.save.and.returnValue(processCategoryAPIResponse);
          processCategoryAPI.delete.and.returnValue(processCategoryAPIResponse);
          addCategoryMappingModalInstanceCtrl.updateCategories();
          expect(processCategoryAPI.save.calls.allArgs()).toEqual([[{ category_id: 2, process_id: '1248' }], [{ category_id: 3, process_id: '1248' }]]);
          expect(processCategoryAPI.delete.calls.allArgs()).toEqual([[{ category_id: 1, process_id: '1248' }]]);
          expect(modalInstance.close.calls.allArgs()).toEqual([[{promises : [processCategoryAPIResponse, processCategoryAPIResponse, processCategoryAPIResponse], categories: addCategoryMappingModalInstanceCtrl.selectedCategories}]]);
        });
      });
    });
}());