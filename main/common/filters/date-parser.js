/**
 * Copyright (C) 2015 Bonitasoft S.A.
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
