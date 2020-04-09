/** Copyright (C) 2020 Bonitasoft S.A.
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
  describe('application link service', function () {
    var applicationLink, manageTopUrl;
    beforeEach(module('org.bonitasoft.service.applicationLink'));
    beforeEach(function(){
      manageTopUrl = {
        getPath: function() {}
      };
      module(function($provide) {
        $provide.value('manageTopUrl', manageTopUrl);
      });
    });

    describe('common tests', function () {
      beforeEach(function () {
        inject(function($injector) {
          applicationLink = $injector.get('ApplicationLink');
        });
      });
    });

    describe('when in portal', function () {
      beforeEach(function () {
        spyOn(manageTopUrl, 'getPath').and.returnValue('/bonita/portal/homepage');
        inject(function($injector) {
          applicationLink = $injector.get('ApplicationLink');
        });
      });

      it('isInApps has the correct initial value', function () {
        expect(applicationLink.isInApps).toBe(false);
      });

      it('getLink should return the correct url', function () {
        expect(applicationLink.getLink('/bonita/portal/homepage', '/bonita/apps/appName/')).toBe('/bonita/portal/homepage');
      });

      it('getAppTokenParam should return the correct query string fragment', function () {
        expect(applicationLink.getAppTokenParam()).toBe('');
      });

      it('getPortalUrl should return the url prefix', function () {
        expect(applicationLink.getPortalUrl()).toBe('/bonita');
      });
    });

    describe('when in application', function () {
      beforeEach(function () {
        spyOn(manageTopUrl, 'getPath').and.returnValue('/bonita/in/application/apps/appName/');
        inject(function($injector) {
          applicationLink = $injector.get('ApplicationLink');
        });
      });

      it('isInApps has the correct initial value', function () {
        expect(applicationLink.isInApps).toBe(true);
      });

      it('getLink should return the correct url', function () {
        expect(applicationLink.getLink('/bonita/portal/homepage', '/bonita/apps/appName/')).toBe('/bonita/apps/appName/');
      });

      it('getAppTokenParam should return the correct query string fragment', function () {
        expect(applicationLink.getAppTokenParam()).toBe('app=appName');
      });

      it('getPortalUrl should return the url prefix', function () {
        expect(applicationLink.getPortalUrl()).toBe('/bonita/in/application');
      });
    });

    describe('when in application named apps', function () {
      beforeEach(function () {
        spyOn(manageTopUrl, 'getPath').and.returnValue('/bonita/apps/apps/');
        inject(function($injector) {
          applicationLink = $injector.get('ApplicationLink');
        });
      });

      it('isInApps has the correct initial value', function () {
        expect(applicationLink.isInApps).toBe(true);
      });

      it('getAppTokenParam should return the correct query string fragment', function () {
        expect(applicationLink.getAppTokenParam()).toBe('app=apps');
      });
    });
  });
})();
