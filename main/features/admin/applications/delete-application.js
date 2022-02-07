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

(function () {
  'use strict';

  angular.module('org.bonitasoft.features.admin.applications.delete',
    [
      'ui.bootstrap',
      'org.bonitasoft.common.resources',
      'org.bonitasoft.common.i18n'
    ])
    .controller('deleteApplicationCtrl', ['$scope', 'applicationAPI', '$modalInstance', 'application', 'i18nService',
      function ($scope, applicationAPI, $modalInstance, application, i18nService) {

      $scope.application = application;
      $scope.errorMessage = undefined;

      $scope.confirmDelete = function () {
        applicationAPI.delete({id: $scope.application.id}).$promise.then($modalInstance.close, handleErrors);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

      function handleErrors(response) {
        if (response.status === 403) {
          $scope.errorMessage = i18nService.getKey('applications.error.access.denied');
        } else if (response.status === 404) {
          $scope.errorMessage = i18nService.getKey('applications.error.page.not.exist');
        } else if (response.status === 500) {
          $scope.errorMessage = i18nService.getKey('applications.error.internal.Server');
        } else {
          $scope.errorMessage = i18nService.getKey('applications.error.unknown');
        }
      }
    }]);
})();
