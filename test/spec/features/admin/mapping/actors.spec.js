'use strict';

describe('Actors select box', () => {

  let actorsSelectBoxCtrl, $scope, $http;
  beforeEach(angular.mock.module('org.bonitasoft.common.actors.selectbox'));

  beforeEach(inject(($controller, $rootScope, _$httpBackend_) => {
    $scope = $rootScope.$new();
    $scope.selectedMembers = {};
    $scope.type = 'GROUP';
    $http = _$httpBackend_;
    $http.expectGET('../API/identity/group?c=200&o=displayName+asc&p=0').respond(200, []);
    $scope.alreadyMappedActorsIds = [];
    actorsSelectBoxCtrl = $controller('ActorsSelectBoxCtrl', {$scope});
    $http.flush();
  }));

  it('should set selectedMembers on init', () => {
    expect(actorsSelectBoxCtrl.selectedMembers).toEqual($scope.selectedMembers);
    expect(actorsSelectBoxCtrl.members).toEqual([]);
  });

  describe('ensureKeyWordMatches', () => {
    it('should match members with starting letter in any word ignoring case', () => {
      let memberResponseFromServer = [{'id': '16', 'listLabel': 'Thomas Wallis'}, {
        'id': '4',
        'listLabel': 'Walter Bates'
      }];
      expect(actorsSelectBoxCtrl.ensureKeywordMatchesEntries('wa', memberResponseFromServer)).toEqual([...memberResponseFromServer]);
    });
    it('should match members more strictly than engine BS-15195', () => {
      let memberResponseFromServer = [{'id': '31', 'listLabel': 'DL PF03-IP-Access ALL-ELC-Loesch'},
        {'id': '30', 'listLabel': 'DL PF03-IP-Access LAU-ELC-AS_AL'},
        {'id': '29', 'listLabel': 'DL PF03-IP-Access ZUR-ELC-AS_AL'}];
      expect(actorsSelectBoxCtrl.ensureKeywordMatchesEntries('DL PF03-IP-Access zu', memberResponseFromServer)).toEqual([memberResponseFromServer[2]]);
    });
  });
  describe('search keyword', function () {
    const groups = [{
      'path': '/acme',
      'displayName': 'Acme',
      'name': 'acme',
      'description': 'This group represents the acme department of the ACME organization',
      'parent_path': '',
      'id': '1'
    }, {
      'path': '/acme/hr',
      'displayName': 'Human Resources',
      'name': 'hr',
      'description': 'This group represents the human resources department of the ACME organization',
      'parent_path': '/acme',
      'id': '2'
    }, {
      'path': '/acme/it',
      'displayName': 'Infrastructure',
      'name': 'it',
      'description': 'This group represents the infrastructure department of the ACME organization',
      'parent_path': '/acme',
      'id': '4'
    }];
    it('should search for groups', function () {
      $http.expectGET('../API/identity/group?c=200&o=displayName+asc&p=0&s=a').respond(200, groups);
      actorsSelectBoxCtrl.search({keyword: 'a'});
      $http.flush();
      expect(actorsSelectBoxCtrl.members).toEqual(groups.map(group =>  (group.buttonLabel = group.listLabel = group.displayName) && group));
    });
    it('should search for groups and keep selected element even if in the search results too', function () {
      const selectedGroup = angular.copy(groups[1], {});
      selectedGroup.buttonLabel = selectedGroup.listLabel = selectedGroup.displayName;
      actorsSelectBoxCtrl.selectedMembers.list = [selectedGroup];
      $http.expectGET('../API/identity/group?c=200&o=displayName+asc&p=0&s=a').respond(200, groups);
      actorsSelectBoxCtrl.search({keyword: 'a'});
      $http.flush();
      expect(actorsSelectBoxCtrl.members).toEqual([groups[1], groups[0], groups[2]].map(group => (group.buttonLabel = group.listLabel = group.displayName) && group));
      expect(actorsSelectBoxCtrl.selectedMembers.list).toEqual([selectedGroup]);
    });
    it('should search for groups and keep selected element', function () {
      const selectedGroup = {
        'path': '/bonita',
        'displayName': 'Bonita',
        'name': 'bonita',
        'description': 'Bonita group',
        'parent_path': '',
        'id': '81'
      };
      selectedGroup.buttonLabel = selectedGroup.listLabel = selectedGroup.displayName;
      actorsSelectBoxCtrl.selectedMembers.list = [selectedGroup];
      $http.expectGET('../API/identity/group?c=200&o=displayName+asc&p=0&s=a').respond(200, groups);
      actorsSelectBoxCtrl.search({keyword: 'a'});
      $http.flush();
      expect(actorsSelectBoxCtrl.members).toEqual([selectedGroup, ...groups].map(group  => (group.buttonLabel = group.listLabel = group.displayName) && group));
      expect(actorsSelectBoxCtrl.selectedMembers.list).toEqual([selectedGroup]);
    });
    it('should reset search for groups and keep selected element', function () {
      const selectedGroup = {
        'path': '/bonita',
        'displayName': 'Bonita',
        'name': 'bonita',
        'description': 'Bonita group',
        'parent_path': '',
        'id': '81',
      };
      selectedGroup.buttonLabel = selectedGroup.listLabel = selectedGroup.displayName;
      actorsSelectBoxCtrl.selectedMembers.list = [selectedGroup];
      $http.expectGET('../API/identity/group?c=200&o=displayName+asc&p=0').respond(200, [...groups, selectedGroup]);
      actorsSelectBoxCtrl.search({});
      $http.flush();
      expect(actorsSelectBoxCtrl.members).toEqual([selectedGroup, ...groups].map(group =>  (group.buttonLabel = group.listLabel = group.displayName) && group));
      expect(actorsSelectBoxCtrl.selectedMembers.list).toEqual([selectedGroup]);
    });
  });
});
