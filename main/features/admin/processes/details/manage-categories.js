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
  }).factory('categoryManager', function(processCategoryAPI, categoryAPI, $q, $log) {
    var categoryManager = {};
    categoryManager.selectedCategoriesPopulatePromise = function (processCategoryPromises, newCategoryPromises, selectedCategories){
      return $q.all(newCategoryPromises).then(function(processNewCategoryPromises) {
        return $q.all(processCategoryPromises.concat(processNewCategoryPromises)).then(function() {
          return selectedCategories;
        }, $log.log);
      }, $log.log);
    };

    categoryManager.saveCategoryProcessIfNotAlreadySelected = function (category, initiallySelectedCategories, promises, processId) {
      if (!categoryManager.categoryWasInitiallySelected(category, initiallySelectedCategories)) {
        promises.push(processCategoryAPI.save({
          'category_id': category.id,
          'process_id': processId
        }).$promise);
      }
    };

    categoryManager.deleteCategoryProcessIfNeeded = function (category, initiallySelectedCategories, promises, processId, selectedTags) {
      if (!categoryManager.categoryIsSelected(category, selectedTags) && categoryManager.categoryWasInitiallySelected(category, initiallySelectedCategories)) {
        promises.push(processCategoryAPI.delete({
          'category_id': category.id,
          'process_id': processId
        }).$promise);
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