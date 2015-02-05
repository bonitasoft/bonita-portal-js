(function() {
  'use strict';

  angular.module('com.bonita.common.utils.filters',[])
    .filter('ucfirst', function() {
      return function ucFirst(input) {
        input = input || '';
        return input.charAt().toUpperCase() + input.slice(1);
      };
    });

})();
