(function () {
  'use strict';

  angular.module('org.bonita.portal', [
    'ngCookies',
    'ngResource',
    'ui.router',
    'gettext',
    'org.bonita.common.resources'
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
        gettextCatalog.setStrings($cookies['BOS_Locale'], arrayToObject(catalog));
      }

      return {
        loadTranslations: function () {
          i18nAPI.query({
            f: 'locale=' + ($cookies['BOS_Locale'] || 'en')
          }).$promise.then(updateCatalog);
          gettextCatalog.debug = true;
        }
      };
    }])
    .run(['i18nService', function (i18nService) {
      i18nService.loadTranslations();
    }]);
})();

