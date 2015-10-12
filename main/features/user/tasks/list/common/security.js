(function(){
  'use strict';

  /**
   * Simple security module, which monitor 401 error responses
   * and set an error flag on $rootscope accordingly
   */
  angular
    .module('common.security',[])
    .factory('securityInterceptor', [
      '$injector',
      '$location',
      '$log',
      '$q',
      '$rootScope',
      function($injector, $location, $log, $q, $rootScope) {
        return {
          responseError: function(rejection) {
            // do something on error
            if (rejection.status === 401) {
              $rootScope.error = rejection;
              $log.warn('securityInterceptor reject and close session', rejection);
            }
            return $q.reject(rejection);
          }
        };
    }])
    .config(['$httpProvider', function( $httpProvider) {
      $httpProvider.interceptors.push('securityInterceptor');
    }]);
})();
