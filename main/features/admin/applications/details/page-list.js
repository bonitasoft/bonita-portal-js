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

(function() {
  'use strict';


  angular.module('org.bonitasoft.features.admin.applications.details.page-list', [
    'ui.bootstrap',
    'org.bonitasoft.common.directives.bootstrap-form-control',
    'org.bonitasoft.features.admin.applications.edit',
    'org.bonitasoft.common.directives.urlified',
    'org.bonitasoft.common.resources',
    'org.bonitasoft.common.i18n'
  ])
    .controller('addPageCtrl', function ($scope, customPageAPI, applicationPageAPI, applicationMenuAPI, $modalInstance, application, i18nMsg, store) {

        $scope.alerts = [];
        $scope.closeAlert = function(index) {
          $scope.alerts.splice(index, 1);
        };
        $scope.i18n = i18nMsg.field;
        $scope.application = application;

        store.load(customPageAPI, {f: ['contentType=page', 'isHidden=false']})
          .then(function (pages) {
            $scope.customPages = pages;
          });

        $scope.add = function(page) {
          var tokenToLowerCase = page.model.token.toLowerCase();
          $scope.page.form.token.$reservedToken = false;
          if (tokenToLowerCase === 'api' || tokenToLowerCase === 'content' || tokenToLowerCase === 'theme') {
            $scope.page.form.token.$reservedToken = true;
          }else{
            page.model.applicationId = $scope.application.id;
            applicationPageAPI.save(page.model).$promise.then(closeModal, handleErrors);
          }

        };

        function handleErrors(response) {
          if (response.status === 500 && response.data.cause.exception.indexOf('AlreadyExistsException') > -1) {
            $scope.page.form.token.$duplicate = true;
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

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };
      }
   )

  .controller('pageListCtrl', ['$scope', 'pageModel', '$modal', function($scope, pageModel, $modal) {

    var ctrl = this;
    ctrl.modal = null;

    $scope.pages = [];

    /**
     * Load pages for the current application
     * @param  {Boolean} isLoad Define if it's the first load or not
     * @return {void}
     */
    ctrl.loadPages = function loadPages(isLoad) {
      pageModel.load($scope.application.id, true === isLoad)
        .then(function(pages) {
          $scope.pages = pages;
        });
    };

    // Fist load of da page
    ctrl.loadPages(true);

    /**
     * We will create a new page, it opens a modal with a form
     * @return {void}
     */
    ctrl.add = function add() {
      ctrl.modal = $modal.open({
        templateUrl: 'features/admin/applications/details/page-list-addPageModal.html',
        controller: 'addPageCtrl',
        size: 'lg',
        resolve: {
          application: function() {
            return $scope.application;
          }
        }
      });

      ctrl.modal.result.then(ctrl.loadPages);
    };

    /**
     * Remove a page then reload the list of pages
     * @param  {Object} page
     * @return {void}
     */
    ctrl.remove = function remove(page) {
      pageModel.remove(page)
        .then(ctrl.loadPages);
    };

    /**
     * Define a page as the home page
     * @param {Object} page
     */
    ctrl.setAsHomePage = function setAsHomePage(page) {

      pageModel
        .setHome(page, $scope.application)
        .then(function() {
          ctrl.loadPages();
          $scope.application.homePageId = page.id;
        });
    };
  }])
    .factory('pageModel', ['$rootScope', '$q', 'store', 'applicationPageAPI', 'applicationAPI', 'i18nService',
      function($rootScope, $q, store, applicationPageAPI, applicationAPI, i18nService) {

      var service = {};
      $rootScope.errorMessage = undefined;

      /**
       * Check if we have some pages in da scope
       * Emits an event: page-list:pagesexist [Boolean]
       * Case 1:
       *   You load the application, with pages: trigger dat event
       * Case 2:
       *   You load the application, without pages:  trigger dat event arg = false
       * Case 3:
       *   You create a new page, trigger dat event only if it's the first page
       * Case 4:
       *   You delete a page, the last one, trigger dat event with arg = false
       *
       * @param  {Array} pages Collection of pages
       * @return {Ctrl}
       */
      service.exist = function exist(pages) {

        if (!service.loadedPagesEventTriggered && pages.length) {
          $rootScope.$emit('page-list:pagesexist', true);
          console.debug('[pageModel@exist] Trigger page-list:pagesexist', true);
          service.loadedPagesEventTriggered = true;
          return service.loadedPagesEventTriggered;
        }

        if (!pages.length) {
          console.debug('[pageModel@exist] Trigger page-list:pagesexist', false);
          $rootScope.$emit('page-list:pagesexist', false);
          service.loadedPagesEventTriggered = false;
        }

        return service.loadedPagesEventTriggered;
      };

      service.loadedPagesEventTriggered = false;

      /**
       * Load each pages for an application
       * @param  {Integer} appId
       * @param {Boolean} isLoad For each first request (new controller)
       * @return {$q.Promise}
       */
      service.load = function load(appId, isLoad) {

        // Trigger for each new first request
        if (isLoad) {
          service.loadedPagesEventTriggered = false;
        }

        var deferred = $q.defer();
        store
          .load(applicationPageAPI, {
            d: ['pageId'],
            f: 'applicationId=' + appId
          })
          .then(function(pages) {
            console.debug('[pageModel@load] Fetch some pages from API', pages);
            service.exist(pages);
            deferred.resolve(pages);
          });
        return deferred.promise;
      };

      /**
       * Remove a page
       * @param  {Object} page Page to remoce
       * @return {$q.Promise}
       */

      service.remove = function remove(page) {
        var deferred = $q.defer();

        applicationPageAPI
          .delete(page)
          .$promise.then(function(data) {
            deferred.resolve(data);
            $rootScope.$emit('page-list:update');
          }, handleErrors);

        return deferred.promise;
      };

      function handleErrors(response) {
        if (response.status === 403) {
          $rootScope.errorMessage = i18nService.getKey('applications.error.access.denied');
        } else if (response.status === 404) {
          $rootScope.errorMessage = i18nService.getKey('application.page.error.page.not.exist');
        } else if (response.status === 500) {
          $rootScope.errorMessage = i18nService.getKey('applications.error.internal.Server');
        } else {
          $rootScope.errorMessage = i18nService.getKey('applications.error.unknown');
        }
      }

      /**
       * Set a page as the home page
       * @param {Object} page Page configuration
       * @param {Object} app  Current application model from $scope
       */
      service.setHome = function setHome(page, app) {

        var deferred = $q.defer();

        var dataToUpdate = {
          homePageId: page.id,
          profileId: app.profileId.id,
          layoutId: app.layoutId.id,
          themeId: app.themeId.id,
          createdBy: app.createdBy.id,
          updatedBy: app.updatedBy.id
        };

        applicationAPI
          .update({
            id: app.id
          },
          angular.extend({}, app, dataToUpdate)
        )
          .$promise.then(function() {
            console.debug('[pageModel@setHome] Set the page:' + page.pageId.displayName + ' as the Home Page');
            deferred.resolve(page);
          }, handleErrors);

        return deferred.promise;
      };

      return service;

    }])
    .directive('pageList', function() {
        return {
          restrict: 'E',
          templateUrl: 'features/admin/applications/details/page-list.html',
          controller: 'pageListCtrl',
          controllerAs: 'list',
          scope: {
            application: '='
          }
        };
      });
})();
