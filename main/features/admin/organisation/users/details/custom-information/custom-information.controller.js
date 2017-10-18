(function () {
  'use strict';

  angular
    .module('org.bonitasoft.features.admin.organisation.users')
    .controller('UserCustomInfoCtrl', UserCustomInfoCtrl);

  function UserCustomInfoCtrl(customInformation, customUserInfoAPI, $q, growl, gettextCatalog) {
    var vm = this;
    vm.customInformation = customInformation;

    function updateSingleInfo(info) {
      return customUserInfoAPI.update({
        id: info.definitionId.id,
        userId: info.userId
      }, { value: info.value }).$promise;
    }

    vm.saveCustomInfo = function(infos) {
      var promises = infos.map(updateSingleInfo);

      $q.all(promises)
        .then(function() {
          growl.success(gettextCatalog.getString('Custom information successfully updated'));
        }, function() {
          growl.error(gettextCatalog.getString(
            'Custom information has not been updated. Please retry later or contact an administrator'));
        });
    };

    vm.hasCustomInfo = function() {
      return vm.customInformation && vm.customInformation.length > 0;
    };

  }
})();
