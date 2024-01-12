(function() {

  'use strict';

  angular
    .module('common.filters', [])
    .filter('encodeURI', function() {
      return window.encodeURI;
    });

})();
