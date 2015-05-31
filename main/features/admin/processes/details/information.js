(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.details.information', [
      'org.bonitasoft.common.filters.date.parser',
      'org.bonitasoft.common.directives.bonitags',
      'ui.bootstrap',
      'angular-growl',
      'org.bonitasoft.common.resources.store',
      'org.bonitasoft.features.admin.processes.details.information.categories',
      'org.bonitasoft.services.i18n'
    ])
    .controller('ProcessInformationCtrl', ProcessInformationCtrl);

  /* jshint -W003 */
  function ProcessInformationCtrl($scope, process, dateParser, store, categoryAPI, categories, $q, $modal, growl, i18nService, $log) {
    var vm = this;
    vm.process = process;
    vm.parseAndFormat = dateParser.parseAndFormat;
    vm.selectedCategories = categories.map(function(category) {
      return category.name;
    });
    vm.categories = categories;

    vm.openProcessCategoryManagementModal = openProcessCategoryManagementModal;
    vm.updateTagsAndAlertUser = updateTagsAndAlertUser;
    vm.isProcessResolved = isProcessResolved();
    var growlOptions = {
      ttl: 3000,
      disableCountDown: true,
      disableIcons: true
    };

    function openProcessCategoryManagementModal() {
      var modalInstance = $modal.open({
        templateUrl: 'features/admin/processes/details/manage-category-mapping-modal.html',
        controller: 'ManageCategoryMappingModalInstanceCtrl',
        controllerAs: 'manageCategoryMappingInstanceCtrl',
        resolve: {
          process: function() {
            return process;
          },
          initiallySelectedCategories: function() {
            return vm.categories;
          },
          allCategories: function() {
            return store.load(categoryAPI);
          }
        }
      });
      modalInstance.result.then(vm.updateTagsAndAlertUser, function(error) {
        if(error !== 'cancel') {
          $log.error('category update failed :' , error);
          growl.error(i18nService.getKey('processDetails.informations.category.update.error') + ' : ' + error, growlOptions);
        }
      });

    }

    function updateTagsAndAlertUser(categories) {
      vm.categories = categories;
      vm.selectedCategories.length = 0;
      [].push.apply(vm.selectedCategories, categories.map(function(category) {
        return category.name;
      }));
      growl.success(i18nService.getKey('processDetails.informations.category.update.sucess'), growlOptions);
    }

    function isProcessResolved() {
      return process.configurationState === 'RESOLVED';
    }
  }
})();
