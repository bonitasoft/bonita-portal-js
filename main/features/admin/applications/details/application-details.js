(function() {
  'use strict';

  angular.module('com.bonita.features.admin.applications.details', [
    'ui.bootstrap',
    'com.bonita.common.resources',
    'ui.router',
    'com.bonita.common.directives.bootstrap-form-control',
    'com.bonita.features.admin.applications.details.page-list',
    'com.bonita.common.i18n.filters',
    'ui.tree'
  ])

  .config(['$stateProvider', function($stateProvider) {
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

  .controller('applicationDetailsCtrl', ['$rootScope', '$scope', '$modal', 'applicationAPI', '$stateParams', function($rootScope, $scope, $modal, applicationAPI, $stateParams) {

      var ctrl = this;
      ctrl.modal = null;

      ctrl.reload = function reload() {
        $scope.app = applicationAPI.get({
          id: $stateParams.id,
          d: ['createdBy', 'updatedBy', 'profileId']
        });
      };

      ctrl.reload();

      ctrl.update = function update(size, application) {
        ctrl.modal = $modal.open({
          templateUrl: 'features/admin/applications/edit-application.html',
          controller: 'addApplicationCtrl',
          size: size,
          resolve: {
            application: function() {
              return application;
            }
          }
        });

        ctrl.modal.result.then(function() {
          ctrl.reload();
        });
      };
    }
  ])
    .directive('backButton', function() {
        return {
          restrict: 'E',
          template: '<button ng-click="goBack()" class="btn btn-default" translate>back</button>',
          controller: ['$scope', '$window', 'manageTopUrl',
            function($scope, $window) {
              $scope.goBack = function() {
                $window.history.back();
              };
            }
          ]
        };
      });
})();
