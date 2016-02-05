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

(function(){
  'use strict';
  /**
   * @ngdoc overview
   * @name o.b.f.admin.cases.list.service
   *
   * @description
   * describes the case list service that only includes the dateParser service
   */
  angular.module('org.bonitasoft.common.filters.date.parser', ['gettext'])
  /**
   * @ngdoc object
   * @name o.b.f.admin.cases.list.CaseListCtrl
   * @description
   * it parse date and format it to the case admin format
   *
   * @requires $filter
   * @requires gettextCatalog
   */
    .service('dateParser', ['gettextCatalog', '$filter', function(gettextCatalog, $filter){
    var parseDateService = {};

    var dateFormat = gettextCatalog.getString('MM/dd/yyyy h:mm a');

    parseDateService.parseAndFormat = function(date) {
      return $filter('date')(date.replace(/ /, 'T'), dateFormat);
    };

    return parseDateService;
  }]);
})();
