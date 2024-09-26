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

  angular.module('org.bonitasoft.features.admin.applications.edit', [
    'ui.bootstrap',
    'org.bonitasoft.common.directives.bootstrap-form-control',
    'org.bonitasoft.common.directives.urlified',
    'org.bonitasoft.common.resources',
    'org.bonitasoft.common.resources.store',
    'org.bonitasoft.common.i18n'
  ])
    .controller('addApplicationCtrl', ['$scope', 'applicationAPI', 'profileAPI', 'customPageAPI', '$modalInstance', 'application', 'store', 'i18nMsg', 'i18nService',
      function ($scope, applicationAPI, profileAPI, customPageAPI, $modalInstance, application, store, i18nMsg, i18nService) {

        $scope.i18n = i18nMsg.field;

        $scope.editionMode = !!application;

        if ($scope.editionMode) {
          $scope.application = {
            model: angular.copy(application)
          };
          // in case profile is deployed
          $scope.application.model.profileId = application.profileId && application.profileId.id || application.profileId;
          // in case layout is deployed
          $scope.application.model.layoutId = application.layoutId && application.layoutId.id || application.layoutId;
          // in case layout is deployed
          $scope.application.model.themeId = application.themeId && application.themeId.id || application.themeId;
        } else {
          $scope.application = {
            model: {
              link: 'false',
              version: '1.0',
              profileId: '1'
            }
          };
        }

        store
          .load(profileAPI)
          .then(function (profiles) {
            $scope.profiles = profiles;
          });

        $scope.alerts = [];

        $scope.closeAlert = function closeAlert(index) {
          $scope.alerts.splice(index, 1);
        };

        $scope.cancel = function cancel() {
          $modalInstance.dismiss('cancel');
        };

        function handleErrors(response) {
          if (response.status === 403) {
            $scope.alerts.push({
              type: 'danger',
              msg: i18nService.getKey('applications.error.access.denied')
            });
          } else if (response.status === 404) {
            $scope.alerts.push({
              type: 'danger',
              msg: i18nService.getKey('application.edit.error.page.not.exist')
            });
          } else if (response.status === 500 && response.data.cause.exception.indexOf('AlreadyExistsException') > -1) {
            $scope.application.form.token.$duplicate = true;
            $scope.alerts.push({
              type: 'danger',
              msg: i18nService.getKey('applications.error.internal.Server')
            });
          } else {
            $scope.alerts.push({
              type: 'danger',
              msg: response.data.message || i18nService.getKey('application.edit.error.unknown')
            });
          }
        }

        function closeModal() {
          $modalInstance.close();
        }

        $scope.submit = function submit(application) {
          var tokenToLowerCase = application.model.token.toLowerCase();
          $scope.application.form.token.$reservedToken = false;
          if (tokenToLowerCase === 'api' || tokenToLowerCase === 'content' || tokenToLowerCase === 'theme') {
            $scope.application.form.token.$reservedToken = true;
          } else {
            var applicationDataToSend = angular.copy(application.model);
            applicationAPI[$scope.editionMode ? 'update' : 'save'](applicationDataToSend)
              .$promise.then(closeModal, handleErrors);
          }
        };
      }]);
})();
