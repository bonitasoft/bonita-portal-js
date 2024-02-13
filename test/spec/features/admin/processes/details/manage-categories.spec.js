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
  describe('Manage Category Mapping Modal Instance', function () {
    var scope, controller, manageCategoryMappingModalInstanceCtrl,
      process, allCategories, q, selectedCategories, modalInstance, categoryManager,
      cat1, cat2, cat3;

    beforeEach(module('org.bonitasoft.features.admin.processes.details.information.categories'));

    describe('controller ', function () {
      beforeEach(inject(function ($rootScope, $controller, $q) {
        scope = $rootScope.$new();
        controller = $controller;
        q = $q;
        cat1 = {
          id: 111,
          name: 'catego1'
        };
        cat2 = {
          id: 222,
          name: 'catego2'
        };
        cat3 = {
          id: 333,
          name: 'catego3'
        };
        allCategories = [cat1, cat2, cat3];
        selectedCategories = [cat1];
        process = {
          id: 123
        };
        categoryManager = jasmine.createSpyObj('categoryManager', ['updateCategories']);
        modalInstance = jasmine.createSpyObj('modalInstance', ['dismiss', 'close']);
        manageCategoryMappingModalInstanceCtrl = controller('ManageCategoryMappingModalInstanceCtrl', {
          $scope: scope,
          process: process,
          initiallySelectedCategories: selectedCategories,
          allCategories: allCategories,
          categoryManager: categoryManager,
          $modalInstance: modalInstance
        });
      }));

      it('should init controller', function () {
        expect(manageCategoryMappingModalInstanceCtrl.mappedCategories.length).toEqual(1);
        expect(manageCategoryMappingModalInstanceCtrl.mappedCategories[0].name).toEqual('catego1');
      });

      it('should dismiss modal', function () {
        manageCategoryMappingModalInstanceCtrl.cancel();
        expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
      });

      it('should close modal and update categories', function () {
        var promisesAndCategories = {};
        categoryManager.updateCategories.and.returnValue(promisesAndCategories);
        manageCategoryMappingModalInstanceCtrl.updateCategories();
        expect(modalInstance.close).toHaveBeenCalledWith(promisesAndCategories);
        expect(categoryManager.updateCategories).toHaveBeenCalledWith(allCategories, selectedCategories, manageCategoryMappingModalInstanceCtrl.categoriesToAdd, manageCategoryMappingModalInstanceCtrl.categoriesToRemove, process.id);
      });
    });
    describe('category update service', function () {
      var categoryManager, processCategoryAPI, categoryAPI;
      beforeEach(function () {
        module(function ($provide) {
          processCategoryAPI = jasmine.createSpyObj('processCategoryAPI', ['save', 'delete']);
          categoryAPI = jasmine.createSpyObj('categoryAPI', ['save']);
          $provide.value('processCategoryAPI', processCategoryAPI);
          $provide.value('categoryAPI', categoryAPI);
        });

        inject(function ($injector, $q, $rootScope) {
          scope = $rootScope.$new();
          categoryManager = $injector.get('categoryManager');
          q = $q;
        });
      });

      describe('createNewCategories', function () {
        it('should save not existing tags, create mapping and return promises ', function () {
          var deferredCategory = q.defer();
          var deferredProcessCategory = q.defer();
          categoryAPI.save.and.returnValue({
            $promise: deferredCategory.promise
          });
          deferredCategory.resolve({
            id: 456
          });
          processCategoryAPI.save.and.returnValue({
            $promise: deferredProcessCategory.promise
          });
          categoryManager.updateCategories([cat2, cat3], [], [cat1], [], process.id);
          scope.$apply();
          expect(categoryAPI.save).toHaveBeenCalledWith({
            name: cat1.name
          });
          expect(processCategoryAPI.save).toHaveBeenCalledWith({
            'category_id': 456,
            'process_id': 123
          });
        });
      });
      describe('updateCategories', function () {
        it('should save some categoryProcess, delete some and wait for promises to be resolved', function () {
          var deferredCategory = q.defer();
          var deferredProcessCategoryAdd = q.defer();
          var deferredProcessCategoryRemove = q.defer();
          categoryAPI.save.and.returnValue({
            $promise: deferredCategory.promise
          });
          deferredCategory.resolve({
            id: 456
          });
          processCategoryAPI.save.and.returnValue({
            $promise: deferredProcessCategoryAdd.promise
          });
          processCategoryAPI.delete.and.returnValue({
            $promise: deferredProcessCategoryRemove.promise
          });
          deferredProcessCategoryAdd.resolve({});
          deferredProcessCategoryRemove.resolve({});
          cat1 = {
            id: 111,
            name: 'catego1'
          };
          cat2 = {
            id: 222,
            name: 'catego2'
          };
          cat3 = {
            id: 333,
            name: 'catego3'
          };
          allCategories = [cat1, cat2, cat3];
          process = {
            id: 123
          };
          var newCategory = {name: 'catego4'};

          var mappedCategories = [cat1, cat2];
          var categoriesToAdd = [
            cat3,
            newCategory
          ];
          var categoriesToRemove = [cat1];
          var result = categoryManager.updateCategories(allCategories, mappedCategories, categoriesToAdd, categoriesToRemove, process.id);
          scope.$apply();
          expect(result.$$state.value).toEqual([cat2, cat3, {name: newCategory.name, id: 456}]);
        });
      });
    });
  });
})();
