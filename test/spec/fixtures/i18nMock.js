(function() {
  'use strict';
  /**
  * this allows to bypass i18n call to translation
  */
  angular.module('org.bonitasoft.common.resources').factory('i18nAPI', function(){
    return {
      query: function() {
        return {
          $promise: {
            then: function(fn) {
              return fn({});
            }
          }
        };
      }
    };
  });
})();
