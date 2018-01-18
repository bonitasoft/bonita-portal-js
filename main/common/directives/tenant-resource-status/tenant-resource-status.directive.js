/** Copyright (C) 2017 Bonitasoft S.A.
 * BonitaSoft, 32 rue Gustave Eiffel - 38000 Grenoble
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

  angular
    .module('org.bonitasoft.common.directives.tenantResourceStatus',
      ['org.bonitasoft.common.resources',
        'org.bonitasoft.common.moment',
        'gettext'
      ])
    .directive('boTenantResourceStatus', function () {
      return {
        scope: {
          data: '='
        },
        controllerAs: 'vm',
        controller: boStatusController,
        templateUrl: 'common/directives/tenant-resource-status/tenant-resource-status.html',
        link: function (scope) {
          scope.$watch('data', function () {
            scope.update(scope.data);
          });
        }
      };
    });

  function boStatusController($scope, sessionAPI, userAPI, gettext) {
    /*jshint validthis: true */
    var vm = this;

    var INSTALLED = 'INSTALLED';
    var INSTALLING = 'INSTALLING';

    vm.isInstalled = function isInstalled() {
      return vm.data && vm.data.state === 'INSTALLED';
    };

    $scope.update = function (newValue) {
      vm.data = newValue;
      setDisplayState();
      setLastUpdateDate();
      setLastUpdateBy();
    };

    function setDisplayState() {
      if (!vm.data) {
        vm.displayState = 'N/A';
        return;
      }
      if (vm.data.state === INSTALLED) {
        vm.displayState = gettext('installed');
      } else if (vm.data.state === INSTALLING) {
        vm.displayState = gettext('installing');
      } else {
        vm.displayState = gettext('Not installed');
      }
    }

    function setLastUpdateDate() {
      if (!vm.isInstalled()) {
        vm.lastUpdateDate = '-';
      } else {
        vm.lastUpdateDate = vm.data.lastUpdateDate;
      }
    }

    function setLastUpdateBy() {
      if (!vm.isInstalled()) {
        vm.updatedBy = '-';
      } else if (vm.data.lastUpdatedBy === '-1') {
        vm.updatedBy = gettext('Technical User');
      } else {
        userAPI.get({id: vm.data.lastUpdatedBy}).$promise.then(function (user) {
          vm.updatedBy = (user.lastname || user.firstname) ? (user.firstname + ' ' + user.lastname) : user.userName;
        });
      }
    }
  }

})();
