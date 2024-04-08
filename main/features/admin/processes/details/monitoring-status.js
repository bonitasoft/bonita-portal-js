/** Copyright (C) 2015 Bonitasoft S.A.
 * Bonitasoft is a trademark of Bonitasoft SA.
 * This software file is BONITASOFT CONFIDENTIAL. Not For Distribution.
 * For commercial licensing information, contact:
 * Bonitasoft, 32 rue Gustave Eiffel – 38000 Grenoble
 * or Bonitasoft US, 51 Federal Street, Suite 305, San Francisco, CA 94107
 */

(function() {
  'use strict';

  angular.module('org.bonitasoft.features.admin.processes.details.monitoringStatus', [
    'org.bonitasoft.common.i18n',
    'ui.bootstrap',
    'org.bonitasoft.service.token',
    'org.bonitasoft.common.directives.bonitaHref',
    'org.bonitasoft.services.topurl'
  ])
    .directive('monitoringStatus', function() {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          process: '='
        },
        templateUrl: 'features/admin/processes/details/monitoring-status.html',
        controller: 'MonitoringStatusCtrl',
        controllerAs: 'monitoringCtrl'
      };
    }).controller('MonitoringStatusCtrl', function($scope, i18nService, TokenExtensionService, archivedCaseAPI, manageTopUrl, $window) {
      var vm = this;
      vm.process = $scope.process;
      vm.pageProfileToken = TokenExtensionService.tokenExtensionValue;
      vm.archivedCaseCount = 0;
      vm.goToFailedCaseList = goToFailedCaseList;
      vm.goToCaseList = goToCaseList;
      vm.goToArchivedCaseList = goToArchivedCaseList;

      var caseListUrl = '../admin-case-list/?processId=' + vm.process.id;

      function goToFailedCaseList() {
        goTo(caseListUrl + '&caseStateFilter=error');
      }

      function goToCaseList() {
        goTo(caseListUrl);
      }

      function goToArchivedCaseList() {
        goTo(caseListUrl + '&tab=archived');
      }

      function goTo(url) {
        $window.parent.location = manageTopUrl.getPath() + url;
      }

      getArchivedCaseCount(vm.process.id);

      function getArchivedCaseCount(processId) {
        return archivedCaseAPI.search({
          p: 0,
          c: 2147483646,   // java Integer.MAX_INT - 1
          f: ['processDefinitionId=' + processId]
        }).$promise.then(function (results) {
          vm.archivedCaseCount = results.data.length;
        });
      }
    });
})();
