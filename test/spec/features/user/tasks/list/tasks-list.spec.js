'use strict';

describe('Custom Page App test', function() {
  describe('App Module test', function() {
    var module;

    beforeEach(function() {
      module = angular.module('org.bonitasoft.features.user.tasks.list');
    });

    it('should be registered', function() {
      expect(module).not.toEqual(null);
    });

  });

});
