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

(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.details.information.categories', [
    'org.bonitasoft.common.directives.bonitags',
    'ui.bootstrap',
    'org.bonitasoft.common.resources.store',
    'angular-growl',
    'gettext'
  ]).controller('ManageCategoryMappingModalInstanceCtrl', function($scope, categoryAPI, process, gettextCatalog, $modalInstance, store, initiallySelectedCategories, allCategories, categoryManager) {
    var vm = this;
    vm.selectedTags = initiallySelectedCategories.map(function(category) {
      return category.name;
    });
    vm.tags = allCategories.map(function(category) {
      return category.name;
    });

    vm.updateCategories = function() {
      $modalInstance.close(categoryManager.updateCategories(allCategories, initiallySelectedCategories, vm.selectedTags, vm.tags, process.id));
    };
    vm.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  }).service('categoryManager', function(processCategoryAPI, categoryAPI, $q) {
    var categoryManager = {};
    categoryManager.selectedCategoriesPopulatePromise = function (processCategoryPromises, newCategoryPromises, selectedCategories){
      return $q.all(processCategoryPromises.concat(newCategoryPromises)).then(function() {
        return selectedCategories;
      });
    };

    categoryManager.saveCategoryProcessIfNotAlreadySelected = function (category, initiallySelectedCategories, promises, processId) {
      if (!categoryManager.categoryWasInitiallySelected(category, initiallySelectedCategories)) {
        promises.push(processCategoryAPI.save({
          'category_id': category.id,
          'process_id': processId
        }));
      }
    };

    categoryManager.deleteCategoryProcessIfNeeded = function (category, initiallySelectedCategories, promises, processId, selectedTags) {
      if (!categoryManager.categoryIsSelected(category, selectedTags) && categoryManager.categoryWasInitiallySelected(category, initiallySelectedCategories)) {
        promises.push(processCategoryAPI.delete({
          'category_id': category.id,
          'process_id': processId
        }));
      }
    };

    categoryManager.updateCategories = function(allCategories, initiallySelectedCategories, selectedTags, tags, processId) {
      var promises = [],
        selectedCategories = [];
      allCategories.forEach(function(category) {
        if (categoryManager.categoryIsSelected(category, selectedTags)) {
          selectedCategories.push(category);
          categoryManager.saveCategoryProcessIfNotAlreadySelected(category, initiallySelectedCategories, promises, processId);
        } else {
          categoryManager.deleteCategoryProcessIfNeeded(category, initiallySelectedCategories, promises, processId, selectedTags);
        }
      });
      return categoryManager.selectedCategoriesPopulatePromise(promises, categoryManager.createNewCategoriesPromises(selectedCategories, tags, selectedTags, processId), selectedCategories);
    };


    categoryManager.createNewCategoriesPromises = function(selectedCategories, tags, selectedTags, processId) {
      return _.difference(selectedTags, tags).map(function(newTag) {
        return categoryAPI.save({
          name: newTag
        }).$promise.then(function(category) {
          selectedCategories.push(category);
          return processCategoryAPI.save({
            'category_id': category.id,
            'process_id': processId
          });
        });
      });
    };


    categoryManager.categoryWasInitiallySelected = function(category, initiallySelectedCategories) {
      if(!category || !initiallySelectedCategories) { return false; }
      return !!initiallySelectedCategories.filter(function(selectedCategory) {
        return selectedCategory.id === category.id;
      }).length;
    };

    categoryManager.categoryIsSelected = function(category, selectedTags) {
      if(!category || !selectedTags) { return false; }
      return !!selectedTags.filter(function(selectedTag) {
        return selectedTag === category.name;
      }).length;
    };
    return categoryManager;
  });
})();
