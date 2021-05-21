/** Copyright (C) 2017 Bonitasoft S.A.
 * Bonitasoft is a trademark of Bonitasoft SA.
 * This software file is BONITASOFT CONFIDENTIAL. Not For Distribution.
 * For commercial licensing information, contact:
 * Bonitasoft, 32 rue Gustave Eiffel – 38000 Grenoble
 * or Bonitasoft US, 51 Federal Street, Suite 305, San Francisco, CA 94107
 */

(function () {
  'use strict';

  describe('Business Data Model in community edition', function () {

    const INSTALLED = 'INSTALLED';

    var bdmCtrl, addBDMPopupCtrl, scope, tenantAdminAPI, sessionAPI, bdmAPI, getTenantStatusRequest, sessionRequest, getBDMRequest, installRequest,
      fileUploader, gettext, modal, modalOpenDeferred, modalInstance, featureManager,
      featureAPI, bonitaVersion;

    beforeEach(module('org.bonitasoft.service.features'));
    beforeEach(module('org.bonitasoft.features.admin.bdm'));

    beforeEach(function () {

      featureAPI = jasmine.createSpyObj('featureAPI', ['query']);

      module(function ($provide) {
        $provide.value('featureAPI', featureAPI);
      });

      inject(function ($controller, $rootScope, FileUploader, _tenantAdminAPI_, _sessionAPI_,  _bdmAPI_, $q, _gettext_, $injector) {

        tenantAdminAPI = _tenantAdminAPI_;
        sessionAPI = _sessionAPI_;
        bdmAPI = _bdmAPI_;
        fileUploader = FileUploader;
        gettext = _gettext_;
        scope = $rootScope.$new();
        modalOpenDeferred = $q.defer();
        modal = {
          open: jasmine.createSpy('open').and.returnValue({
            result: modalOpenDeferred.promise
          })
        };

        modalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss']);

        getTenantStatusRequest = $q.defer();
        spyOn(tenantAdminAPI, 'get').and.returnValue({
          $promise: getTenantStatusRequest.promise
        });

        sessionRequest = $q.defer();
        spyOn(sessionAPI, 'get').and.returnValue({
          $promise: sessionRequest.promise
        });

        getBDMRequest = $q.defer();
        spyOn(bdmAPI, 'get').and.returnValue(getBDMRequest.promise);

        featureManager = $injector.get('FeatureManager');
        spyOn(featureManager, 'isAccessControlFeatureActivated').and.returnValue(false);

        bdmCtrl = function () {
          return $controller('bdmCtrl', {
            '$scope': scope,
            'tenantAdminAPI': tenantAdminAPI,
            'bdmAPI': bdmAPI,
            'gettext': gettext,
            '$modal': modal,
            'FeatureManager': featureManager,
            '$injector': $injector
          });
        };

        installRequest = $q.defer();
        spyOn(bdmAPI, 'save').and.returnValue(installRequest.promise);

        bonitaVersion = '7.7';
        addBDMPopupCtrl = $controller('AddBDMPopupCtrl', {
          '$scope': scope,
          '$modalInstance': modalInstance,
          'FileUploader': FileUploader,
          'gettext': gettext,
          'bonitaVersion': bonitaVersion
        });
      });
    });

    it('should set technical user property to true', function () {
      var ctrl = bdmCtrl();

      sessionRequest.resolve({'is_technical_user': 'true'});
      scope.$apply();

      expect(ctrl.isTechnicalUser).toBeTruthy();
    });

    it('should set technical user property to false', function () {
      var ctrl = bdmCtrl();

      sessionRequest.resolve({'is_technical_user': 'false'});
      scope.$apply();

      expect(ctrl.isTechnicalUser).toBeFalsy();
    });

    it('should set version property', function () {
      var ctrl = bdmCtrl();

      sessionRequest.resolve({'version': '7.10'});
      scope.$apply();

      expect(ctrl.bonitaVersion).toEqual('7.10');
    });

    it('should set version property even when in snapshot', function () {
      var ctrl = bdmCtrl();

      sessionRequest.resolve({'version': '7.7.0-SNAPSHOT'});
      scope.$apply();

      expect(ctrl.bonitaVersion).toEqual('7.7');
    });

    it('should get install button disabled when tenant is not paused', function () {
      var ctrl = bdmCtrl();
      getTenantStatusRequest.resolve({'paused': 'false'});
      getBDMRequest.resolve({'data': {'state': 'UNINSTALLED'}});

      scope.$apply();

      expect(ctrl.isTenantPaused).toEqual(false);
      expect(ctrl.isInstallDisable()).toEqual(true);
      expect(ctrl.isBDMInstalled()).toEqual(false);
    });

    it('should get install button enabled when tenant is paused', function () {
      var ctrl = bdmCtrl();
      getTenantStatusRequest.resolve({'paused': 'true'});
      getBDMRequest.resolve({'data': {'state': 'UNINSTALLED'}});

      scope.$apply();

      expect(ctrl.isTenantPaused).toEqual(true);
      expect(ctrl.isInstallDisable()).toEqual(false);
      expect(ctrl.isBDMInstalled()).toEqual(false);
    });

    it('should get Update button disabled when tenant is not paused', function () {
      var ctrl = bdmCtrl();
      getTenantStatusRequest.resolve({'paused': 'false'});
      getBDMRequest.resolve({'data': {'state': INSTALLED}});

      scope.$apply();

      expect(ctrl.isTenantPaused).toEqual(false);
      expect(ctrl.isInstallDisable()).toEqual(true);
      expect(ctrl.isBDMInstalled()).toEqual(true);
    });

    it('should get Update button enabled when tenant is paused', function () {
      var ctrl = bdmCtrl();
      getTenantStatusRequest.resolve({'paused': 'true'});
      getBDMRequest.resolve({'data': {'state': INSTALLED}});

      scope.$apply();

      expect(ctrl.isTenantPaused).toEqual(true);
      expect(ctrl.isInstallDisable()).toEqual(false);
      expect(ctrl.isBDMInstalled()).toEqual(true);
    });

    it('should Open upload popup when click on install', function () {
      var ctrl = bdmCtrl();
      getTenantStatusRequest.resolve({'paused': 'true'});
      getBDMRequest.resolve({'data': {'state': INSTALLED}});

      scope.$apply();

      ctrl.openBDMUpload();

      expect(modal.open).toHaveBeenCalled();
    });

    it('should display success message when BDM is installed', function () {
      var ctrl = bdmCtrl();
      getTenantStatusRequest.resolve({'paused': 'true'});
      ctrl.openBDMUpload();
      modalOpenDeferred.resolve();

      scope.$apply();
      addBDMPopupCtrl.closeModalSuccess();

      scope.$apply();
      expect(modalInstance.close).toHaveBeenCalled();
      expect(bdmAPI.save).toHaveBeenCalled();
      expect(ctrl.isBDMInstallProcessing).toEqual(true);

      installRequest.resolve({'data': {'state': INSTALLED}});
      scope.$apply();

      expect(ctrl.isBDMInstallProcessing).toEqual(false);
      expect(ctrl.isBDMInstallSuccessfull).toEqual(true);
      expect(ctrl.isAccessControlAvailable).toEqual(true);
      expect(ctrl.isBDMInstallError).toEqual('');
    });

    it('should display error 500 message when BDM install fail', function () {
      var ctrl = bdmCtrl();
      getTenantStatusRequest.resolve({'paused': 'true'});
      getBDMRequest.resolve({'data': {'state': INSTALLED}});
      ctrl.openBDMUpload();
      modalOpenDeferred.resolve();

      scope.$apply();
      addBDMPopupCtrl.closeModalSuccess();

      scope.$apply();
      expect(modalInstance.close).toHaveBeenCalled();
      expect(bdmAPI.save).toHaveBeenCalled();
      expect(ctrl.isBDMInstallProcessing).toEqual(true);

      installRequest.reject({'status':500});
      scope.$apply();

      expect(bdmAPI.get).toHaveBeenCalled();

      expect(ctrl.isBDMInstallProcessing).toEqual(false);
      expect(ctrl.isBDMInstallSuccessfull).toEqual(false);
      expect(ctrl.isAccessControlAvailable).toEqual(false);
      expect(ctrl.isBDMInstallError).toEqual(500);
    });

    it('should display error 400 message when BDM is invalid', function () {
      var ctrl = bdmCtrl();
      getTenantStatusRequest.resolve({'paused': 'true'});
      getBDMRequest.resolve({'data': {'state': INSTALLED}});
      ctrl.openBDMUpload();
      modalOpenDeferred.resolve();

      scope.$apply();
      addBDMPopupCtrl.closeModalSuccess();

      scope.$apply();
      expect(modalInstance.close).toHaveBeenCalled();
      expect(bdmAPI.save).toHaveBeenCalled();
      expect(ctrl.isBDMInstallProcessing).toEqual(true);

      installRequest.reject({'status':400});
      scope.$apply();

      expect(bdmAPI.get).toHaveBeenCalled();

      expect(ctrl.isBDMInstallProcessing).toEqual(false);
      expect(ctrl.isBDMInstallSuccessfull).toEqual(false);
      expect(ctrl.isAccessControlAvailable).toEqual(false);
      expect(ctrl.isBDMInstallError).toEqual(400);
    });

    it('Should reset all messages when open install popup ', function () {
      var ctrl = bdmCtrl();
      getTenantStatusRequest.resolve({'paused': 'true'});
      getBDMRequest.resolve({'data': {'state': INSTALLED}});
      ctrl.isBDMInstallSuccessfull = true;
      ctrl.isBDMInstallError = true;
      ctrl.isBDMInstallProcessing = true;

      ctrl.openBDMUpload();

      scope.$apply();

      expect(ctrl.isBDMInstallProcessing).toEqual(false);
      expect(ctrl.isBDMInstallSuccessfull).toEqual(false);
      expect(ctrl.isBDMInstallError).toEqual('');
    });

  });

})();
