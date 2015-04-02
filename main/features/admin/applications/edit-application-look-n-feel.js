(function () {
  'use strict';

  angular.module('org.bonitasoft.features.admin.applications.editLookNFeel', [
    'ui.bootstrap',
    'org.bonitasoft.common.directives.bootstrap-form-control',
    'org.bonitasoft.common.directives.urlified',
    'org.bonitasoft.common.resources',
    'org.bonitasoft.common.resources.store',
    'org.bonitasoft.common.i18n.factories'
  ])
    .controller('editLooknfeelCtrl', ['$scope', 'applicationAPI', 'profileAPI', 'customPageAPI', '$modalInstance', 'application', 'store', 'i18nMsg',
      function ($scope, applicationAPI, profileAPI, customPageAPI, $modalInstance, application, store, i18nMsg) {

        $scope.i18n = i18nMsg.field;

        $scope.application = {
          model: angular.copy(application)
        };
        // in case profile is deployed
        $scope.application.model.profileId = application.profileId && application.profileId.id || application.profileId;
        // in case layout is deployed
        $scope.application.model.layoutId = application.layoutId && application.layoutId.id || application.layoutId;
        store
          .load(customPageAPI)
          .then(function (layoutPages) {
            $scope.layoutPages = layoutPages;
          });

        $scope.alerts = [];

        $scope.closeAlert = function closeAlert(index) {
          $scope.alerts.splice(index, 1);
        };

        $scope.cancel = function cancel() {
          $modalInstance.dismiss('cancel');
        };

        function handleErrors(response) {
          $scope.alerts.push({
            type: 'danger',
            msg: response.data.message || 'Something went wrong during the edition. You might want to cancel and try again.'
          });
        }

        function closeModal() {
          $modalInstance.close();
        }

        $scope.submit = function submit(application) {
          applicationAPI.update(application.model)
            .$promise.then(closeModal, handleErrors);
        };
      }]);
})();
