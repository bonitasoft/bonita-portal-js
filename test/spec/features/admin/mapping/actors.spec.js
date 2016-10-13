'use strict';

describe('Actors select box', () => {

  var actorsSelectBoxCtrl, $scope;
  beforeEach(angular.mock.module('org.bonitasoft.common.actors.selectbox'));

  beforeEach(inject(($controller, $rootScope) => {
    $scope = $rootScope.$new();
    $scope.selectedMembers = {};
    $scope.type = 'GROUP';
    actorsSelectBoxCtrl = $controller('ActorsSelectBoxCtrl', {$scope});
  }));

  it('should set selectedMembers on init', () => {
    expect(actorsSelectBoxCtrl.selectedMembers).toEqual($scope.selectedMembers);
    expect(actorsSelectBoxCtrl.members).toEqual([]);
  });

  describe('ensureKeyWordMatches', () => {
    it('should match members with starting letter in any word ignoring case', () => {
      let memberResponseFromServer = [{ 'id': '16', 'listLabel': 'Thomas Wallis' }, { 'id': '4', 'listLabel': 'Walter Bates' }];
      expect(actorsSelectBoxCtrl.ensureKeywordMatchesEntries('wa', memberResponseFromServer)).toEqual([...memberResponseFromServer]);
    });
    it('should match members more strictly than engine BS-15195', () => {
      let memberResponseFromServer = [
        { 'id': '31', 'listLabel': 'DL PF03-IP-Access ALL-ELC-Loesch', },
        { 'id': '30', 'listLabel': 'DL PF03-IP-Access LAU-ELC-AS_AL', },
        { 'id': '29', 'listLabel': 'DL PF03-IP-Access ZUR-ELC-AS_AL' }];
      expect(actorsSelectBoxCtrl.ensureKeywordMatchesEntries('DL PF03-IP-Access zu', memberResponseFromServer)).toEqual([memberResponseFromServer[2]]);
    });
  });
});
