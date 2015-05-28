/* jshint sub:true*/
(function () {
  'use strict';

  angular.module('org.bonitasoft.services.i18n', [
    'ngCookies',
    'gettext',
    'org.bonitasoft.common.resources'
  ]).value('I18N_KEYS', {
    'caselist.delete.single': '1 case has been deleted',
    'caselist.delete.multiple': '{{nbOfDeletedCases}} cases have been deleted',
    'processDetails.informations.category.update.error': 'An error occured during categories update',
    'processDetails.informations.category.update.sucess': 'Successfully updated categories',
    'processDetails.actors.update.success': '{{nbSucess}} actor mapping updates succeeded',
    'processDetails.actors.update.error': '{{nbErrors}} errors on mapping updates',
    'multiSelect.selectAll': 'Select all',
    'multiSelect.selectNone': 'Select none',
    'multiSelect.reset': 'Reset',
    'multiSelect.search.helper': 'Type here to search...',
    'processDetails.actors.users.label': 'Users',
    'processDetails.actors.users.mapping': 'Users mapped to {}',
    'processDetails.actors.users.selectHelper': 'Select users...',
  })
    .service('i18nService', function (gettextCatalog, $cookies, i18nAPI, I18N_KEYS) {
      var i18n = {};
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
        return i18n;
      }

      gettextCatalog.debug = false;

      i18n.getKey = function(key, context){
        return gettextCatalog.getString(I18N_KEYS[key], context);
      };

      return (function loadTranslations() {
        return i18nAPI.query({
          f: 'locale=' + ($cookies['BOS_Locale'] || 'en')
        }).$promise.then(updateCatalog);
      })();
    });
})();
