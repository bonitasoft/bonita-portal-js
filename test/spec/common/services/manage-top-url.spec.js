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

(function () {
  'use strict';
  describe('manage top url service', function () {
    var manageTopUrl;
    beforeEach(module('org.bonitasoft.services.topurl'));
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
