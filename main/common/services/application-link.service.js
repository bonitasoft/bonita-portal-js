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

(function() {
  'use strict';
  /**
   * org.bonitasoft.service.applicationLink Module
   *
   * This service is used to generate links that work in both apps and standalone portal-js
   */
  angular.module('org.bonitasoft.service.applicationLink', ['org.bonitasoft.services.topurl']).service('ApplicationLink', function(manageTopUrl){
    var vm = this;
    var appUrlPattern = /\/apps\/([^/]*)\//;
    vm.isInApps = Boolean(isInApps());

    var appLinkService = {
      getLink: function(portalUrl, appsUrl) {
        if(vm.isInApps) {
          return appsUrl;
        }
        return portalUrl;
      },
      getAppTokenParam: getAppTokenParam,
      getPortalUrl: getPortalUrl,
      sanitizeSearchQuery: sanitizeSearchQuery,
      isInApps: vm.isInApps
    };

    function getAppTokenParam() {
      var appToken = getAppFromUrl();
      return vm.isInApps ? '&app=' + appToken[1] : '';
    }

    function getPortalUrl() {
      var locationHref = manageTopUrl.getPath();
      var indexOfApps = locationHref.indexOf('/apps/');
      if (indexOfApps >= 0) {
        return locationHref.substring(0, indexOfApps);
      } else {
        var indexOfPortal = locationHref.indexOf('/portal/');
        if (indexOfPortal >= 0) {
          return locationHref.substring(0, indexOfPortal);
        } else {
          throw 'Not a supported top URL';
        }
      }
    }

    function sanitizeSearchQuery(searchQuery) {
      return searchQuery === '' ? '?' : searchQuery + '&';
    }

    function isInApps() {
      var appToken = getAppFromUrl();
      return appToken && appToken.length >= 1;
    }

    function getAppFromUrl() {
      return appUrlPattern.exec(manageTopUrl.getPath());
    }

    return appLinkService;
  });
})();
