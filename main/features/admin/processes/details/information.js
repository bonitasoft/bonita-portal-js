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

  angular.module('org.bonitasoft.features.admin.processes.details.information', [
      'org.bonitasoft.common.filters.date.parser',
      'org.bonitasoft.common.directives.bonitags',
      'ui.bootstrap',
      'angular-growl',
      'org.bonitasoft.common.resources.store',
      'org.bonitasoft.features.admin.processes.details.information.categories',
      'org.bonitasoft.common.i18n'
    ])
    .controller('ProcessInformationCtrl', ProcessInformationCtrl);

  /* jshint -W003 */
  function ProcessInformationCtrl($scope, process, dateParser, store, categoryAPI, categories, $q, $modal, growl,
                                  i18nService, $log,gettextCatalog) {
    var vm = this;
    vm.process = process;
    vm.parseAndFormat = dateParser.parseAndFormat;
    vm.selectedCategories = categories.map(function(category) {
      return category.name;
    });
    vm.categories = categories;
    vm.processActivationState = '';

    vm.openProcessCategoryManagementModal = openProcessCategoryManagementModal;
    vm.updateTagsAndAlertUser = updateTagsAndAlertUser;
    vm.isProcessResolved = isProcessResolved;
    vm.getUserInfo = getUserInfo;

    $scope.$on('activation.state.change', changeStateEvent);

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
        if(['cancel', 'backdrop click'].indexOf(error) === -1) {
          $log.error('category update failed :' , error);
          growl.error(i18nService.getKey('processDetails.informations.category.update.error') + ' : ' + error);
        }
      });

    }

    function updateTagsAndAlertUser(categories) {
      var updateStatus = JSON.stringify(vm.categories) !== JSON.stringify(categories);

      vm.categories = categories;
      vm.selectedCategories.length = 0;
      [].push.apply(vm.selectedCategories, categories.map(function(category) {
        return category.name;
      }));
      if(updateStatus){
        growl.success(gettextCatalog.getString('Successfully updated categories'));
      }else{
        growl.warning(gettextCatalog.getString('No updates have been made on categories. Don\'t forget to press "Enter" key after selecting a category.'));
      }

    }

    function isProcessResolved() {
      return vm.process.configurationState === 'RESOLVED';
    }

    function getUserInfo(user) {
      return user.firstname && user.lastname ? user.firstname + ' ' + user.lastname : user.userName;
    }

    function changeStateEvent(event, args) {
      vm.process.activationState = args.newState;
    }
  }
})();
