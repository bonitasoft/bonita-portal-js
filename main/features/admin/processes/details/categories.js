(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.details.categories', [
    'org.bonitasoft.common.filters.date.parser',
    'ui.bootstrap',
    'angular-growl',
    'org.bonitasoft.common.resources.store'
  ])
    .controller('ProcessCategoriesCtrl', function($scope, process, store, categoryAPI, dateParser, $modal, growl, $q) {
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
      var growlOpions = {
        ttl: 3000,
        disableCountDown: true,
        disableIcons: true
      };

      /* jshint -W003 */
      function openCreateCategoryAnMapItModal() {
        var modalInstance = $modal.open({
          templateUrl: 'features/admin/processes/details/create-category-modal.html',
          controller: 'CreateCategoryModalInstanceCtrl',
          controllerAs: 'createCategoryModalInstanceCtrl',
          size: 'sm',
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
        });
      }

      function openProcessCategoryMappingModal() {
        $modal.open({
          templateUrl: 'features/admin/processes/details/add-category-mapping-modal.html',
          controller: 'AddCategoryMappingModalInstanceCtrl',
          controllerAs: 'addCategoryMappingInstanceCtrl',
          size: 'sm',
          resolve: {
            process: function() {
              return process;
            },
            alreadySelectedCategories: function() {
              return vm.categories;
            }
          }
        });
      }
    }).controller('CreateCategoryModalInstanceCtrl', function() {}).controller('AddCategoryMappingModalInstanceCtrl', function($scope, categoryAPI, process, gettextCatalog, $modalInstance, store, alreadySelectedCategories, $http, API_PATH) {
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
          if (vm.selectedCategories.indexOf(category) !== -1 && !category.ticked) {
            console.log('adding ' + category.name);
            promises.push($http({url: API_PATH + 'bpm/processCategory', method: 'POST', data: {
              'category_id': category.id,
              'process_id': process.id
            }}));
          } else if (vm.selectedCategories.indexOf(category) === -1 && category.ticked) {
            console.log('removing ' + category.name);
            promises.push($http({url: API_PATH + 'bpm/processCategory', method: 'DELETE', data: [process.id + '/' + category.id]}));
          }
        });
        $modalInstance.close({
          promises: promises,
          categories: vm.selectedCategories
        });
      };
      vm.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    });
})();