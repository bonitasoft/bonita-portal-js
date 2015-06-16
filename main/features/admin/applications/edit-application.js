/** Copyright (C) 2015 Bonitasoft S.A.
 * Bonitasoft, 32 rue Gustave Eiffel - 38000 Grenoble
 * This library is free software; you can redistribute it and/or modify it under the terms
 * of the GNU Lesser General Public License as published by the Free Software Foundation
 * version 2.1 of the License.
 * This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public License along with this
 * program; if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth
 * Floor, Boston, MA 02110-1301, USA.
 */

(function () {
  'use strict';

  angular.module('org.bonitasoft.features.admin.applications.edit', [
    'ui.bootstrap',
    'org.bonitasoft.common.directives.bootstrap-form-control',
    'org.bonitasoft.common.directives.urlified',
    'org.bonitasoft.common.resources',
    'org.bonitasoft.common.resources.store',
    'org.bonitasoft.common.i18n.factories'
  ])
    .controller('addApplicationCtrl', ['$scope', 'applicationAPI', 'profileAPI', 'customPageAPI', '$modalInstance', 'application', 'store', 'i18nMsg',
      function ($scope, applicationAPI, profileAPI, customPageAPI, $modalInstance, application, store, i18nMsg) {

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
          if (response.status === 404) {
            $scope.alerts.push({
              type: 'danger',
              msg: 'The custom page "home" or "defaultlayout" doesn\'t seems installed properly. Go to Configuration > Custom Pages to install it.'
            });
          } else if (response.status === 500 && response.data.cause.exception.indexOf('AlreadyExistsException') > -1) {
            $scope.application.form.token.$duplicate = true;
          } else {
            $scope.alerts.push({
              type: 'danger',
              msg: response.data.message || 'Something went wrong during the creation. You might want to cancel and try again.'
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
            applicationAPI[$scope.editionMode ? 'update' : 'save'](application.model)
              .$promise.then(closeModal, handleErrors);
          }
        };
      }]);
})();
