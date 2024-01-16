(function () {
  'use strict';

  /**
   * preference service
   * Allow preferences to be persisted in a browser cookie.
   * preference a initialized with config value if not found
   * preference are load from cookie once, at startup
   * list of persisted preference
   *  - {String}  lastTab     the currentTab (context / form) being viewed
   *  - {boolean} showDetails the current layout ( list+context or full list)
   *  - {Array}   min           Array of boolean representing columns visibility
   *                          for mobile layout
   *  - {Array}   mid         Array of boolean representing columns visibility
   *                            for list+context layout
   *  - {Array}   max         Array of boolean representing columns visibility
   *                            for list only layout
   */
  angular
    .module('org.bonitasoft.features.user.tasks.app.pref', [ 'ngStorage', 'org.bonitasoft.features.user.tasks.app.config' ])
    .service('preference', ['$localStorage', 'DEFAULT_DETAILS', 'COLUMNS_SETTINGS',

      function ($localStorage, DEFAULT_DETAILS, COLUMNS_SETTINGS) {
        var STORAGEKEY = 'bonita-user-task-list';

        var dict = angular.extend({
          'showDetails': DEFAULT_DETAILS,
          'showFilters': true,
          'lastTab': ''
        }, COLUMNS_SETTINGS);

        $localStorage[STORAGEKEY] = angular.merge(dict, $localStorage[STORAGEKEY] || {});

        /**
         * @internal Check is key is allowed
         * @param  {String} key
         * @throws {Error} If key is not allowed
         */
        function check(key) {
          if (!dict.hasOwnProperty(key)) {
            throw new Error('preference key not found');
          }
        }

        /**
         * Return mode depending on items shown in view and screen size
         * @param  {Boolean} showDetails   are task details shown
         * @param  {Boolean} isSmallScreen is screen width
         * @return {String}                min|prop|all
         */
        this.getMode = function (showDetails, isSmallScreen) {
          if (isSmallScreen) {
            return 'min';
          } else if (showDetails) {
            return 'mid';
          } else {
            return 'max';
          }
        };

        /**
         * Get preference corresponding to key
         * @param  {String} key
         * @return {Object}     corresponding preference
         */
        this.get = function (key) {
          check.call(this, key);
          return $localStorage[STORAGEKEY][key];
        };

        /**
         * Set a preference
         * @param {String}  key     preference name
         * @param {Object}  value   preference value
         */
        this.set = function (key, value) {
          check.call(this, key);
          $localStorage[STORAGEKEY][key] = value;
        };
      }]);


})();
