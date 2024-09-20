'use strict';

describe('Security', function() {
  var $httpBackend;
  var $http;
  var $rootScope;

  var authRequestHandler;

  var authRegexp = /^\.\.\/API\/system\/session\/unusedId/;

  beforeEach(module('common.security'));


  beforeEach(inject(function($injector) {
    $http = $injector.get('$http');
    $httpBackend = $injector.get('$httpBackend');
    $rootScope = $injector.get('$rootScope');

    authRequestHandler = $httpBackend
      .whenGET(authRegexp);

  }));


  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation(false);
    $httpBackend.verifyNoOutstandingRequest(false);
  });

  it('should attach an error object to $rootScope', function(){
    $http.get('../API/system/session/unusedId').catch(angular.noop);
    authRequestHandler.respond(401, 'unauhtorized');
    $httpBackend.flush();
    expect($rootScope.error.status).toBe(401);
  });

  it('should not  have an error object to $rootScope when API repsond 200', function(){
    authRequestHandler.respond({user:123});
    $http.get('../API/system/session/unusedId');
    $httpBackend.flush();

    expect($rootScope.error).toBeUndefined();
  });
});
