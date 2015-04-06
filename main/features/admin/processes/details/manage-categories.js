(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.details.information.categories', [
    'org.bonitasoft.common.directives.bonitags',
    'ui.bootstrap',
    'org.bonitasoft.common.resources.store',
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
      $modalInstance.close(categoryManager.updateCategories(allCategories, initiallySelectedCategories, vm.selectedTags, vm.tags));
    };
    vm.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  }).factory('categoryManager', function(processCategoryAPI, categoryAPI) {
    var categoryManager = {};
    categoryManager.updateCategories = function(allCategories, initiallySelectedCategories, selectedTags, tags) {
      var promises = [],
        selectedCategories = [];
      allCategories.forEach(function(category) {
        if (categoryManager.categoryIsSelected(category, selectedTags)) {
          selectedCategories.push(category);
          if (!categoryManager.categoryWasInitiallySelected(category, initiallySelectedCategories)) {
            console.log('adding ' + category.name);
            promises.push(processCategoryAPI.save({
              'category_id': category.id,
              'process_id': process.id
            }));
          }
        } else if (!categoryManager.categoryIsSelected(category, selectedTags) && categoryManager.categoryWasInitiallySelected(category, initiallySelectedCategories)) {
          console.log('removing ' + category.name);
          promises.push(processCategoryAPI.delete({
            'category_id': category.id,
            'process_id': process.id
          }));
        }
      });
      [].push(promises, categoryManager.createNewCategories(selectedCategories, tags));
      return {
        promises: promises,
        categories: selectedCategories
      };
    };

    categoryManager.createNewCategories = function(selectedCategories, tags, selectedTags) {
      return _.difference(selectedTags, tags).map(function(newTag) {
        return categoryAPI.save({
          name: newTag
        }).$promise.then(function(category) {
          selectedCategories.push(category);
          return processCategoryAPI.save({
            'category_id': category.id,
            'process_id': process.id
          });
        });
      });
    };


    categoryManager.categoryWasInitiallySelected = function(category, initiallySelectedCategories) {
      return !!initiallySelectedCategories.filter(function(selectedCategory) {
        return selectedCategory.id === category.id;
      }).length;
    };

    categoryManager.categoryIsSelected = function(category, selectedTags) {
      return !!selectedTags.filter(function(selectedTag) {
        return selectedTag === category.name;
      }).length;
    };
    return categoryManager;
  });
})();