(function() {
  'use strict';

  angular
    .module('org.bonitasoft.features.user.tasks.app.pref', ['ngCookies', 'org.bonitasoft.features.user.tasks.app.config'])


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
  .service('preference', [
    '$cookies',
    'DEFAULT_DETAILS',
    'COLUMNS_SETTINGS',
    function($cookies, DEFAULT_DETAILS, COLUMNS_SETTINGS) {
      var dict = angular.extend({
        'showDetails': DEFAULT_DETAILS,
        'lastTab': '',
      }, COLUMNS_SETTINGS);

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
      this.getMode = function(showDetails, isSmallScreen) {
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
      this.get = function(key) {
        check.call(this, key);
        return preferences[key];
      };

      /**
       * Set a preference
       * @param {String}  key     preference name
       * @param {Object}  value   preference value
       * @param {Boolean} persist persist preference to cookie
       */
      this.set = function(key, value, persist) {
        check.call(this, key);

        persist = persist || false;
        preferences[key] = value;

        if (persist) {
          $cookies.put(key, JSON.stringify(value));
        }
      };

      /**
       * flush preference stored in the cookie
       */
      this.flush = function() {
        angular.forEach(dict, function(value, key) {
          $cookies.remove(key);
        });
      };

      var preferences = {};

      angular.forEach(dict, function(value, key) {
        preferences[key] = JSON.parse($cookies.get(key) || 'null');

        if (preferences[key] === null) {
          preferences[key] = value;
        }
      });
    }
  ]);
})();