(function () {
  'use strict';

  angular.module('org.bonitasoft.features.admin.applications.details', [
    'ui.bootstrap',
    'org.bonitasoft.common.resources',
    'ui.router',
    'org.bonitasoft.common.directives.bootstrap-form-control',
    'org.bonitasoft.features.admin.applications.details.page-list',
    'org.bonitasoft.common.i18n.filters',
    'ui.tree'
  ])

    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider.state('applicationsDetails', {
        url: '/admin/applications/:id',
        templateUrl: 'features/admin/applications/details/application-details.html',
        controller: 'applicationDetailsCtrl',
        controllerAs: 'applicationDetailsCtrl',
        resolve: {
          translations: 'i18nService'
        }
      });
    }
    ])

    .controller('applicationDetailsCtrl', ['$rootScope', '$scope', '$modal', 'applicationAPI', '$stateParams', function ($rootScope, $scope, $modal, applicationAPI, $stateParams) {

      var ctrl = this;
      ctrl.modal = null;

      ctrl.reload = function reload() {
        $scope.app = applicationAPI.get({
          id: $stateParams.id,
          d: ['createdBy', 'updatedBy', 'profileId', 'layoutId']
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

      ctrl.updateLookNFeel = function updateLookNFeel(size, application) {
        var modal = $modal.open({
          templateUrl: 'features/admin/applications/edit-application-look-n-feel.html',
          controller: 'editLooknfeelCtrl',
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
