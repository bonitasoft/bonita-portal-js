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

(function () {
  'use strict';

  function grab(regexp) {
    return {
      from: function (context) {
        context = context || '';
        var matches = context.match(regexp);
        return matches && matches[1] || undefined;
      }
    };
  }

  angular.module('org.bonitasoft.services.navigation', [])

    .factory('topLocation', function topLocationFactory($window) {
      return Object.create({}, {
        _pf: {
          get: function () {
            return grab(/_pf=([1-9]*)/).from($window.top.location.hash);
          }
        },
        tenant: {
          get: function () {
            return grab(/tenant=([1-9]*)/).from($window.top.location.search);
          }
        }
      });
    });
})();
