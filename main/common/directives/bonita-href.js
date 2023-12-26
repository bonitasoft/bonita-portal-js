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

  /**
   * Attach a custom click event to a button, it provides routing for iframe too.
   */
  angular.module('org.bonitasoft.common.directives.bonitaHref', ['org.bonitasoft.services.topurl'])
  .directive('bonitaHref',
    function(manageTopUrl) {
      return {
        restrict: 'A',
        link: function(scope, element, attr) {
          //we do not override ngClick value in case
          element.bind('click', function() {
            manageTopUrl.goTo(scope.$eval(attr.bonitaHref) || attr.bonitaHref);
          });
        }
      };
    }
  );
})();
