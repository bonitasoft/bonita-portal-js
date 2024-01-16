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

  function Store($q) {
    this.$q = $q;
  }

  Store.prototype.load = function (resource, options) {
    var store = { data: [] };
    var deferred = this.$q.defer();
    this.resource = resource;
    options = options || {};

    function loadData(response) {
      if (response.resource.pagination.total === 0) {
        angular.copy([], store.data);
        deferred.resolve(store.data);
        return;
      }

      store.data = resource.search({
        p: 0,
        c: response.resource.pagination.total,
        d: options.d,
        n: options.n,
        f: options.f,
        o: options.o
      }, function (response) {
        angular.copy(response.data, store.data);
        deferred.resolve(store.data);
      }, function (error) {
        deferred.reject(error);
      });
    }

    function count() {
      return resource.search({
        p: 0,
        c: 0,
        f: options.f
      }).$promise;
    }

    count().then(loadData);
    return deferred.promise;
  };

  angular.module('org.bonitasoft.common.resources.store', ['org.bonitasoft.common.resources'])
    .service('store', ['$q', Store]);
})();


