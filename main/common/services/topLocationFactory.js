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
