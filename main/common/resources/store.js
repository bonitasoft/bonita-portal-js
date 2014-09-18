(function () {
  'use strict';

  function Store() {
    this.data = [];
    this.noData = true;
  }

  Store.prototype.load = function (resource) {

    var that = this;
    this.resource = resource;

    function loadData(response) {
      that.noData = response.resource.pagination.total === 0;

      if (response.resource.pagination.total > 0) {
        resource.search({
          p: 0,
          c: response.resource.pagination.total
        }, function (response) {
          angular.copy(response.resource, that.data);
        });
      }
    }

    function count() {
      return resource.search({
        p: 0,
        c: 0
      }).$promise;
    }

    count().then(loadData);
    return this.data;
  };

  angular.module('org.bonita.common.resources.store', ['org.bonita.common.resources'])
    .service('store', [Store]);
})();
