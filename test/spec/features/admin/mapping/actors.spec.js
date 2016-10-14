'use strict';

describe('Actors select box', () => {

  let actorsSelectBoxCtrl, $scope, $http, controller, MappingService;
  beforeEach(angular.mock.module('org.bonitasoft.common.actors.selectbox'));

  beforeEach(inject(($controller, $rootScope, _$httpBackend_, _MappingService_) => {
    $scope = $rootScope.$new();
    $scope.selectedMembers = {};
    $http = _$httpBackend_;
    MappingService = _MappingService_;
    controller = $controller;
  }));

  describe('Groups', () => {
    beforeEach(() => {
      $scope.type = 'GROUP';
      $http.expectGET('../API/identity/group?c=200&o=displayName+asc&p=0').respond(200, []);
      $scope.alreadyMappedActorsIds = [];
      actorsSelectBoxCtrl = controller('ActorsSelectBoxCtrl', {$scope});
      $http.flush();
    });
    it('should set selectedMembers on init', () => {
      expect(actorsSelectBoxCtrl.selectedMembers).toEqual($scope.selectedMembers);
      expect(actorsSelectBoxCtrl.members).toEqual([]);
    });

    describe('ensureKeyWordMatches', () => {
      it('should match members with starting letter in any word ignoring case', () => {
        let memberResponseFromServer = [{id: '16', contentToSearch: 'Thomas Wallis'}, {
          id: '4',
          contentToSearch: 'Walter Bates'
        }];
        expect(actorsSelectBoxCtrl.ensureKeywordMatchesEntries('wa', memberResponseFromServer)).toEqual([...memberResponseFromServer]);
      });
      it('should match members more strictly than engine BS-15195', () => {
        let memberResponseFromServer = [{'id': '31', contentToSearch: 'DL PF03-IP-Access ALL-ELC-Loesch'},
          {'id': '30', contentToSearch: 'DL PF03-IP-Access LAU-ELC-AS_AL'},
          {'id': '29', contentToSearch: 'DL PF03-IP-Access ZUR-ELC-AS_AL'}];
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
        expect(actorsSelectBoxCtrl.members).toEqual(groups.map(MappingService.formatToSelectBox.GROUP));
      });
      it('should search for groups and keep selected element even if in the search results too', function () {
        const selectedGroup = MappingService.formatToSelectBox.GROUP(groups[1]);
        actorsSelectBoxCtrl.selectedMembers.list = [selectedGroup];
        $http.expectGET('../API/identity/group?c=200&o=displayName+asc&p=0&s=a').respond(200, groups);
        actorsSelectBoxCtrl.search({keyword: 'a'});
        $http.flush();
        expect(actorsSelectBoxCtrl.members).toEqual([groups[1], groups[0], groups[2]].map(MappingService.formatToSelectBox.GROUP));
        expect(actorsSelectBoxCtrl.selectedMembers.list).toEqual([selectedGroup]);
      });
      it('should search for groups and keep selected element', function () {
        const selectedGroup = MappingService.formatToSelectBox.GROUP({
          'path': '/bonita',
          'displayName': 'Bonita',
          'name': 'bonita',
          'description': 'Bonita group',
          'parent_path': '',
          'id': '81'
        });
        actorsSelectBoxCtrl.selectedMembers.list = [selectedGroup];
        $http.expectGET('../API/identity/group?c=200&o=displayName+asc&p=0&s=a').respond(200, groups);
        actorsSelectBoxCtrl.search({keyword: 'a'});
        $http.flush();
        expect(actorsSelectBoxCtrl.members).toEqual([selectedGroup, ...groups].map(MappingService.formatToSelectBox.GROUP));
        expect(actorsSelectBoxCtrl.selectedMembers.list).toEqual([selectedGroup]);
      });
      it('should reset search for groups and keep selected element', function () {
        const selectedGroup = MappingService.formatToSelectBox.GROUP({
          'path': '/bonita',
          'displayName': 'Bonita',
          'name': 'bonita',
          'description': 'Bonita group',
          'parent_path': '',
          'id': '81',
        });
        actorsSelectBoxCtrl.selectedMembers.list = [selectedGroup];
        $http.expectGET('../API/identity/group?c=200&o=displayName+asc&p=0').respond(200, [...groups, selectedGroup]);
        actorsSelectBoxCtrl.search({});
        $http.flush();
        expect(actorsSelectBoxCtrl.members).toEqual([selectedGroup, ...groups].map(MappingService.formatToSelectBox.GROUP));
        expect(actorsSelectBoxCtrl.selectedMembers.list).toEqual([selectedGroup]);
      });
    });
  });
  describe('Users', () => {
    beforeEach(() => {
      $scope.type = 'USER';
      $http.expectGET('../API/identity/user?c=200&o=firstname+asc&p=0').respond(200, []);
      $scope.alreadyMappedActorsIds = [];
      actorsSelectBoxCtrl = controller('ActorsSelectBoxCtrl', {$scope});
      $http.flush();
    });
    describe('search keyword', function () {
      const users = [{
        'firstname': 'Anthony',
        'userName': 'anthony.nichols',
        'title': 'Mr',
        'enabled': 'true',
        'lastname': 'Nichols',
        'manager_id': '17',
        'id': '18',
        'job_title': 'Account manager'
      }, {
        'firstname': 'April',
        'userName': 'april.sanchez',
        'title': 'Mrs',
        'enabled': 'true',
        'lastname': 'Sanchez',
        'manager_id': '3',
        'id': '2',
        'job_title': 'Compensation specialist'
      }, {
        'firstname': 'Daniela',
        'userName': 'daniela.angelo',
        'title': 'Mrs',
        'enabled': 'true',
        'lastname': 'Angelo',
        'manager_id': '1',
        'id': '17',
        'job_title': 'Vice President of Sales'
      }];
      it('should search for users', function () {
        $http.expectGET('../API/identity/user?c=200&o=firstname+asc&p=0&s=a').respond(200, users);
        actorsSelectBoxCtrl.search({keyword: 'a'});
        $http.flush();
        expect(actorsSelectBoxCtrl.members).toEqual(users.map(MappingService.formatToSelectBox.USER));
      });
      it('should search for users and keep selected element even if in the search results too', function () {
        const selectedUser = MappingService.formatToSelectBox.USER(users[1]);
        actorsSelectBoxCtrl.selectedMembers.list = [selectedUser];
        $http.expectGET('../API/identity/user?c=200&o=firstname+asc&p=0&s=a').respond(200, users);
        actorsSelectBoxCtrl.search({keyword: 'a'});
        $http.flush();
        expect(actorsSelectBoxCtrl.members).toEqual([users[1], users[0], users[2]].map(MappingService.formatToSelectBox.USER));
        expect(actorsSelectBoxCtrl.selectedMembers.list).toEqual([selectedUser]);
      });
    });
  });
});
