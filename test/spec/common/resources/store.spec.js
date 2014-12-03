(function () {
  'use strict';

  describe('store', function () {

    beforeEach(module('org.bonita.common.resources.store'));

    var $httpBackend, userAPI, store, rootScope, DATASET = [
      { id: 1 },
      { id: 2 },
      { id: 3 }
    ];

    beforeEach(inject(function (_$httpBackend_, _userAPI_, _store_, _$rootScope_) {
      $httpBackend = _$httpBackend_;
      userAPI = _userAPI_;
      store = _store_;
      rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should get pass options to search API', inject(function ($q) {
      var deferred = $q.defer();
      var userAPIResponse = [];
      userAPIResponse.$promise = deferred.promise;
      spyOn(userAPI, 'search').and.returnValue(userAPIResponse);

      var result;
      store.load(userAPI, {f : ['supervisor_id=14']}).then(function(data){
        result = data;
      });
      //call to count()
      expect(userAPI.search.calls.allArgs()).toEqual([[{
        p: 0,
        c: 0,
        f : ['supervisor_id=14']
      }]]);
      userAPI.search.calls.reset();

      var response = {data : DATASET};
      deferred.resolve({resource : {pagination : {total : 10}}});
      rootScope.$apply();
      //retrieve sucessMethod to call it
      var successMethod = userAPI.search.calls.argsFor(0)[1];
      successMethod(response);
      rootScope.$apply();

      //check filters have been called
      expect(userAPI.search.calls.allArgs()).toEqual([[{
        p: 0,
        c: 10,
        d: undefined,
        n: undefined,
        f : ['supervisor_id=14'],
        o: undefined
      }, jasmine.any(Function), jasmine.any(Function)]]);
      expect(result).toEqual(DATASET);
    }));

    it('should retrieve empty result', inject(function ($q) {
      var deferred = $q.defer();
      spyOn(userAPI, 'search').and.returnValue({$promise : deferred.promise});
      var result;
      store.load(userAPI).then(function(data){
        result = data;
      });

      expect(userAPI.search.calls.allArgs()).toEqual([[{
        p: 0,
        c: 0,
        f: undefined
      }]]);
      deferred.resolve({resource : {pagination : {total : 0}}});
      rootScope.$apply();
      expect(result).toEqual([]);
    }));

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
