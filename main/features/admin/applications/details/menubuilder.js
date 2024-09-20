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

angular.module('org.bonitasoft.features.admin.applications.details').controller('actionBarCtrl', ['$scope', '$modal', 'menuFactory',
  function($scope, $modal, menuFactory) {
    'use strict';

    var self = this;

    self.modal = null;

    /**
     * Remove a node from ui.tre
     * The method remove comes from the API
     * @param  {Object} scope Current ui.tree scope
     * @param {Object} menuItem
     * @return {void}
     */
    this.removeItem = function removeItem(scope, menuItem) {
      scope.$parent.$parent.remove();
      console.debug('[actionBarCtrl@removeItem] delete a menuItem ' + menuItem.id, menuItem);
      menuFactory.remove(menuItem.id);
    };

    /**
     * Add a new menuItem to a container
     * You can add a container or a submenu with a page
     * @param  {Object} scope Current ui.tree scope
     * @param {Object} menuItem
     * @return {void}
     */
    this.addItem = function addItem(scope, menuItem) {

      self.modal = $modal.open({
        templateUrl: 'features/admin/applications/details/menubuilder-addCustomMenuModal.html',
        controller: 'addCustomMenuCtrl',
        controllerAs: 'addCustomMenuCtrl',
        size: 'sm',
        resolve: {
          AppID: function() {
            return +menuItem.applicationId;
          },
          customDataModal: function() {
            // the customDataModel need the model in the key data, other are options
            return {
              isAddition: true,
              data: menuItem
            };
          }
        }
      });

      self.modal.result.then(function(data) {

        var record = {
          displayName: data.name,
          applicationId: +menuItem.applicationId,
          applicationPageId: ('id' in data.page) ? +data.page.id : '-1',
          parentMenuId: menuItem.id
        };

        // Record the collection
        menuFactory.create(record).then(function(data) {
          console.debug('[actionBarCtrl@addItem] Add a new child', data.item);

          menuItem.children = menuItem.children || [];
          // Update the current menuitem with a child
          menuItem.children.push(data.item.toJSON());
        });
      }, angular.noop);
    };

    /**
     * Edit a menu or a submenu
     * @param  {Object} scope Current ui.tree scope
     * @param {Object} menuItem
     * @return {void}
     */
    this.editItem = function editItem(scope, menuItem) {

      self.modal = $modal.open({
        templateUrl: 'features/admin/applications/details/menubuilder-addCustomMenuModal.html',
        controller: 'addCustomMenuCtrl',
        controllerAs: 'addCustomMenuCtrl',
        size: 'sm',
        resolve: {
          AppID: function() {
            return +menuItem.applicationId;
          },
          customDataModal: function() {
            return {
              isEditionParentMenu: menuItem.parentMenuId === '-1',
              isEdition: true,
              data: menuItem
            };
          }
        }
      });

      self.modal.result.then(function(data) {
        menuItem.displayName = data.name;
        menuItem.applicationPageId = ('id' in data.page) ? +data.page.id : '-1';
        menuFactory.update(angular.copy(menuItem));
      }, angular.noop);
    };
  }
]);

angular.module('org.bonitasoft.features.admin.applications.details').controller('addCustomMenuCtrl', ['$scope', '$modalInstance', 'store', 'menuUtils', 'applicationPageAPI', 'AppID', 'customDataModal', 'i18nMsg',
  function($scope, $modalInstance, store, menuUtils, applicationPageAPI, AppID, customDataModal, i18nMsg) {

    'use strict';

    $scope.isLabelOnly = 'inactive';
    $scope.i18n = i18nMsg.field;

    // Load pages to the modal
    store.load(applicationPageAPI, {
      d: ['pageId'],
      f: 'applicationId=' + AppID
    }).then(function(pages) {
      $scope.pages = pages;
    });

    /**
     * You can pass some data to the modal throught resolve
     * {
     *   otherdataa
     *   data: will contain your data
     * }
     */
    if (customDataModal) {
      $scope.isAddition = !!customDataModal.isAddition;
      $scope.isEdition = !!customDataModal.isEdition;
      $scope.isEditionParentMenu = customDataModal.isEditionParentMenu;

      // If we are in edition mode we need to bind the values to the modal
      if (customDataModal.data && customDataModal.data.displayName) {

        $scope.menu = {
          model: {
            name: (!$scope.isEdition) ? '' : customDataModal.data.displayName,
            page: (!$scope.isEdition) ? '' : {
              id: customDataModal.data.applicationPageId
            }
          },
          parent: (!$scope.isEdition) ? customDataModal.data : null
        };

        if (!$scope.isEdition) {
          $scope.currentSelectedPageId = 0;
        } else {

          if (customDataModal.data.applicationPageId !== '-1' && customDataModal.data.applicationPageId) {
            $scope.currentSelectedPageId = customDataModal.data.applicationPageId;
          } else {
            $scope.currentSelectedPageId = 0;
          }
        }
        if (customDataModal.isEditionParentMenu && (customDataModal.data.applicationPageId === '-1' || !customDataModal.data.applicationPageId)) {
          $scope.isLabelOnly = 'active';
        }
      }
    }

    this.cancel = function cancel() {
      $modalInstance.dismiss('cancel');
    };

    /**
     * Save the content of the modal
     * Trigger the modalInstance Close()
     * @param  {Object} config Model
     * @return {void}
     */
    this.saveModal = function saveModal(config) {

      var pageId = (config.model.page) ? (config.model.page.id || config.model.page) : 0;

      $modalInstance.close({
        name: config.model.name,
        page: menuUtils.findItemPerId(pageId, $scope.pages),
        raw: config.model
      });
    };
  }
]);

