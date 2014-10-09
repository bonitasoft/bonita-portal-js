(function () {
  'use strict';

  angular.module('org.bonita.common.filters.urlify', []).filter('urlify', function() {
    return function(input) {
      if (!input) {
        return input;
      }
      return input.replace(' ', '-').replace(/[^a-zA-Z0-9-_\\.~]/g, '');
    };
  });
})();
