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

  angular.module('org.bonitasoft.features.admin.applications.details', [
    'ui.bootstrap',
    'org.bonitasoft.common.resources',
    'ui.router',
    'org.bonitasoft.common.directives.bootstrap-form-control',
    'org.bonitasoft.common.directives.avatar-upload',
    'org.bonitasoft.features.admin.applications.details.page-list',
    'org.bonitasoft.common.moment',
    'ui.tree',
    'org.bonitasoft.service.features',
    'xeditable',
    'angularFileUpload'
  ])

    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider.state('bonita.applicationsDetails', {
        url: '/admin/applications/:id',
        templateUrl: 'features/admin/applications/details/application-details.html',
        controller: 'applicationDetailsCtrl',
        controllerAs: 'applicationDetailsCtrl'
      });
    }
    ])

    .controller('applicationDetailsCtrl', ['$rootScope', '$scope', '$modal', 'applicationAPI', '$stateParams', 'FeatureManager', 'store', 'customPageAPI', '$state', 'FileUploader', function ($rootScope, $scope, $modal, applicationAPI, $stateParams, FeatureManager, store, customPageAPI, $state, FileUploader) {

      var ctrl = this;
      ctrl.modal = null;
      ctrl.isEditLayoutAvailable = FeatureManager.isFeatureAvailable('APPLICATION_LOOK_N_FEEL');
      ctrl.applicationId = $stateParams.id;

      store
        .load(customPageAPI, {f:'contentType=layout'})
        .then(function (layoutPages) {
          $scope.layoutPages = layoutPages;
        });

      store
        .load(customPageAPI, {f:'contentType=theme'})
        .then(function (themePages) {
          $scope.themePages = themePages;
        });

      ctrl.reload = function reload() {
        if (ctrl.applicationId === '') {
          $scope.app = undefined;
          return;
        }
        $scope.app = applicationAPI.get({
          id: ctrl.applicationId,
          d: ['createdBy', 'updatedBy', 'profileId', 'layoutId', 'themeId'],
        });
      };

      ctrl.reload();

      ctrl.update = function update(size, application) {
        var modal = $modal.open({
          templateUrl: 'features/admin/applications/edit-application.html',
          controller: 'addApplicationCtrl',
          size: size,
          resolve: {
            application: function () {
              return application;
            }
          }
        });
        modal.result.then(function () {
          ctrl.reload();
        });
      };

      ctrl.updateLayout = function updateLayout(application, $data) {
        var model = {};
        model.id = application.id;
        model.layoutId = $data.id;

        return applicationAPI.update(model)
          .$promise.then(ctrl.reload, ctrl.handleErrors);
      };

      ctrl.updateTheme = function updateLayout(application, $data) {
        var model = {};
        model.id = application.id;
        model.themeId = $data.id;

        return applicationAPI.update(model)
          .$promise.then(ctrl.reload, ctrl.handleErrors);
      };


      ctrl.handleErrors = function handleErrors(response) {
        return response.data.message;
      };

      ctrl.isApplicationFound = function () {
        if ($scope.app) {
          return !!$scope.app.id;
        }
        return false;
      };

      ctrl.uploader = new FileUploader({
        autoUpload: true,
        url: '../portal/imageUpload',
        onSuccessItem: function(item, response) {
          applicationAPI.update({
            id: ctrl.applicationId,
            icon: response
          }).$promise.then(function () {
            $state.reload();
          });
        },
        onErrorItem: function(item, response, status) {
          this.status = status;
        }
      });

    }
    ])
    .directive('backButton', function () {
      return {
        restrict: 'E',
        template: '<button ng-click="goBack()" class="btn btn-default" translate>back</button>',
        controller: ['$scope', '$window', 'manageTopUrl',
          function ($scope, $window) {
            $scope.goBack = function () {
              $window.history.back();
            };
          }
        ]
      };
    });
})();