angular.module('org.bonitasoft.features.admin.applications.details').controller('menuCreatorCtrl', ['$rootScope', '$scope', '$modal', 'menuFactory',
  function($rootScope, $scope, $modal, menuFactory) {

    'use strict';

    var self = this;
    this.modal = null;

    $scope.isLabelOnly = true;
    $scope.data = {
      currentMenu: null,
      menuItem: [],
      menuItemBuilder: []
    };

    function loadMenu() {
      menuFactory.get(+$scope.application.id).then(
        function successCb(data) {
          console.debug('[menuCreatorCtrl@successCb] load data from the API', data);
          $scope.data.menuItemBuilder = data;
        }, function errorCb(data) {
          console.error('[menuCreatorCtrl@errorCb] ' + data.message);
        }
      );
    }

    /**
     * Load data from the menu API
     */
    this.loadMenu = loadMenu;

    // It's not funny, but we cannot spy with Jasmine without this useless closure :/
    $rootScope.$on('page-list:update', function() {
      self.loadMenu();
    });
    loadMenu();

    $rootScope.$on('page-list:pagesexist', function(e, exist) {
      $scope.hasPages = exist;
    });


    /**
     * Open the modal
     * Binds the application id to the modal in order to get the pages already associated.
     * Then auto record onSave the new menu item
     */
    this.add = function add() {

      self.modal = $modal.open({
        templateUrl: 'features/admin/applications/details/menubuilder-addCustomMenuModal.html',
        controller: 'addCustomMenuCtrl',
        controllerAs: 'addCustomMenuCtrl',
        size: 'sm',
        resolve: {
          AppID: function() {
            return +$scope.application.id;
          },
          customDataModal: function() {
            return {
              isEditionParentMenu: true
            };
          }
        }
      });

      self.modal.result.then(function(data) {

        var record = {
          displayName: data.name,
          applicationId: +$scope.application.id,
          applicationPageId: ('id' in data.page) ? +data.page.id : '-1',
        };

        // For parents only, a parent does not have any pages
        if (!('id' in data.page)) {
          record.children = [];
        }

        menuFactory.create(record).then(function(data) {
          $scope.data.menuItemBuilder.push(data.formatted);
        });
      }, angular.noop);

    };
  }
]);

angular.module('org.bonitasoft.features.admin.applications.details').controller('menuListCtrl', ['$scope', 'menuFactory', 'menuConvertor', 'menuUtils',
  function($scope, menuFactory, menuConvertor, menuUtils) {

    'use strict';

    $scope.treeOptions = {

      /**
       * Filter the drag and drop element, we allow any element to be drag&drop but, if it's a container we do not allow it to be set as a child of another container.
       * @param  {Object} sourceNode Scope for the current item
       * @param  {Object} destNodes  Scope for the list
       * @return {Boolean}            [description]
       */
      accept: function(sourceNode, destNodes) {
        var el = destNodes.$element;

        if ('-1' === sourceNode.$modelValue.applicationPageId) {
          // Prevent a container to be add as a child
          if (el.hasClass('menucontainer-submenu') || el.hasClass('menucontainer-submenu-exist')) {
            return false;
          }
        }
        return true;
      },

      /**
       * This callback appends when we're done the drag&drop actions
       *
       * Find the current item edited then record it and update the current model.
       *
       * @param  {Event} e
       * @return {void}
       */

      dragStop: function dragStop(e) {
        /**
         * if we drop from a submenu, the key subMenu exist
         * if we drop from a submenu to a menu the key exist too
         * if we drop a menu from a submenu the key does not exist
         */
        var menuItem = e.source.nodeScope.subItem || e.source.nodeScope.menu;
        var menuOrdered = menuConvertor.buildIndex(angular.copy($scope.model));

        menuFactory.update(menuUtils.findItemPerId(menuItem.id, menuOrdered)).catch(console.error);
      }
    };
  }
]);

