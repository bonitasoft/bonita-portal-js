(function () {
  'use strict';

  angular.module('org.bonita.portal', [
    'ngCookies',
    'gettext',
    'ui.router',
    'org.bonita.common.resources',
    'org.bonita.features.admin'
  ])
    .service('i18nService', ['gettextCatalog', '$cookies', 'i18nAPI', function (gettextCatalog, $cookies, i18nAPI) {


      function arrayToObject(array) {
        var object = {};
        for (var i = 0; i < array.length; i++) {
          object[array[i].key] = array[i].value;
        }
        return object;
      }

      function updateCatalog(catalog) {
        gettextCatalog.currentLanguage = $cookies['BOS_Locale'];
        gettextCatalog.baseLanguage = null;
        gettextCatalog.setStrings($cookies['BOS_Locale'], arrayToObject(catalog));
      }

      gettextCatalog.debug = true;
      return (function loadTranslations() {
        return i18nAPI.query({
          f: 'locale=' + ($cookies['BOS_Locale'] || 'en')
        }).$promise.then(updateCatalog);
      })();
    }])
    //parent state to use for every state in order to have the translations loaded correctly...
    .config([ '$stateProvider', function ($stateProvider) {
      $stateProvider.state('bonita', {
          template : '<ui-view/>',
          resolve : {
            translations : 'i18nService'
          }
        });
    }]);
})();

