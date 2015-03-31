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
        var processCategoriesCtrl, modal, categoryAPI, process, categories, store, deferred;
        beforeEach(function() {
          modal = jasmine.createSpyObj('modal', ['open']);
          store = jasmine.createSpyObj('store', ['load']);
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
            categoryAPI : categoryAPI
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
          modal.open.and.returnValue({result : q.defer().promise});
          processCategoriesCtrl.openCreateCategoryAnMapItModal();
          expect(modal.open).toHaveBeenCalled();
          var options = modal.open.calls.mostRecent().args[0];
          expect(options.templateUrl).toEqual('features/admin/processes/details/create-category-modal.html');
          expect(options.controller).toEqual('CreateCategoryModalInstanceCtrl');
          expect(options.controllerAs).toEqual('createCategoryModalInstanceCtrl');
          expect(options.size).toEqual('sm');
          expect(options.resolve.process()).toEqual(process);
        });
        it('opens the add category mapping modal when add button is clicked', function() {
          processCategoriesCtrl.openProcessCategoryMappingModal();
          expect(modal.open).toHaveBeenCalled();
          var options = modal.open.calls.mostRecent().args[0];
          expect(options.templateUrl).toEqual('features/admin/processes/details/add-category-mapping-modal.html');
          expect(options.controller).toEqual('AddCategoryMappingModalInstanceCtrl');
          expect(options.controllerAs).toEqual('addCategoryMappingInstanceCtrl');
          expect(options.size).toEqual('sm');
          expect(options.resolve.process()).toBe(process);
          expect(options.resolve.alreadySelectedCategories()).toBe(processCategoriesCtrl.categories);
        });
      });
      describe('AddCategoryMappingModalInstanceCtrl', function() {
        var addCategoryMappingModalInstanceCtrl, modalInstance, processCategoryAPI, categoryAPI, process, categories, store, deferred;
        beforeEach(function() {
          modalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss']);
          store = jasmine.createSpyObj('store', ['load']);
          processCategoryAPI = jasmine.createSpyObj('processCategoryAPI', ['post', 'delete']);
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
          var cat1 = {id:1, ticked: true, tickedInitially: true},
           cat2 = {id:2},
           cat3 = {id:3};
          addCategoryMappingModalInstanceCtrl.categories = [cat1, cat2, cat3];
          addCategoryMappingModalInstanceCtrl.selectedCategories = [cat2, cat3];
          addCategoryMappingModalInstanceCtrl.updateCategories();
          var postArgs = processCategoryAPI.post.calls.allArgs();
          var deleteArgs = processCategoryAPI.delete.calls.allArgs();
          expect(postArgs).toEqual([[{category_id: cat2.id,
            process_id: process.id}], [{category_id: cat3.id,
            process_id: process.id}]]);
          expect(deleteArgs).toEqual([[[process.id + '/' + cat1.id]]]);
        });
      });
    });
}());