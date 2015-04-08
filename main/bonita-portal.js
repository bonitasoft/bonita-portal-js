/* jshint sub:true*/
(function() {
  'use strict';

  angular.module('org.bonitasoft.portal', [
    'ngCookies',
    'gettext',
    'ui.router',
    'org.bonitasoft.common.security',
    'org.bonitasoft.services.i18n',
    'org.bonitasoft.common.resources',
    'org.bonitasoft.features.admin'
  ]).provider('bonita', function(){
    var stateResolve = {
        translations : 'i18nService',
        csrfToken : function($http){
          return $http({method: 'GET', url: '../API/system/session/unusedId'})
            .success(function(data, status, headers) {
                $http.defaults.headers.common['X-Bonita-API-Token'] = headers('X-Bonita-API-Token');
            });
        }
      };
    this.stateResolve = stateResolve;
    this.$get = function(){ 
      return stateResolve;
    };
  })
  //parent state to use for every state in order to have the translations loaded correctly...
  .config(function($stateProvider, bonitaProvider) {
    $stateProvider.state('bonita', {
      template: '<ui-view/>',
      resolve: bonitaProvider.stateResolve
    });
  });
})();