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
    .controller('addApplicationCtrl', ['$scope', 'applicationAPI', 'profileAPI', 'customPageAPI', '$modalInstance', 'application', 'store','i18nMsg',
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
          applicationAPI[$scope.editionMode ? 'update' : 'save'](application.model)
            .$promise.then(closeModal, handleErrors);
        };
      }]);
})();
