(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.details.information.categories', [
      'org.bonitasoft.common.directives.bonitags',
      'ui.bootstrap',
      'org.bonitasoft.common.resources.store'
    ]).controller('ManageCategoryMappingModalInstanceCtrl', function($scope, categoryAPI, process, gettextCatalog, $modalInstance, store, alreadySelectedCategories, processCategoryAPI) {
      var vm = this;
      vm.localLang = {
        search: gettextCatalog.getString('Type here to search for a category...'),
        selectAll: gettextCatalog.getString('Select All'),
        selectNone: gettextCatalog.getString('Select None'),
        nothingSelected: gettextCatalog.getString('Select the categories you want to add...')
      };
      vm.selectedCategories = [];
      vm.categories = angular.copy(alreadySelectedCategories);
      vm.tags = vm.categories.map(function (category) { return category.name; });
      vm.selectedTags = [];

      $scope.$watch(vm.selectedCategories, function() {
        vm.selectedTags.length = 0;
        [].push.apply(vm.selectedTags, vm.selectedCategories.categories.map(function (category) { return category.name; }));
      }, true);

      var categoryIds = alreadySelectedCategories.map(function(category) {
        return category.id;
      });
      vm.categories.forEach(function(category) {
        category.ticked = true;
        category.tickedInitially = true;
      });
      store.load(categoryAPI).then(function(categories) {
        categories.forEach(function(category) {
          if (categoryIds.indexOf(category.id) === -1) {
            vm.categories.push(category);
          }
        });
      });
      vm.updateCategories = function() {
        var promises = [];
        vm.categories.forEach(function(category) {
          if (categoryIsSelected(category) && !category.ticked) {
            console.log('adding ' + category.name);
            promises.push(processCategoryAPI.save({
              'category_id': category.id,
              'process_id': process.id
            }));
          } else if (!categoryIsSelected(category) && category.ticked) {
            console.log('removing ' + category.name);
            promises.push(processCategoryAPI.delete({
              'category_id': category.id,
              'process_id': process.id
            }));
          }
        });
        $modalInstance.close({
          promises: promises,
          categories: vm.selectedCategories
        });

        function categoryIsSelected(category) {
          return !!vm.selectedCategories.filter(function(selectedCategory) {
            return selectedCategory.id === category.id;
          }).length;
        }
      };
      vm.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    });
})();