angular.module('org.bonitasoft.features.admin.applications.details').directive('actionBar', function() {

  'use strict';

  return {
    restrict: 'AE',
    transclude: true,
    scope: {
      edit: '@',
      remove: '@',
      add: '@',
      collapsed: '=',
      menu: '=',
      data: '=',
      isAppEditable: '='
    },
    templateUrl: 'features/admin/applications/details/menubuilder-actionBar.html',
    controller: 'actionBarCtrl',
    controllerAs: 'actionBarCtrl'
  };

});

angular.module('org.bonitasoft.features.admin.applications.details').directive('menuCreator', function() {

  'use strict';

  return {
    restrict: 'AE',
    scope: {
      application: '=app'
    },
    templateUrl: 'features/admin/applications/details/menubuilder-menuCreator.html',
    controller: 'menuCreatorCtrl',
    controllerAs: 'menuCreatorCtrl'
  };

});

angular.module('org.bonitasoft.features.admin.applications.details').directive('menuList', function() {

  'use strict';

  return {
    restrict: 'AE',
    scope: {
      model: '=ngModel',
      isAppEditable: '='
    },
    templateUrl: 'features/admin/applications/details/menubuilder-menuList.html',
    controller: 'menuListCtrl'
  };
});

angular.module('org.bonitasoft.features.admin.applications.details').factory('menuConvertor', ['menuUtils',
  function(menuUtils) {

    'use strict';

    /**
     * Convert the ouput from the API to the format used in the directive
     * The API defines a child with the key parentMenuId.
     * The directive uses an object with a key children (array)
     * @param  {Array} data Collection from the Api
     * @return {Array}
     */

    function convertFromApi(data) {

      var family = [],
        parent;

      data.forEach(function loopDetectChild(item) {

        // Only pages without a page id can have children
        if (!item.applicationPageId || item.applicationPageId === '-1') {
          item.children = item.children || [];
        }

        if (+item.parentMenuId !== -1) {
          parent = menuUtils.findItemPerId(item.parentMenuId, data);
          // It means we have find a parent
          if (parent.id) {
            parent.children = parent.children || [];
            parent.children.push(item);
            item = null;
          }
        }

        if (item) {
          family.push(item);
        }
      });

      return family;
    }

    /**
     * Build a valid array of menu items for the API from the one we use in the scope
     * @param  {Array} data
     * @return {Array} menuConfig Config for the API
     */

    function convertForApi(data) {

      var itemMenu;
      var menuConfig = [];
      var i = 0;

      data.forEach(function(item) {

        // Set an index for the first level
        item.menuIndex = ++i;

        // Create a copy
        itemMenu = angular.copy(item);

        // Reset the old parentMenuId
        if (!itemMenu.children || !itemMenu.children.length) {
          itemMenu.parentMenuId = '-1';
        }

        // Remove our key children as we do not need it
        delete itemMenu.children;

        menuConfig.push(itemMenu);
        menuConfig = menuUtils.bindChildren(item, menuConfig);
      });

      return menuConfig;
    }

    /**
     * Convert a menuItem to a menuItem for the API
     * @param  {Object} menuItem
     * @param  {Integer} i        Index (not required, default is menuItem.menuIndex ||  1)
     * @return {Object}
     */

    function toApi(menuItem, i) {

      menuItem.menuIndex = menuItem.menuIndex || i || 1;

      menuItem.parentMenuId = menuItem.parentMenuId || '-1';

      // Reset the old parentMenuId
      if (!menuItem.children && (menuItem.parentMenuId === '-1' || menuItem.parentMenuId <= 0)) {
        menuItem.parentMenuId = '-1';
      }

      if (menuItem.children) {
        menuItem.parentMenuId = '-1';
        delete menuItem.children;
      }

      return menuItem;
    }

    return {
      toApi: toApi,
      fromApi: convertFromApi,
      buildIndex: convertForApi,
    };

  }
]);

