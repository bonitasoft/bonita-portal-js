'use strict';

describe('Controller: ListCtrl', function () {

  // load the controller's module
  beforeEach(module('bonitaPortalJsApp'));

  var ListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ListCtrl = $controller('ListCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings).toEqual('Have Fun With Bonita!!');
  });
});
