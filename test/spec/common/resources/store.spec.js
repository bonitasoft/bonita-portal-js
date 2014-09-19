(function () {
  'use strict';

  describe('store', function () {

    beforeEach(module('org.bonita.common.resources.store'));

    var $httpBackend, userAPI, store, DATASET = [
      { id: 1 },
      { id: 2 },
      { id: 3 }
    ];

    beforeEach(inject(function ($q, $rootScope, _$httpBackend_, _userAPI_, _store_) {
      $httpBackend = _$httpBackend_;
      userAPI = _userAPI_;
      store = _store_;
    }));

    it('should get all data from backend on load', inject(function () {
      $httpBackend.expectGET('../API/identity/user?c=0&p=0').respond(function () {
        return [200, [], {'Content-Range': '0-10/3'}];
      });
      $httpBackend.expectGET('../API/identity/user?c=3&p=0').respond(function () {
        return [200, DATASET];
      });

      var data = store.load(userAPI);
      $httpBackend.flush();

      expect(JSON.stringify(data)).toBe(JSON.stringify(DATASET));
    }));

    it('should have a boolean noData set to true when there is no data', inject(function () {
      $httpBackend.expectGET('../API/identity/user?c=0&p=0').respond(function () {
        return [200, [], {'Content-Range': '0-10/0'}];
      });

      store.load(userAPI);
      $httpBackend.flush();

      expect(store.noData).toBe(true);
    }));

    it('should have a boolean noData set to false when there is data', inject(function () {
      $httpBackend.expectGET('../API/identity/user?c=0&p=0').respond(function () {
        return [200, [], {'Content-Range': '0-10/1'}];
      });
      $httpBackend.expectGET('../API/identity/user?c=1&p=0').respond(function () {
        return {};
      });

      store.load(userAPI);
      $httpBackend.flush();

      expect(store.noData).toBe(false);
    }));
  });
})();
