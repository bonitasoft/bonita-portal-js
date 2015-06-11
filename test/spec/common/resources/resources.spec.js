(function() {
  'use strict';

  describe('Resources API', function() {

    var mockWindow = {
        top: {
          'location': {
            reload: function() {}
          }
        }
      },
      processCategoryAPI, processConnectorAPI, parameterAPI;

    beforeEach(module('org.bonitasoft.common.resources'));
    beforeEach(module(function($provide) {
      $provide.value('$window', mockWindow);
    }));



    var $httpBackend, userAPI, unauthorizedResponseHandler;

    beforeEach(inject(function(_$httpBackend_, _userAPI_, _unauthorizedResponseHandler_, _processCategoryAPI_, _processConnectorAPI_, _parameterAPI_) {
      $httpBackend = _$httpBackend_;
      userAPI = _userAPI_;
      unauthorizedResponseHandler = _unauthorizedResponseHandler_;
      processCategoryAPI = _processCategoryAPI_;
      processConnectorAPI = _processConnectorAPI_;
      parameterAPI = _parameterAPI_;
    }));

    it('should get user specified by the id', inject(function() {

      $httpBackend.expectGET('../API/identity/user/123').respond({
        id: 123
      });

      var user = userAPI.get({
        id: 123
      });
      $httpBackend.flush();

      expect(user.id).toBe(123);
    }));

    it('should search an users and return an array also containing pagination', inject(function() {

      $httpBackend.expectGET('../API/identity/user?c=10&p=0').respond(function() {
        return [200, [{
          id: 1
        }, {
          id: 2
        }], {
          'Content-Range': '0-10/10'
        }];
      });

      var users = userAPI.search({
        p: 0,
        c: 10
      });
      $httpBackend.flush();

      expect(JSON.stringify(users)).toBe('[{"id":1},{"id":2}]');
      expect(users.pagination).toEqual({
        total: 10,
        index: 0,
        currentPage: 1,
        numberPerPage: 10
      });
    }));

    it('should not throw exception when there is no content-range', inject(function() {

      $httpBackend.expectGET('../API/identity/user?c=10&p=0').respond(function() {
        return [200, [], {}];
      });

      var users = userAPI.search({
        p: 0,
        c: 10
      });
      $httpBackend.flush();

      expect(users.pagination).toEqual({});
    }));

    describe('on response error', function() {

      it('should reload parent when back end respond 401', function() {
        expect(unauthorizedResponseHandler).toBeDefined();
        spyOn(mockWindow.top.location, 'reload');

        unauthorizedResponseHandler.responseError({
          status: 401
        });

        expect(mockWindow.top.location.reload).toHaveBeenCalled();
      });

      it('should not reload parent otherwise', function() {
        expect(unauthorizedResponseHandler).toBeDefined();
        spyOn(mockWindow.top.location, 'reload');

        unauthorizedResponseHandler.responseError({
          status: 404
        });

        expect(mockWindow.top.location.reload).not.toHaveBeenCalled();
      });
    });

    (function testAPIRegistration(resources) {
      angular.forEach(resources, function(resource) {
        it('should register resource <' + resource + '>', inject(function($injector) {
          expect($injector.get(resource)).toBeDefined();
        }));
      });
    })([
      'userAPI',
      'caseAPI',
      'processAPI',
      'humanTaskAPI',
      'profileAPI',
      'membershipAPI',
      'professionalDataAPI',
      'personalDataAPI',
      'i18nAPI'
    ]);
    describe('processCategoryAPI', function() {
      it('should call POST http requests with custom body', function() {
        $httpBackend.expect('POST', '../API/bpm/processCategory',
          '{"category_id":"1","process_id":"23"}').respond({});

        processCategoryAPI.save({
          'category_id': 1,
          'process_id': 23
        });
        $httpBackend.flush();
      });
      it('should call DELETE http requests with custom body', function() {
        $httpBackend.expect('DELETE', '../API/bpm/processCategory',
          '["1/7"]').respond({});

        processCategoryAPI.delete({
          'category_id': 7,
          'process_id': 1
        });
        $httpBackend.flush();
      });
    });
    describe('processConnectorAPI', function() {
      it('should call POST http requests with custom body', function() {
        $httpBackend.expect('PUT', '../API/bpm/processConnector/23/456/789',
          '{"content":"1"}').respond({});

        processConnectorAPI.update({
          'definition_id': 456,
          'definition_version': 789,
          'process_id': 23,
          content: '1'
        });
        $httpBackend.flush();
      });
    });
    describe('parameterAPI', function() {
      it('should call POST http requests with custom body', function() {
        $httpBackend.expect('PUT', '../API/bpm/processParameter/23/nbLoops',
          '{"content":"1"}').respond({});

        parameterAPI.update({
          'name': 'nbLoops',
          'process_id': 23,
          content: '1'
        });
        $httpBackend.flush();
      });
    });
  });
})();