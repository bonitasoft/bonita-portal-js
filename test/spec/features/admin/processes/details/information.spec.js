/** Copyright (C) 2015 Bonitasoft S.A.
 * Bonitasoft, 32 rue Gustave Eiffel - 38000 Grenoble
 * This library is free software; you can redistribute it and/or modify it under the terms
 * of the GNU Lesser General Public License as published by the Free Software Foundation
 * version 2.1 of the License.
 * This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public License along with this
 * program; if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth
 * Floor, Boston, MA 02110-1301, USA.
 */

(function() {
  'use strict';
  describe('ProcessInformationCtrl', function(){
    var scope, controller, processInformationCtrl, process, categories, q, growl, log, store, categoryAPI, modal;

    beforeEach(module('org.bonitasoft.features.admin.processes.details.information'));

    beforeEach(inject(function($rootScope, $controller, $q, _growl_, $log,  _store_, _categoryAPI_, _$modal_) {
      scope = $rootScope.$new();
      controller = $controller;
      q = $q;
      var cat1 = {id:111, name: 'catego1'},
        cat2 = {id:222, name: 'catego2'},
        cat3 = {id:333, name: 'catego3'};
      categories = [cat1, cat2, cat3];
      process = {};
      growl = _growl_;
      store = _store_;
      categoryAPI = _categoryAPI_;
      modal = _$modal_;
      spyOn(store, 'load');
      spyOn(categoryAPI, 'search');
      spyOn(modal, 'open');
      log = $log;
      spyOn(growl,'success');
      spyOn(growl,'error');
      spyOn(log, ['error']);
    }));
    it('should init the controller', function(){
      processInformationCtrl = controller('ProcessInformationCtrl', {
        $scope : scope,
        process : process,
        categories : categories,
        dateParser : {parseAndFormat : jasmine.createSpy()}
      });
      expect(processInformationCtrl.process).toBe(process);
      expect(processInformationCtrl.parseAndFormat).toBeDefined();
      expect(processInformationCtrl.selectedCategories).toEqual(['catego1', 'catego2', 'catego3']);
      expect(processInformationCtrl.categories).toEqual(categories);
    });
    describe('openProcessCategoryManagementModal function', function(){
      var modalInstance;
      beforeEach(function(){
        modalInstance = {};
        modal.open.and.returnValue(modalInstance);
        processInformationCtrl = controller('ProcessInformationCtrl', {
          $scope : scope,
          process : process,
          categories : categories,
          dateParser : {parseAndFormat : jasmine.createSpy()},
          store : store,
          categoryAPI : categoryAPI,
          $modal : modal,
          growl : growl,
          $log: log
        });
      });
      it('should open modal retrieving categories and cancel modal should not trigger error management', function(){
        var deferredStore = q.defer();
        store.load.and.returnValue(deferredStore.promise);
        modalInstance.result = deferredStore.promise;
        processInformationCtrl.openProcessCategoryManagementModal();
        var options = modal.open.calls.mostRecent().args[0];
        expect(options.templateUrl).toEqual('features/admin/processes/details/manage-category-mapping-modal.html');
        expect(options.controller).toEqual('ManageCategoryMappingModalInstanceCtrl');
        expect(options.controllerAs).toEqual('manageCategoryMappingInstanceCtrl');
        expect(options.resolve.process()).toEqual(process);
        expect(options.resolve.initiallySelectedCategories()).toEqual(processInformationCtrl.categories);
        expect(options.resolve.allCategories()).toBe(deferredStore.promise);
        deferredStore.reject('cancel');
        scope.$apply();
        expect(growl.error).not.toHaveBeenCalled();
        expect(log.error).not.toHaveBeenCalled();
      });

      it('should open modal retrieving categories and error in modal should trigger error management', function(){
        var deferredStore = q.defer();
        store.load.and.returnValue(deferredStore.promise);
        modalInstance.result = deferredStore.promise;
        processInformationCtrl.openProcessCategoryManagementModal();
        deferredStore.reject('error during save!');
        scope.$apply();
        expect(growl.error).toHaveBeenCalled();
        expect(log.error).toHaveBeenCalled();
      });

      it('should open modal retrieving categories and call updateTagsAndAlertUser on success', function(){
        var deferredStore = q.defer();
        store.load.and.returnValue(deferredStore.promise);
        modalInstance.result = deferredStore.promise;
        spyOn(processInformationCtrl,'updateTagsAndAlertUser');
        processInformationCtrl.openProcessCategoryManagementModal();
        var categories = [{},{}];
        deferredStore.resolve(categories);
        scope.$apply();
        expect(processInformationCtrl.updateTagsAndAlertUser).toHaveBeenCalledWith(categories);
      });
      describe('updateTagsAndAlertUser function', function(){
        it('should wait For Promise And Update Tags And Alert User', function(){
          var cat1 = {id:111, name: 'cate1'},
            cat2 = {id:222, name: 'cate2'},
            cat3 = {id:333, name: 'cate3'}, categories = [cat1, cat2, cat3];

          processInformationCtrl.updateTagsAndAlertUser(categories);
          scope.$apply();
          expect(processInformationCtrl.categories).toEqual(categories);
          expect(processInformationCtrl.selectedCategories).toEqual(['cate1', 'cate2', 'cate3']);
          expect(growl.success.calls.mostRecent().args[0]).toEqual('Successfully updated categories');
        });
      });
    });
  });
})();
