/** Copyright (C) 2017 Bonitasoft S.A.
 * Bonitasoft is a trademark of Bonitasoft SA.
 * This software file is BONITASOFT CONFIDENTIAL. Not For Distribution.
 * For commercial licensing information, contact:
 * Bonitasoft, 32 rue Gustave Eiffel – 38000 Grenoble
 * or Bonitasoft US, 51 Federal Street, Suite 305, San Francisco, CA 94107
 */

(function () {
  'use strict';

  angular
    .module('org.bonitasoft.features.admin.bdm')
    .controller('bdmCtrl', bdmCtrl);

  function bdmCtrl(tenantAdminAPI, sessionAPI, bdmAPI, gettext, $modal, FeatureManager, $injector, $timeout) {
    /*jshint validthis: true */
    var vm = this;
    var INSTALLED = 'INSTALLED';
    var INSTALLING = 'INSTALLING';

    vm.isBDMInstallSuccessfull = false;
    vm.isBDMInstallError = '';
    vm.isBDMInstallProcessing = false;
    vm.isAccessControlAvailable = false;
    vm.bdm = {};

    vm.isTechnicalUser = true;
    vm.bonitaVersion = '';
    sessionAPI.get({id: 'unusedId'}).$promise.then(function (session) {
      /*jshint camelcase: false */
      vm.isTechnicalUser = (session.is_technical_user === 'true');
      if (session.version) {
        var splittedVersion = session.version.split('.');
        if (splittedVersion.length > 1) {
          vm.bonitaVersion = splittedVersion[0] + '.' + splittedVersion[1];
        } else {
          vm.bonitaVersion = session.version;
        }
      }
    });

    loadBdmStatus();

    function refreshTenantStatus(){
      tenantAdminAPI.get({id: 'unusedId'}).$promise.then(function (tenantAdmin) {
        vm.isTenantPaused = (tenantAdmin.paused === 'true');
      });
    }

    function loadBdmStatus() {
      refreshTenantStatus();
      return bdmAPI.get().then(function (response) {
        vm.bdm = response.data;
      });
    }

    vm.isAccessControlFeatureActivated = function () {
      return FeatureManager.isAccessControlFeatureActivated();
    };

    vm.accessControlStatus = {};

    vm.updateAccessControlStatus = function () {
      if (vm.isAccessControlFeatureActivated()) {
        return $injector.get('bdmAccessControlAPI').get().then(function (response) {
          vm.accessControlStatus = response.data;
        });
      }
    };

    vm.updateAccessControlStatus();

    vm.isAccessControlInstalled = function () {
        return vm.accessControlStatus && vm.accessControlStatus.state === 'INSTALLED';
    };

    vm.isInstallDisable = function () {
      return !vm.isTenantPaused || vm.isBDMInstallProcessing || vm.isAccessControlInstalled();
    };

    vm.isBDMInstalled = function () {
      return vm.bdm && vm.bdm.state === INSTALLED;
    };

    vm.openBDMUpload = function() {
      resetActionsStatus();
      $modal.open({
        templateUrl: 'features/admin/bdm/add-bdm-popup.html',
        controller: 'AddBDMPopupCtrl',
        controllerAs: 'AddBDMPopupCtrl',
        resolve: {
          bonitaVersion: function () {
            return vm.bonitaVersion;
          }
        }
      }).result.then(function(filePath) {
        installBdmFile(filePath);
      });
    };

    function installBdmFile(filePath) {
      vm.filePath = filePath;
      vm.isBDMInstallProcessing = true;
      vm.bdm = {state: INSTALLING};
      bdmAPI.save({
        // Fix for IE9. The best browser in da world add pre tag around the string.
        fileUpload: vm.filePath//.replace('<pre>', '').replace('</pre>', '')
      }).then(bdmSuccessInstall, bdmErrorInstall);
    }

    function bdmSuccessInstall() {
      loadBdmStatus();
      vm.isBDMInstallProcessing = false;
      vm.isBDMInstallSuccessfull = true;
      vm.isAccessControlAvailable = true;
      $timeout(function(){
        vm.isBDMInstallSuccessfull = false;
        vm.isAccessControlAvailable = false;
      }, 10000);
    }

    function bdmErrorInstall(response) {
      loadBdmStatus();
      vm.isBDMInstallProcessing = false;
      vm.isBDMInstallError = response.status;
    }

    function resetActionsStatus() {
      vm.isBDMInstallSuccessfull = false;
      vm.isBDMInstallError = '';
      vm.isBDMInstallProcessing = false;
    }
  }

})();
