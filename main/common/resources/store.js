(function () {
  'use strict';

  function Store($q) {
    this.data = [];
    this.$q = $q;
  }

  Store.prototype.load = function (resource, options) {
    var store = this;
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
        f: options.f
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
        c: 0
      }).$promise;
    }

    count().then(loadData);
    return deferred.promise;
  };

  angular.module('org.bonita.common.resources.store', ['org.bonita.common.resources'])
    .service('store', ['$q', Store]);
})();


