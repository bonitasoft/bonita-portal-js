/** Copyright (C) 2015 Bonitasoft S.A.
 * BonitaSoft, 31 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

(function () {
  'use strict';

  angular.module('org.bonitasoft.features.admin.applications.list', [
    'ui.bootstrap',
    'angularFileUpload',
    'org.bonitasoft.common.directives.bonitaHref',
    'org.bonitasoft.common.resources',
    'org.bonitasoft.common.resources.store',
    'org.bonitasoft.features.admin.applications.edit',
    'org.bonitasoft.features.admin.applications.delete',
    'org.bonitasoft.common.i18n.filters',
    'ui.router',
    'org.bonitasoft.services.topurl',
    'org.bonitasoft.bonitable',
    'org.bonitasoft.templates'
  ])
    .config(['$stateProvider', function ($stateProvider) {
      $stateProvider.state('bonita.applications', {
        url: '/admin/applications',
        templateUrl: 'features/admin/applications/applications-list.html',
        controller: 'applicationsListCtrl',
        controllerAs: 'applicationsListCtrl',
        resolve: {
          templatingAppLoader: ['templateAppDetailLoader', function(templateAppDetailLoader) {
            return templateAppDetailLoader.load();
          }]
        }
      });
    }])
    .controller('applicationsListCtrl', ['$scope', 'applicationAPI', '$modal', 'store', 'templateAppDetailLoader', 'manageTopUrl', function ($scope, applicationAPI, $modal, store, templateAppDetailLoader, manageTopUrl) {

        var self = this;
        self.modalCreate = null;
        self.modalDelete = null;
        self.modalImport = null;
        self.modalExport = null;

        /**
         * Load the application's information
         * @return {void}
         */
        function reload() {
          store
            .load(applicationAPI, {
              d: ['profileId', 'createdBy', 'updatedBy', 'layoutId']
            })
            .then(function(applications) {
              $scope.applications = applications;
              $scope.noData = !applications.length;
            });
        }

        reload();

        $scope.sortableOptions = {
          property: 'lastUpdateDate',
          direction: true
        };

        /**
         * Create a new application,
         * Open a modal and its form
         * @param  {string} size Modal size
         * @return {void}
         */
        this.create = function create(size) {
          self.modalCreate = $modal.open({
            templateUrl: 'features/admin/applications/edit-application.html',
            controller: 'addApplicationCtrl',
            controllerAs: 'addApplicationCtrl',
            size: size,
            resolve: {
              application: angular.noop
            }
          });

          // Trigger the reload of the list
          self.modalCreate.result.then(reload);
        };

        /**
         * Import a new app from an xml file
         * @param  {String} size Size of the modal
         * @return {void}
         */
        this.importApp = function importApp() {
          self.modalImport = $modal.open({
            templateUrl: 'features/admin/applications/import-application.html',
            controller: 'importApplicationCtrl',
            controllerAs: 'importApplicationCtrl',
            resolve: {
              application: angular.noop
            }
          });

          self.modalImport.result.then(reload);
        };

        /**
         * Export a current application to XML
         * @param  {OBject} application
         * @return {void}
         */
        this.exportApplication = function exportApplication(application) {
          self.modalExport = $modal.open({
            templateUrl: 'features/admin/applications/export-application.html',
            controller: 'exportApplicationCtrl',
            controllerAs: 'exportApplicationCtrl',
            size: 'md',
            resolve: {
              application: function () {
                return application;
              }
            }
          });

          // Trigger the reload of the list
          self.modalExport.result.then(reload);
        };

        this.goToDetails = function goToDetails(applicationId){
          manageTopUrl.addOrReplaceParam('_id',applicationId);
        };

        /**
         * Bind the template for a popover
         * @param {Object} application current application
         * @return {String} HTML
         */
        this.loadTemplatePopover = templateAppDetailLoader.compile;

        /**
         * Delete an application
         * @param  {Object} application
         * @param  {String} size        Size for the modal
         * @return {void}
         */
        this.deleteApplication = function deleteApplication(application, size) {
          self.modalDelete = $modal.open({
            templateUrl: 'features/admin/applications/delete-application.html',
            controller: 'deleteApplicationCtrl',
            controllerAs: 'deleteApplicationCtrl',
            size: size,
            resolve: {
              application: function () {
                return application;
              }
            }
          });

          self.modalDelete.result.then(reload);
        };
      }]
    )
    .controller('exportApplicationCtrl', ['$scope', '$modalInstance', 'application', function ($scope, $modalInstance, application) {
      $scope.application = application;
      /**
       * Close da modal
       * @return {void}
       */
      this.cancel = function cancel() {
        $modalInstance.dismiss('cancel');
      };
    }])
    .controller('importApplicationCtrl', function ($scope, $modalInstance, FileUploader, importApplication, $log) {

      var self = this;

      /**
       * Callback on uploadSuccess
       * @param  {FileObject} fileItem
       * @param  {String} page     API return
       * @return {void}
       */
      self.successUpload = function successUpload(fileItem, page) {

        fileItem = fileItem || {file:{}};

        $scope.isUploadSuccess = true;
        $scope.fileName        = fileItem.file.name;
        $scope.filePath        = page || '';
      };

      /**
       * Cannot upload the file
       * @throws {Error} If Cannot upload the file
       * @return {void}
       */
      self.errorUpload = function errorUpload() {
        throw new Error('Cannot upload the file');
      };

      $scope.uploader = new FileUploader({
        autoUpload: true,
        url: '/bonita/portal/applicationsUpload',
        onSuccessItem: self.successUpload,
        onErrorItem: self.errorUpload
      });

      /**
       * Import an application
       * @return {void}
       */
      this.importApp = function importApp() {
        importApplication
          .save({
            importPolicy: 'FAIL_ON_DUPLICATES',
            // Fix for IE9. The best browser in da world add pre tag around the string.
            applicationsDataUpload: $scope.filePath.replace('<pre>','').replace('</pre>','')
          })
          .$promise.then(successImportCb,errorImportCb);
      };

      function successImportCb(data) {
        $scope.importIsSuccessfull = true;
        $scope.totalImportedApps   = data.imported.length;
        $scope.imports             = data.imported;
        $scope.errorsApi           = data.errors;
        $log.debug('[importApplicationCtrl@successUpload] Import a new app');
      }

      function errorImportCb(res) {
        $scope.importNotSuccessfull = true;
        $scope.messageError = res.data.message;
      }

      /**
       * Close da modal
       * @return {void}
       */
      this.cancel = function cancel() {
        $modalInstance.dismiss('cancel');
      };

      /**
       * Close da modal
       * @return {void}
       */
      this.closeModalSuccess = function closeModalSuccess() {
        $modalInstance.close();
      };
    })
    .service('templateAppDetailLoader', ['$interpolate', '$templateCache', '$http', '$q', function ($interpolate, $templateCache, $http, $q) {

      var self = this;

      /**
       * When the template will be load on load of dat application,
       * it will become an $interpolate call with the template.
       * @type {Function}
       */
      this.compile = angular.noop;

      /**
       * Load the custom modal template for an app detail
       * Use a service to load instead of a controller to have only one request.
       * @param  {Function} cb Callback with the template as arg
       * @return {void}
       */
      this.load = function templateLoader(cb) {

        cb = cb || angular.noop;
        // Because of ui.bootstrap does not provide unsafe popover
        return $q.all([
          $http.get('features/admin/applications/details/popverunsafe.html'),
          $http.get('features/admin/applications/details/application-details-app.html')
        ])
          .then(function (data) {
            $templateCache.put('template/popover/popover.html', data[0].data);
            $templateCache.put('features/admin/applications/details/application-details-app.html', data[1].data);
            // This is were the magic appends
            self.compile = $interpolate(data[1].data);
            cb(data[0].data);
          });
      };

    }])
    .directive('exportAppButton', function() {

      return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
          url: '@',
          appId: '@',
          title: '@'
        },
        template: '<a class="btn-export" ng-href="{{url || \'/bonita/portal/exportApplications?id=\'}}{{appId}}" ng-transclude></a>'
      };
    });

})();
