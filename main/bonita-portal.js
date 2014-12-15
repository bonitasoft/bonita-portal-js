/* jshint sub:true*/
(function () {
  'use strict';

  angular.module('org.bonita.portal', [
    'ngCookies',
    'gettext',
    'ui.router',
    'org.bonita.services.i18n',
    'org.bonita.common.resources',
    'org.bonita.features.admin'
  ])//parent state to use for every state in order to have the translations loaded correctly...
    .config([ '$stateProvider', function ($stateProvider) {
      $stateProvider.state('bonita', {
          template : '<ui-view/>',
          resolve : {
            translations : 'i18nService',
            csrfToken : function($http){
              return $http({method: 'GET', url: '../API/system/session/unusedId'})
                .success(function(data, status, headers) {
                    $http.defaults.headers.common['X-Bonita-API-Token'] = headers('X-Bonita-API-Token');
                });
            }
      }
    });
  }])
    .run(['$rootScope', function($rootScope){
      $rootScope.$on('$stateChangeStart',function(event, toState, toParams){
        console.log('$stateChangeStart to '+toState.to+'- fired when the transition begins. toState,toParams : \n',toState, toParams);
      });
      $rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams){
        console.log('$stateChangeError - fired when an error occurs during transition.');
        console.log(arguments);
      });
      $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
        console.log('$stateChangeSuccess to '+toState.name+'- fired once the state transition is complete.');
      });
      // $rootScope.$on('$viewContentLoading',function(event, viewConfig){
      //   // runs on individual scopes, so putting it in "run" doesn't work.
      //   console.log('$viewContentLoading - view begins loading - dom not rendered',viewConfig);
      // });
      $rootScope.$on('$viewContentLoaded',function(event){
        console.log('$viewContentLoaded - fired after dom rendered',event);
      });
      $rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
        console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
        console.log(unfoundState, fromState, fromParams);
      });
    }]);
})();
