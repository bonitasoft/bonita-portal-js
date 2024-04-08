(function () {
  'use strict';

  function DebounceProvider() {
    this.$get = function () {

      /**
       * Debounce a function execution for a given delay
       *
       * While calling multiple times debounce(fn) when delay is not achieve,
       * previous call to fn will be canceled and replaced by the new one
       *
       * @param fn  function to be debounced
       * @param delay the debounce delay
       */
      var debounceTimer;

      function debounce(fn, delay) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function() {
          fn.apply(arguments);
        }, delay);
      }

      return debounce;
    };
  }

  angular
    .module('org.bonitasoft.service.debounce', [])
    .provider('debounce', DebounceProvider);

})();
