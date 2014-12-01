ddescribe('navigationService', function () {
  'use strict';

  var navigation;
  var portal;

  beforeEach(module('org.bonita.services.navigation'));

  beforeEach(inject(function (_navigation_, $window) {
    navigation = _navigation_;
    portal = {
      location: {}
    };
    $window.top = portal;
  }));

  it('should retrieve current profile from top window when there', function () {
    portal.location.hash = '_pf=2';
    expect(navigation.currentProfile).toBe('2');
  });

  it('should return retrieve current profile from top window when there', function () {
    expect(navigation.currentProfile).toBe('');
  });

  it('should throw an error when page token is undefined', function () {
    expect(function() {
      navigation.resolve({});
    }).toThrow();
  });

  it('should add page as hash parameter', function () {
    var url = navigation.resolve({
      _p: 'caselistingadmin'
    });

    expect(url).toBe('../portal/homepage#_p=caselistingadmin');
  });

  it('should add current profile id to the url when already there', function () {

    var url = navigation.resolve({
      _p: 'caselistingadmin'
    });

    expect(url).toBe('../portal/homepage#_p=caselistingadmin');
  });

  it('should add id as hash parameter but prefixed with page token', function () {
    var url = navigation.resolve({
      _p: 'caselistingadmin',
      id: '123'
    });

    expect(url).toBe('../portal/homepage#_p=caselistingadmin&caselistingadmin_id=123');
  });

});
