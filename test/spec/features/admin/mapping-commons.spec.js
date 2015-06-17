/** Copyright (C) 2015 Bonitasoft S.A.
 * BonitaSoft, 31 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

(function() {
  'use strict';
  describe('mapping-commons', function() {
    var mappingService, i18nService, userAPI, groupAPI, roleAPI, store, actorMemberAPI, q, scope;
    beforeEach(module('org.bonitasoft.features.admin.mappings'));
    beforeEach(inject(function(MappingService, _i18nService_, _userAPI_, _groupAPI_, _roleAPI_, _store_, _actorMemberAPI_, $q, $rootScope) {
      mappingService = MappingService;
      i18nService = _i18nService_;
      userAPI = _userAPI_;
      groupAPI = _groupAPI_;
      roleAPI = _roleAPI_;
      store = _store_;
      actorMemberAPI = _actorMemberAPI_;
      scope = $rootScope.$new();
      q = $q;
      spyOn(i18nService, 'getKey').and.callThrough();
      spyOn(store, 'load');
    }));
    describe('labelFormatter', function() {
      it('for a user, should return "firstname lastname"', function() {
        var content = {
          displayName: 'Acme',
          firstname: 'walter',
          lastname: 'bates'
        };
        expect(mappingService.labelFormatter.USER({
          'user_id': content
        })).toEqual('walter bates');
        expect(mappingService.labelFormatter.USER(content)).toEqual('walter bates');
      });
      it('for a group and role, should return the displayName', function() {
        var content = {
          displayName: 'Acme',
          firstname: 'walter',
          lastname: 'bates'
        };
        expect(mappingService.labelFormatter.GROUP({
          'group_id': content
        })).toEqual('Acme');
        expect(mappingService.labelFormatter.GROUP(content)).toEqual('Acme');
        expect(mappingService.labelFormatter.ROLE({
          'role_id': content
        })).toEqual('Acme');
        expect(mappingService.labelFormatter.ROLE(content)).toEqual('Acme');
      });
      it('for a membership, should return "member of role"', function() {
        var groupContent = {
            displayName: 'Acme'
          },
          roleContent = {
            displayName: 'Member'
          };
        expect(mappingService.labelFormatter.MEMBERSHIP({
          'role_id': roleContent,
          'group_id': groupContent
        })).toEqual('Member of Acme');
        expect(i18nService.getKey).toHaveBeenCalledWith('processDetails.actors.memberships.item.label', {
          group: 'Acme',
          role: 'Member'
        });
      });
      describe('getSearchMemberParams', function() {
        it('should retieve search default params', function() {
          expect(mappingService.getSearchMemberParams('USER')).toEqual({
            deploy: ['user_id'],
            o: 'firstname asc',
            actorId: 'user_id',
            searchAPI: userAPI
          });
          expect(mappingService.getSearchMemberParams('GROUP')).toEqual({
            deploy: ['group_id'],
            o: 'displayName asc',
            actorId: 'group_id',
            searchAPI: groupAPI
          });
          expect(mappingService.getSearchMemberParams('ROLE')).toEqual({
            deploy: ['role_id'],
            o: 'displayName asc',
            actorId: 'role_id',
            searchAPI: roleAPI
          });
          expect(mappingService.getSearchMemberParams('MEMBERSHIP')).toEqual({
            deploy: ['role_id', 'group_id'],
            o: 'displayName asc',
            actorId: 'role_id',
            actorId2: 'group_id'
          });
        });
      });
      describe('loadMembers', function() {
        it('should load all user members', function() {
          var deferred = q.defer();
          store.load.and.returnValue(deferred.promise);
          var user1 = {id: '456', firstname: 'walter', lastname: 'bates', 'user_id': {id: '654'}};
          var user2 = {id: '789', firstname: 'william', lastname: 'jobs', 'user_id': {id: '987'}};
          deferred.resolve([user1, user2]);
          var searchMemberParams = angular.extend(mappingService.getSearchMemberParams('USER'), {filters: 'processDefinitionId=123'});
          var mappedIds = [];
          mappingService.loadMembers('USER', searchMemberParams, mappedIds, actorMemberAPI).then(function(results) {
            expect(results).toEqual([angular.extend(user1, {label: 'walter bates'}), angular.extend(user2, {label: 'william jobs'})]);
          });
          expect(store.load).toHaveBeenCalledWith(actorMemberAPI, {f: 'processDefinitionId=123', d: ['user_id']});
          scope.$apply();
          expect(mappedIds).toEqual(['654', '987']);
        });
        it('should load all membership members', function() {
          var deferred = q.defer();
          store.load.and.returnValue(deferred.promise);
          var user1 = {id: '456', firstname: 'walter', lastname: 'bates', 'user_id': {id: '654'}};
          var user2 = {id: '789', firstname: 'william', lastname: 'jobs', 'user_id': {id: '987'}};
          deferred.resolve([user1, user2]);
          var searchMemberParams = angular.extend(mappingService.getSearchMemberParams('USER'), {filters: 'processDefinitionId=123'});
          var mappedIds = [];
          mappingService.loadMembers('USER', searchMemberParams, mappedIds, actorMemberAPI).then(function(results) {
            expect(results).toEqual([angular.extend(user1, {label: 'walter bates'}), angular.extend(user2, {label: 'william jobs'})]);
          });
          expect(store.load).toHaveBeenCalledWith(actorMemberAPI, {f: 'processDefinitionId=123', d: ['user_id']});
          scope.$apply();
          expect(mappedIds).toEqual(['654', '987']);
        });
      });
    });
  });
})();