(function() {

  'use strict';

  describe('priorities service', function() {

    var priorities;

    beforeEach(module('org.bonitasoft.features.user.tasks.app.priorities'));

    beforeEach(inject(function(_priorities_) {
      priorities = _priorities_;
    }));

    it('should return given key for an unknown one', function() {
      expect(priorities.get('unknownkey')).toEqual('unknownkey');
    });

    it('should return key label from catalog otherwise', function() {
      expect(priorities.get('highest')).toEqual('Highest');
      expect(priorities.get('above_normal')).toEqual('Above normal');
      expect(priorities.get('normal')).toEqual('Normal');
      expect(priorities.get('under_normal')).toEqual('Under normal');
      expect(priorities.get('lowest')).toEqual('Lowest');
    });
  });

})();
