/** Copyright (C) 2015 Bonitasoft S.A.
 * Bonitasoft, 32 rue Gustave Eiffel - 38000 Grenoble
 * This library is free software; you can redistribute it and/or modify it under the terms
 * of the GNU Lesser General Public License as published by the Free Software Foundation
 * version 2.1 of the License.
 * This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public License along with this
 * program; if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth
 * Floor, Boston, MA 02110-1301, USA.
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
