(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.details.information.categories', [
      'org.bonitasoft.common.directives.bonitags',
      'ui.bootstrap',
      'org.bonitasoft.common.resources.store',
      'gettext'
    ]).controller('ManageCategoryMappingModalInstanceCtrl', function($scope, categoryAPI, process, gettextCatalog, $modalInstance, store, initiallySelectedCategories, allCategories, processCategoryAPI) {
      var vm = this;
      vm.localLang = {
        search: gettextCatalog.getString('Type here to search for a category...'),
        selectAll: gettextCatalog.getString('Select All'),
        selectNone: gettextCatalog.getString('Select None'),
        nothingSelected: gettextCatalog.getString('Select the categories you want to add...')
      };
      vm.selectedTags = initiallySelectedCategories.map(function (category) { return category.name; });
      vm.tags = allCategories.map(function (category) { return category.name; });

      
      vm.updateCategories = function() {
        var promises = [],
        selectedCategories = [];
        allCategories.forEach(function(category) {
          if (categoryIsSelected(category)){
            selectedCategories.push(category);
            if(!categoryWasInitiallySelected(category)) {
              console.log('adding ' + category.name);
              promises.push(processCategoryAPI.save({
                'category_id': category.id,
                'process_id': process.id
              }));
            }
          } else if (!categoryIsSelected(category) && categoryWasInitiallySelected(category)) {
            console.log('removing ' + category.name);
            promises.push(processCategoryAPI.delete({
              'category_id': category.id,
              'process_id': process.id
            }));
          }
        });
        [].push(promises, createNewCategories());
        $modalInstance.close({
          promises: promises,
          categories: selectedCategories
        });

        /* jshint -W003 */
        function createNewCategories() {
          return _.difference(vm.selectedTags, vm.tags).map(function(newTag) {
            return categoryAPI.save({name:newTag}).$promise.then(function(category){
              selectedCategories.push(category);
              return processCategoryAPI.save({
                'category_id': category.id,
                'process_id': process.id
              });
            });
          });
        }


        function categoryWasInitiallySelected(category) {
          return !!initiallySelectedCategories.filter(function(selectedCategory) {
            return selectedCategory.id === category.id;
          }).length;
        }

        function categoryIsSelected(category) {
          return !!vm.selectedTags.filter(function(selectedTag) {
            return selectedTag === category.name;
          }).length;
        }
      };
      vm.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    });
})();