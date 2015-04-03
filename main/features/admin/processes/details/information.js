(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.details.information', ['org.bonitasoft.common.filters.date.parser',
      'org.bonitasoft.common.directives.bonitags',
      'ui.bootstrap',
      'angular-growl',
      'org.bonitasoft.features.admin.processes.details.information.categories'
    ])
    .controller('processInformationCtrl', function($scope, process, dateParser, store, categoryAPI, categories, $q, $modal, growl) {
      var vm = this;
      vm.process = process;
      vm.parseAndFormat = dateParser.parseAndFormat;
      vm.selectedCategories = categories.map(function (category) { return category.name; });
      vm.categories = categories;

      vm.openProcessCategoryManagementModal = openProcessCategoryManagementModal;

      var growlOpions = {
        ttl: 3000,
        disableCountDown: true,
        disableIcons: true
      };
      
      /* jshint -W003 */
      function openProcessCategoryManagementModal() {
        var modalInstance = $modal.open({
          templateUrl: 'features/admin/processes/details/manage-category-mapping-modal.html',
          controller: 'ManageCategoryMappingModalInstanceCtrl',
          controllerAs: 'manageCategoryMappingInstanceCtrl',
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
            vm.selectedCategories.length = 0;
            [].push.apply(vm.selectedCategories, categoriesAndPromises.categories.map(function (category) { return category.name; }));
            growl.success('successfully updated categories', growlOpions);
          });
        }, function() {
          growl.error('error during category update', growlOpions);
        });
      }
    });
})();