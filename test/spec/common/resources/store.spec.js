(function () {
  'use strict';

  describe('store', function () {

    beforeEach(module('org.bonita.common.resources.store'));

    var $httpBackend, userAPI, store, DATASET = [
      { id: 1 },
      { id: 2 },
      { id: 3 }
    ];

    beforeEach(inject(function (_$httpBackend_, _userAPI_, _store_) {
      $httpBackend = _$httpBackend_;
      userAPI = _userAPI_;
      store = _store_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should get all data from backend on load', inject(function () {
      var data = [];
      $httpBackend.expectGET('../API/identity/user?c=0&p=0').respond(function () {
        return [200, [], {'Content-Range': '0-10/3'}];
      });
      $httpBackend.expectGET('../API/identity/user?c=3&p=0').respond(function () {
        return [200, DATASET];
      });

      store.load(userAPI).then(function(loaded) {
        data = loaded;
      });
      $httpBackend.flush();

      expect(JSON.stringify(data)).toBe(JSON.stringify(DATASET));
    }));

    it('should not make a second call if the first one return 0 result', inject(function () {
      var data = [];
      $httpBackend.expectGET('../API/identity/user?c=0&p=0').respond(function () {
        return [200, [], {'Content-Range': '0-10/0'}];
      });

      store.load(userAPI).then(function(loaded) {
        data = loaded;
      });
      $httpBackend.flush();

      expect(JSON.stringify(data)).toBe(JSON.stringify([]));
    }));
  });
})();
