(function() {
  'use strict';
  describe('mapping-commons', function() {
    var mappingService, i18nService;
    beforeEach(module('org.bonitasoft.features.admin.mappings'));
    beforeEach(inject(function(MappingService, _i18nService_) {
      mappingService = MappingService;
      i18nService = _i18nService_;
      spyOn(i18nService, 'getKey').and.callThrough();
    }));
    describe('labelFormatter', function() {
      it('for a user, should return "firstname lastname"', function() {
        var content = {displayName: 'Acme', firstname: 'walter', lastname:'bates'};
        expect(mappingService.labelFormatter.USER({'user_id': content})).toEqual('walter bates');
        expect(mappingService.labelFormatter.USER(content)).toEqual('walter bates');
      });
      it('for a group and role, should return the displayName', function() {
        var content = {displayName: 'Acme', firstname: 'walter', lastname:'bates'};
        expect(mappingService.labelFormatter.GROUP({'group_id': content})).toEqual('Acme');
        expect(mappingService.labelFormatter.GROUP(content)).toEqual('Acme');
        expect(mappingService.labelFormatter.ROLE({'role_id': content})).toEqual('Acme');
        expect(mappingService.labelFormatter.ROLE(content)).toEqual('Acme');
      });
      it('for a membership, should return "member of role"', function() {
        var groupContent = {displayName: 'Acme'}, roleContent = {displayName: 'Member'};
        expect(mappingService.labelFormatter.MEMBERSHIP({'role_id': roleContent, 'group_id': groupContent})).toEqual('Member of Acme');
        expect(i18nService.getKey).toHaveBeenCalledWith('processDetails.actors.memberships.item.label', {group: 'Acme', role: 'Member'});
      });
    });
  });
})();