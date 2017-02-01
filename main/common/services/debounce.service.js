(function () {
  'use strict';

  function DebounceProvider() {
    this.$get = function ($timeout) {
      var debounceds = {};

      /**
       * Debounce a function execution for a given delay
       *
       * While calling multiple times debounce(fn) when delay is not achieve,
       * previous call to fn will be canceled and replaced by the new one
       *
       * @param fn  function to be debounced
       * @param delay the debounce delay
       */
      function debounce(fn, delay) {
        if (debounceds[fn]) {
          $timeout.cancel(debounceds[fn]);
        }

        debounceds[fn] = $timeout(fn, delay);
      }

      return debounce;
    };
  }

  angular
    .module('org.bonitasoft.service.debounce', [])
    .provider('debounce', DebounceProvider);


})();
