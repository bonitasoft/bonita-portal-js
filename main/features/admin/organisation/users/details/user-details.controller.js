(function () {
  'use strict';

  angular
    .module('org.bonitasoft.features.admin.organisation.users')
    .controller('UserDetailsCtrl', UserDetailsCtrl);

  /* jshint camelcase: false */
  function UserDetailsCtrl(user, growl, gettextCatalog, professionalDataAPI, personalDataAPI, userAPI) {
    var vm = this;
    vm.user = user;

    // reset the manager field when user has no manager. (i.e. rest API is sending us manager_id: "0")
    vm.user.manager_id = !angular.isObject(vm.user.manager_id) ? undefined : vm.user.manager_id;

    vm.saveGeneralInformation = function (user) {
      userAPI.update({
        id: user.id,
        title: user.title,
        firstname: user.firstname,
        lastname: user.lastname,
        userName: user.userName,
        job_title: user.job_title,
        manager_id: user.manager_id ? user.manager_id.id : ''
      }).$promise.then(function () {
        growl.success(gettextCatalog.getString('General information successfully updated'));
      }, function () {
        growl.error(gettextCatalog.getString(
          'General information where not updated. Please retry later or contact an administrator'));
      });
    };

    vm.updatePassword = function (password) {
      /* jshint camelcase: false */
      userAPI.update({
        id: vm.user.id,
        password: password.new,
        password_confirm: password.confirm
      }).$promise.then(function () {
        growl.success(gettextCatalog.getString('Password successfully updated'));
      }, function () {
        growl.error(gettextCatalog.getString(
          'Password was not updated. Please retry later or contact an administrator'));
      });
    };

    vm.saveBusinessCard = function (cardData) {
      professionalDataAPI.save(cardData).$promise
        .then(function () {
          growl.success(gettextCatalog.getString('Business card successfully updated'));
        }, function () {
          growl.error(gettextCatalog.getString(
            'Business card were not updated. Please retry later or contact an administrator'));
        });
    };

    vm.savePersonalInformation = function (cardData) {
      personalDataAPI.save(cardData).$promise
        .then(function () {
          growl.success(gettextCatalog.getString('Personal information successfully updated'));
        }, function () {
          growl.error(gettextCatalog.getString(
            'Personal information were not updated. Please retry later or contact an administrator'));
        });
    };

    vm.searchManagers = function(search) {
      return userAPI.search({
        'c': 20,
        'p': 0,
        'o': 'userName',
        's': search
      }).$promise.then(function(result){
        return result.data;
      });
    };

  }
})();
