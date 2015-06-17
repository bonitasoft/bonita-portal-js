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

  angular.module('org.bonitasoft.common.i18n.filters',['gettext'])

    .filter('dateI18n', ['$window', 'gettextCatalog', function ($window, gettextCatalog) {
      return function translateDate(input, output) {

        if(!input) {
          return '';
        }

        if(!output) {
          throw new Error('[com.bonitasoft.common.i18n.filters@dateI18nFilter] You cannot use the date filter without a format');
        }

        if(!$window.moment) {
          throw new Error('[com.bonitasoft.common.i18n.filters@dateI18nFilter] We need moment.js to translate our dates');
        }

        $window.moment.locale(gettextCatalog.currentLanguage || gettextCatalog.baseLanguage);

        return $window.moment(+input).format(output);
      };

    }])
    .filter('dateAgo', ['$window', 'gettextCatalog', function ($window, gettextCatalog) {
      return function dateAgo(input) {

        if(!$window.moment) {
          throw new Error('[com.bonitasoft.common.i18n.filters@dateAgoFilter] We need moment.js to translate our dates');
        }

        $window.moment.locale(gettextCatalog.currentLanguage || gettextCatalog.baseLanguage);

        var compar = new Date(+input || Date.now());
        return $window.moment(compar).fromNow();
      };
    }]);


})();
