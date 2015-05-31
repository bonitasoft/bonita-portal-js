(function () {
  'use strict';

  angular.module('org.bonitasoft.features.admin.applications.details', [
    'ui.bootstrap',
    'org.bonitasoft.common.resources',
    'ui.router',
    'org.bonitasoft.common.directives.bootstrap-form-control',
    'org.bonitasoft.features.admin.applications.details.page-list',
    'org.bonitasoft.common.i18n.filters',
    'ui.tree',
    'org.bonitasoft.service.features',
    'xeditable'
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

    .controller('applicationDetailsCtrl', ['$rootScope', '$scope', '$modal', 'applicationAPI', '$stateParams', 'FeatureManager', 'store', 'customPageAPI', function ($rootScope, $scope, $modal, applicationAPI, $stateParams, FeatureManager, store, customPageAPI) {

      var ctrl = this;
      ctrl.modal = null;
      ctrl.isEditLayoutAvailable = FeatureManager.isFeatureAvailable('APPLICATION_LOOK_N_FEEL');

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
        $scope.app = applicationAPI.get({
          id: $stateParams.id,
          d: ['createdBy', 'updatedBy', 'profileId', 'layoutId', 'themeId']
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
