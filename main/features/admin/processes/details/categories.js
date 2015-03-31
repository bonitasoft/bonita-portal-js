(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.details.categories', [
    'org.bonitasoft.common.filters.date.parser',
    'ui.bootstrap',
    'org.bonitasoft.common.resources.store'
  ])
    .controller('ProcessCategoriesCtrl', function($scope, process, store, categoryAPI, dateParser, $modal) {
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

      /* jshint -W003 */
      function openCreateCategoryAnMapItModal() {
        $modal.open({
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
    }).controller('CreateCategoryModalInstanceCtrl', function() {}).controller('AddCategoryMappingModalInstanceCtrl', function($scope, categoryAPI, process, gettextCatalog, $modalInstance, store, alreadySelectedCategories) {
      var vm = this;
      vm.localLang = {
        search: gettextCatalog.getString('Type here to search for a category...'),
        selectAll: gettextCatalog.getString('Select All'),
        selectNone: gettextCatalog.getString('Select None'),
        nothingSelected: gettextCatalog.getString('Select the categories you want to add...')
      };
      vm.selectedUsers = [];
      vm.categories = alreadySelectedCategories;
      var categoryIds = alreadySelectedCategories.map(function(category) {
        return category.id;
      });
      vm.categories.forEach(function(category) {
        category.ticked = true;
      });
      store.load(categoryAPI).then(function(categories) {
        categories.forEach(function(category) {
          if (categoryIds.indexOf(category.id) === -1) {
            vm.categories.push(category);
          }
        });
      });
      vm.ok = function() {
        $modalInstance.close();
      };
      vm.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    });
})();