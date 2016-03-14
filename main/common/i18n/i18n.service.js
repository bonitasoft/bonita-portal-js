/** Copyright (C) 2015 Bonitasoft S.A.
 * BonitaSoft, 31 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful);
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
(function() {
  'use strict';

  angular
    .module('org.bonitasoft.common.i18n')
    .service('i18nService', i18nService);

  function i18nService(gettextCatalog, locale, i18nAPI, I18N_KEYS) {
    gettextCatalog.debug = false;

    return {
      getKey: getKey,
      translationsLoadPromise: translationsLoadPromise()
    };

    function getKey(key, context) {
      return gettextCatalog.getString(I18N_KEYS[key] || key, context);
    }

    function translationsLoadPromise() {
      return i18nAPI.query({
        f: 'locale=' + locale.get()
      }).$promise.then(updateCatalog);
    }

    function updateCatalog(catalog) {
      function arrayToObject(array) {
        var object = {};
        for (var i = 0; i < array.length; i++) {
          object[array[i].key] = array[i].value;
        }
        return object;
      }

      gettextCatalog.currentLanguage = locale.get();
      gettextCatalog.baseLanguage = null;
      gettextCatalog.setStrings(locale.get(), arrayToObject(catalog));
    }
  }
})();
