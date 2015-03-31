(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.details.categories', [
    'org.bonitasoft.common.filters.date.parser',
    'ui.bootstrap',
    'angular-growl',
    'org.bonitasoft.common.resources.store'
  ])
    .controller('ProcessCategoriesCtrl', function($scope, process, store, categoryAPI, dateParser, $modal, growl, $q, processCategoryAPI) {
      var vm = this;
      vm.process = process;
      vm.parseAndFormat = dateParser.parseAndFormat;
      vm.categories = [];

      store.load(categoryAPI, {
        f: ['id=' + process.id]
      }).then(function(categories) {
        [].push.apply(vm.categories, categories);
      });

      vm.openCreateCategoryAnMapItModal = openCreateCategoryAnMapItModal;
      vm.openProcessCategoryMappingModal = openProcessCategoryMappingModal;
      vm.deleteCategoryMapping = deleteCategoryMapping;
      var growlOpions = {
        ttl: 3000,
        disableCountDown: true,
        disableIcons: true
      };

      /* jshint -W003 */
      function deleteCategoryMapping(category){
        processCategoryAPI.delete({
          'category_id': category.id,
          'process_id': process.id
        }).then(function() {
          vm.categories.splice(vm.categories.indexOf(category),1);
        });
      }

      function openCreateCategoryAnMapItModal() {
        var modalInstance = $modal.open({
          templateUrl: 'features/admin/processes/details/create-category-modal.html',
          controller: 'CreateCategoryModalInstanceCtrl',
          controllerAs: 'createCategoryModalInstanceCtrl',
          resolve: {
            process: function() {
              return process;
            }
          }
        });
        modalInstance.result.then(function(categoriesAndPromises) {
          $q.all(categoriesAndPromises.promises).then(function() {
            console.log('end of categories update');
            vm.categories = categoriesAndPromises.categories;

            growl.success('successfully updated categories', growlOpions);
          });
        }, function() {
          console.log('rejected!!!');
        });
      }

      function openProcessCategoryMappingModal() {
        var modalInstance = $modal.open({
          templateUrl: 'features/admin/processes/details/add-category-mapping-modal.html',
          controller: 'AddCategoryMappingModalInstanceCtrl',
          controllerAs: 'addCategoryMappingInstanceCtrl',
          resolve: {
            process: function() {
              return process;
            },
            alreadySelectedCategories: function() {
              return vm.categories;
            }
          }
        });
        modalInstance.result.then(function(categoriesAndPromises) {
          $q.all(categoriesAndPromises.promises).then(function() {
            console.log('end of categories update');
            vm.categories = categoriesAndPromises.categories;

            growl.success('successfully updated categories', growlOpions);
          });
        }, function() {
          console.log('rejected!!!');
        });
      }
    }).controller('CreateCategoryModalInstanceCtrl', function() {}).controller('AddCategoryMappingModalInstanceCtrl', function($scope, categoryAPI, process, gettextCatalog, $modalInstance, store, alreadySelectedCategories, processCategoryAPI) {
      var vm = this;
      vm.localLang = {
        search: gettextCatalog.getString('Type here to search for a category...'),
        selectAll: gettextCatalog.getString('Select All'),
        selectNone: gettextCatalog.getString('Select None'),
        nothingSelected: gettextCatalog.getString('Select the categories you want to add...')
      };
      vm.selectedCategories = [];
      vm.categories = angular.copy(alreadySelectedCategories);
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