angular.module('org.bonitasoft.features.admin.applications.details').factory('menuUtils', function() {

  'use strict';

  /**
   * Attach each child to its parent
   * @param  {Object} ref  The parent menu item
   * @return {void}
   */

  function bindChildren(ref, menuConfig) {
    ref.children = ref.children || [];

    ref.children.forEach(function(item, i) {

      item.parentMenuId = ref.id;

      // set an index as parentMenuIndex - IndexChild
      item.menuIndex = (i + 1);
      delete item.children;
    });

    return menuConfig.concat(ref.children);
  }

  /**
   * Find an element in a collection from its id
   * @param  {String} id         Can also be an integer, but here it's a pad number such as 0001
   * @param  {Array} collection
   * @return {Object}
   */

  function findItemPerId(id, collection) {
    return collection.filter(function(item) {
      return +item.id === +id;
    })[0] || {};
  }

  return {
    bindChildren: bindChildren,
    findItemPerId: findItemPerId
  };

});

angular.module('org.bonitasoft.features.admin.applications.details').service('menuFactory', ['$rootScope', '$q', 'menuConvertor', 'applicationMenuAPI', 'menuUtils', 'store', 'i18nService',
  function($rootScope, $q, menuConvertor, applicationMenuAPI, menuUtils, store, i18nService) {

    'use strict';

    var service = {};
    $rootScope.messageError = undefined;

    /**
     * Event to detect when the application is updated
     * @return {void}
     */

    function triggerEventUpdate() {
      // console.debug('[menuFactory@triggerEventUpdate] Trigger event, menubuilder:update');
      // $rootScope.$emit('menubuilder:update');
    }

    /**
     * Load the Menu from the API
     * It adds the key children for each one and fill it with data if it has some children
     * @return {$q.Promise}
     */
    service.get = function get(appId) {

      var deferred = $q.defer();

      store.load(applicationMenuAPI, {
        f: 'applicationId=' + appId,
        o: 'menuIndex ASC'
      }).then(function successCb(menus) {
        deferred.resolve(menuConvertor.fromApi(menus));
      }, function errorCb() {
        deferred.reject(new Error('Cannot find any data for the menu'));
      });

      return deferred.promise;
    };

    /**
     * Update an existing menuItem, then fetch all data from API
     * @param  {Object} menuItem
     * @return {$q.Promise}
     */
    service.update = function update(menuItem) {

      menuItem = menuConvertor.toApi(menuItem);

      var deferred = $q.defer();

      applicationMenuAPI.update({
        id: menuItem.id
      }, menuItem).$promise.then(
        function successCb(data) {
          triggerEventUpdate();
          console.debug('[menuFactory@update] Update success', data);
          service.get(menuItem.applicationId).then(function() {
            $rootScope.messageError = undefined;
          });
        }, function(data) { return handleErrors(deferred, data); });

      deferred.promise.catch(angular.noop);

      return deferred.promise;
    };

    /**
     * Create a new menuItem, , then fetch all data from API
     * @param  {Object} menuItem
     * @return {$q.Promise}
     */
    service.create = function create(menuItem) {

      menuItem = menuConvertor.toApi(menuItem);

      var deferred = $q.defer();

      applicationMenuAPI.save(menuItem).$promise.then(
        function successCb(record) {
          triggerEventUpdate();
          console.debug('[menuFactory@create] record success', record);
          service.get(menuItem.applicationId).then(function(data) {
            $rootScope.messageError = undefined;
            var apiRep = record.toJSON();
            if ('-1' === apiRep.parentMenuId && !apiRep.applicationPageId) {
              apiRep.children = [];
            }

            deferred.resolve({
              formatted: apiRep,
              item: record,
              col: data
            });
          });
        }, function (data) { return handleErrors(deferred, data); });

      return deferred.promise;
    };

    /**
     * Remove a menuItem per its id
     * @param  {Integer} id
     * @return {$q.Promise}
     */
    service.remove = function remove(id) {
      var deferred = $q.defer();

      applicationMenuAPI.remove({
        id: id
      }).$promise.then(function () {
        triggerEventUpdate();
        $rootScope.messageError = undefined;
      }, function(data) { return handleErrors(deferred, data); });

      deferred.promise.catch(angular.noop);

      return deferred.promise;
    };

    function handleErrors(promise, response) {
      if(response.status === 403) {
        $rootScope.messageError = i18nService.getKey('applications.error.access.denied');
      } else if(response.status === 404) {
        $rootScope.messageError = i18nService.getKey('application.menu.error.page.not.exist');
      } else if(response.status === 500) {
        $rootScope.messageError = i18nService.getKey('applications.error.internal.Server');
      } else {
        $rootScope.messageError = i18nService.getKey('application.edit.error.unknown');
      }
      return promise.reject(response);
    }

    return service;
  }
]);
