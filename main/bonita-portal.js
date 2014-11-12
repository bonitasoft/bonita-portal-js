(function () {
  'use strict';

  angular.module('org.bonita.portal', [
    'ngCookies',
    'ngResource',
    'ui.router',
    'org.bonita.services.i18n',
    'gettext',
    'org.bonita.common.resources'
  ])
  .config([ '$stateProvider', function ($stateProvider) {
    $stateProvider.state('bonita', {
      template : '<ui-view/>',
      resolve : {
        translations : 'i18nService'
      }
    });
  }]);
})();
