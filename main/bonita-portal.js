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
    .config([ '$stateProvider', '$urlRouterProvider',  function ($stateProvider, $urlRouterProvider) {
      // $urlRouterProvider.rule(function ($injector, $location) {
      //   if($location.search()['_tab']){
      //     var queryString = $location.search();
      //     $location.replace().path($location.path() + '/' + queryString['_tab']);
      //     delete queryString['_tab'];
      //   }
      // });
      $stateProvider.state('bonita', {
          template : '<ui-view/>',
          resolve : {
            translations : 'i18nService'
          }
        });
    }]);
})();

