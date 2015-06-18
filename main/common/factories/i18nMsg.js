/** Copyright (C) 2015 Bonitasoft S.A.
 * BonitaSoft, 31 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

(function() {
  'use strict';

  angular.module('org.bonitasoft.common.i18n.factories',['gettext', 'org.bonitasoft.services.i18n'])

    /**
     * This factory is to append the translations in each Object message for a form, a title attr etc.
     * @param  {[type]} gettext [description]
     * @return {[type]}         [description]
     */
    .factory('i18nMsg', ['i18nService', 'gettext', 'gettextCatalog', function (i18nService, gettext, gettextCatalog) {

      var translations = {};


      // About gettex
      /*
      * Does nothing, simply returns the input string.
      *
      * This function serves as a marker for `grunt-angular-gettext` to know that
      * this string should be extracted for translations.
      */
     // Yolo

      translations.field = {
        mandatory: gettextCatalog.getString(gettext('This field is mandatory')),
        duplicateUrl: gettextCatalog.getString(gettext('This URL is already in use')),
        duplicateName: gettextCatalog.getString(gettext('This name is already in use')),
        reservedToken: i18nService.getKey('application.edit.reservedTokenError')
      };

      return translations;

    }]);


})();
