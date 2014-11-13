(function () {
  'use strict';
  describe('manage top url service', function () {
    var manageTopUrl;
    beforeEach(module('org.bonita.services.topurl'));
    var mockedWindow;
    beforeEach(function(){
      mockedWindow = {
        top : {
          location:{}
        }
      };
      module(function($provide) {
        $provide.value('$window', mockedWindow);
      });
      inject(function($injector) {
        manageTopUrl = $injector.get('manageTopUrl');
      });
    });
    describe('getUrlToTokenAndId function', function(){
      beforeEach(function () {
        spyOn(manageTopUrl, 'getCurrentProfile').and.returnValue('_pf=2');
        mockedWindow.top.location.pathname = '/bonita/portal/homepage';
        mockedWindow.top.location.search = '?tenant=1';
      });
      it('should change top location hash to case detail', function () {
        expect(manageTopUrl.getUrlToTokenAndId()).toBe('/bonita/portal/homepage?tenant=1#?id=&_p=&_pf=2');
      });
      it('should change top location hash to case detail', function () {
        var caseItemId = 123;
        expect(manageTopUrl.getUrlToTokenAndId(caseItemId, 'casedetails')).toEqual('/bonita/portal/homepage?tenant=1#?id=123&_p=casedetails&_pf=2');
        caseItemId = '4658';
        manageTopUrl.getUrlToTokenAndId(caseItemId, 'casedetails');
        expect(manageTopUrl.getUrlToTokenAndId(caseItemId, 'casedetails')).toEqual('/bonita/portal/homepage?tenant=1#?id=4658&_p=casedetails&_pf=2');
      });
    });
    describe('addOrReplaceParam function', function(){
      it('should handle border cases', function(){
        delete mockedWindow.top.location.hash;
        manageTopUrl.addOrReplaceParam('_tab','archived');
        expect(mockedWindow.top.location.hash).toBe('#_tab=archived');
        mockedWindow.top.location.hash = '_p=cases&tenant=1&';
        manageTopUrl.addOrReplaceParam('_tab','');
        expect(mockedWindow.top.location.hash).toBe('_p=cases&tenant=1&');
        mockedWindow.top.location.hash = '_p=cases&tenant=1&cases_tab=pouet';
        manageTopUrl.addOrReplaceParam('_tab','');
        expect(mockedWindow.top.location.hash).toBe('_p=cases&tenant=1&');
        mockedWindow.top.location.hash = '_p=cases&tenant=1&';
        manageTopUrl.addOrReplaceParam('_tab','archived');
        expect(mockedWindow.top.location.hash).toBe('_p=cases&tenant=1&cases_tab=archived');
        mockedWindow.top.location.hash = '';
        manageTopUrl.addOrReplaceParam('_tab','archived');
        expect(mockedWindow.top.location.hash).toBe('#_tab=archived');
        mockedWindow.self = mockedWindow.top;
        mockedWindow.top.location.hash = 'test';
        manageTopUrl.addOrReplaceParam('_tab','archived');
        expect(mockedWindow.top.location.hash).toBe(mockedWindow.self.location.hash);
        expect(mockedWindow.top.location.hash).toBe('test');
        delete mockedWindow.self;
        mockedWindow.top.location.hash = '_p=page&page_tab=archived';
        manageTopUrl.addOrReplaceParam('_tab','');
        expect(mockedWindow.top.location.hash).toBe('_p=page&');
        mockedWindow.top.location.hash = '';
        manageTopUrl.addOrReplaceParam('_tab','');
        expect(mockedWindow.top.location.hash).toBe('');
      });
      it('should set top location hash to archived tab', function () {
        mockedWindow.top.location.hash = '_p=cases&tenant=1&';
        manageTopUrl.addOrReplaceParam('_tab','archived');
        expect(mockedWindow.top.location.hash).toBe('_p=cases&tenant=1&cases_tab=archived');
        mockedWindow.top.location.hash = '&tenant=1&_p=cases&';
        manageTopUrl.addOrReplaceParam('_tab','archived');
        expect(mockedWindow.top.location.hash).toBe('&tenant=1&_p=cases&cases_tab=archived');
        mockedWindow.top.location.hash = 'tenant=1';
        manageTopUrl.addOrReplaceParam('_tab','archived');
        expect(mockedWindow.top.location.hash).toBe('tenant=1&_tab=archived');
      });
      it('should change top location hash to archived tab', function () {
        mockedWindow.top.location.hash = '_p=cases&cases_tab=1&';
        manageTopUrl.addOrReplaceParam('_tab','archived');
        expect(mockedWindow.top.location.hash).toBe('_p=cases&cases_tab=archived&');
        mockedWindow.top.location.hash = '&_p=cases&cases_tab=1';
        manageTopUrl.addOrReplaceParam('_tab','archived');
        expect(mockedWindow.top.location.hash).toBe('&_p=cases&cases_tab=archived');
        mockedWindow.top.location.hash = 'cases_tab=1&_p=cases&';
        manageTopUrl.addOrReplaceParam('_tab','archived');
        expect(mockedWindow.top.location.hash).toBe('cases_tab=archived&_p=cases&');
        mockedWindow.top.location.hash = '&cases_tab=1&';
        manageTopUrl.addOrReplaceParam('_tab','archived');
        expect(mockedWindow.top.location.hash).toBe('&cases_tab=1&_tab=archived');
      });
    });
    describe('retrieve current profile from top Url', function(){
      it('should not throw error when no top or hash empty', function(){
        expect(manageTopUrl.getCurrentProfile()).toBeUndefined();
        delete mockedWindow.top;
        expect(manageTopUrl.getCurrentProfile()).toBeUndefined();
      });
      it('should find _pf=2 from top window', function(){
        mockedWindow.top.location.hash = '?_p=ng-caselistingadmin&_pf=2';
        expect(manageTopUrl.getCurrentProfile()).toBe('_pf=2');
        mockedWindow.top.location.hash = '?_pf=372&_p=ng-caselistingadmin';
        expect(manageTopUrl.getCurrentProfile()).toBe('_pf=372');
        mockedWindow.top.location.hash = '?_p=ng-caselistingadmin&_pf=452&_pf=6';
        expect(manageTopUrl.getCurrentProfile()).toBe('_pf=452');
        mockedWindow.top.location.hash = '_pf=122';
        expect(manageTopUrl.getCurrentProfile()).toBe('_pf=122');
      });
    });
    describe('getCurrentPageToken', function(){
      it('should find the page token from top window\'s hash', function(){
        mockedWindow.top.location.hash = '?_p=ng-caselistingadmin&_pf=2';
        expect(manageTopUrl.getCurrentPageToken()).toBe('ng-caselistingadmin');
        mockedWindow.top.location.hash = '?_pf=372&_p=caselistingadmin';
        expect(manageTopUrl.getCurrentPageToken()).toBe('caselistingadmin');
        mockedWindow.top.location.hash = '?_p=ng-caselisting&_pf=452&_pf=6';
        expect(manageTopUrl.getCurrentPageToken()).toBe('ng-caselisting');
        mockedWindow.top.location.hash = '_pf=122';
        expect(manageTopUrl.getCurrentPageToken()).toBe('');
      });
    });
  });
})();
