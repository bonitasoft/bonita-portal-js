(function() {
  'use strict';


  angular.module('org.bonitasoft.features.admin.applications.details.page-list', [
    'ui.bootstrap',
    'org.bonitasoft.common.directives.bootstrap-form-control',
    'org.bonitasoft.features.admin.applications.edit',
    'org.bonitasoft.common.directives.urlified',
    'org.bonitasoft.common.resources',
    'org.bonitasoft.common.i18n.factories'
  ])
    .controller('addPageCtrl', function ($scope, customPageAPI, applicationPageAPI, applicationMenuAPI, $modalInstance, application, i18nMsg, store) {

        $scope.alerts = [];
        $scope.closeAlert = function(index) {
          $scope.alerts.splice(index, 1);
        };
        $scope.i18n = i18nMsg.field;
        $scope.application = application;

        store.load(customPageAPI)
          .then(function (pages) {
            $scope.customPages = pages;
          });

        $scope.add = function(page) {
          page.model.applicationId = $scope.application.id;
          applicationPageAPI.save(page.model).$promise.then(closeModal, handleErrors);
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
    .factory('pageModel', ['$rootScope', '$q', 'store', 'applicationPageAPI', 'applicationAPI', function($rootScope, $q, store, applicationPageAPI, applicationAPI) {

      var service = {};

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
          });

        return deferred.promise;
      };

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
          }, deferred.reject);

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
