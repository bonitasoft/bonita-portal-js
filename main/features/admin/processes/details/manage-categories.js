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

  angular.module('org.bonitasoft.features.admin.processes.details.information.categories', [
    'ui.bootstrap',
    'org.bonitasoft.common.resources.store',
    'angular-growl',
    'gettext'
  ]).controller('ManageCategoryMappingModalInstanceCtrl', function ($scope, categoryAPI, process, gettextCatalog, $modalInstance, store, initiallySelectedCategories, allCategories, categoryManager) {
    var vm = this;

    vm.mappedCategories = angular.copy(initiallySelectedCategories);
    vm.categoriesToAdd = [];
    vm.addCategoryInputValue = '';
    vm.categoriesToRemove = [];

    vm.filterCategories = function () {
      return allCategories.filter(function (category) {
        return findCategoryIndexByName(category.name, vm.mappedCategories) === -1 &&
          findCategoryIndexByName(category.name, vm.categoriesToAdd) === -1 &&
          findCategoryIndexByName(category.name, vm.categoriesToRemove) === -1;
      });
    };
    vm.updateCategories = function () {
      $modalInstance.close(categoryManager.updateCategories(allCategories, vm.mappedCategories, vm.categoriesToAdd, vm.categoriesToRemove, process.id));
    };
    vm.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    vm.removeCategory = function (category) {
      vm.mappedCategories.splice(findCategoryIndexByName(category.name, vm.mappedCategories), 1);
      vm.categoriesToRemove.push(category);
    };
    vm.removeAll = function () {
      vm.mappedCategories.forEach(function (category) {
        vm.categoriesToRemove.push(category);
      });
      vm.mappedCategories.length = 0;
    };
    vm.reenableCategory = function (category) {
      vm.categoriesToRemove.splice(findCategoryIndexByName(category.name, vm.categoriesToRemove), 1);
      vm.mappedCategories.push(category);
    };
    vm.reenableAll = function () {
      vm.categoriesToRemove.forEach(function (category) {
        vm.mappedCategories.push(category);
      });
      vm.categoriesToRemove.length = 0;
    };
    vm.addNewCategory = function () {
      if (findCategoryIndexByName(vm.addCategoryInputValue, vm.categoriesToAdd) === -1 && findCategoryIndexByName(vm.addCategoryInputValue, vm.categoriesToRemove) === -1) {
        var existingCategory = allCategories.find(function (category) {
          return category.name === vm.addCategoryInputValue;
        });
        if (!!existingCategory) {
          vm.categoriesToAdd.push(existingCategory);
        } else {
          vm.categoriesToAdd.push({name: vm.addCategoryInputValue});
        }
      }
      vm.addCategoryInputValue = '';
    };
    vm.removeFromAdded = function (category) {
      vm.categoriesToAdd.splice(findCategoryIndexByName(category.name, vm.categoriesToAdd), 1);
    };
    vm.removeAllFromAdded = function () {
      vm.categoriesToAdd.length = 0;
    };
    vm.doesCategoryAlreadyExist = function () {
      return findCategoryIndexByName(vm.addCategoryInputValue, vm.mappedCategories) > -1;
    };
    vm.isCategoryInTheRemovedList = function () {
      return findCategoryIndexByName(vm.addCategoryInputValue, vm.categoriesToRemove) > -1;
    };
    vm.getAddCategoryTooltip = function () {
      return gettextCatalog.getString('Use Arrow up and Arrow down keys to browse among existing categories.') + '\n' +
        gettextCatalog.getString('Enter a new category name and click "Add" button to create a new category.');
    };

    function findCategoryIndexByName(categoryName, categoryList) {
      var categoryNames = categoryList.map(function (category) {
        return category.name.toLowerCase();
      });
      return categoryNames.indexOf(categoryName.toLowerCase());
    }
  }).service('categoryManager', function (processCategoryAPI, categoryAPI, store, $q) {
    var categoryManager = {};

    categoryManager.mapCategoryToProcess = function (categoryId, processId) {
      return processCategoryAPI.save({
        'category_id': categoryId,
        'process_id': processId
      }).$promise;
    };

    categoryManager.unmapCategoryFromProcess = function (categoryId, processId) {
      return processCategoryAPI.delete({
        'category_id': categoryId,
        'process_id': processId
      }).$promise;
    };

    categoryManager.updateCategories = function (allCategories, mappedCategories, categoriesToAdd, categoriesToRemove, processId) {
      var promises = [];
      var allCategoryNames = allCategories.map(function (category) {
        return category.name.toLowerCase();
      });
      categoriesToAdd.forEach(function (categoryToAdd) {
        if (allCategoryNames.indexOf(categoryToAdd.name.toLowerCase()) === -1) {
          promises.push(categoryManager.createNewCategories(categoryToAdd).then(function (newlyCreatedCategory) {
            // Since the user only gives a name, we still need other info that will be provided by the server after creation
            categoryToAdd.id = newlyCreatedCategory.id;
            return categoryManager.mapCategoryToProcess(newlyCreatedCategory.id, processId);
          }));
        } else {
          promises.push(categoryManager.mapCategoryToProcess(categoryToAdd.id, processId));
        }
      });

      categoriesToRemove.forEach(function (categoryToRemove) {
        // During page execution, we usually go through the ctrl.removeCategory(), and never call this function directly
        // This could still be called directly by a third-party or in the tests, which would leave the mappedCategories in an unclean state
        var mappedCategoryIndex = mappedCategories.map(function(category) {return category.name.toLowerCase();}).indexOf(categoryToRemove.name.toLowerCase());
        if (mappedCategoryIndex > -1) {
          mappedCategories.splice(mappedCategoryIndex, 1);
        }
        promises.push(categoryManager.unmapCategoryFromProcess(categoryToRemove.id, processId));
      });
      return $q.all(promises).then(function () {
        return mappedCategories.concat(categoriesToAdd);
      });
    };

    categoryManager.createNewCategories = function (newCategory) {
      return categoryAPI.save({
        name: newCategory.name
      }).$promise;
    };

    return categoryManager;
  });
})();
