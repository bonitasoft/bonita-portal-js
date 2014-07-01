'use strict';

describe('Controller: PocprotractorCtrl', function () {

  // load the controller's module
  beforeEach(module('portaljsApp'));

  var PocprotractorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PocprotractorCtrl = $controller('PocprotractorCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings).toEqual('Have Fun With Bonita!!');
  });
});
