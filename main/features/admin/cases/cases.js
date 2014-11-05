(function () {
  'use strict';

  angular.module('org.bonita.features.admin.cases', ['ui.router', 'org.bonita.features.admin.cases.list', 'ui.bootstrap', 'gettext'])
    .config([ '$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.when('/admin/cases/list', '/admin/cases/list/active');
      $stateProvider.state('bonita.cases', {
        url: '/admin/cases/list',
        templateUrl: 'features/admin/cases/cases.html',
        abstract: true,
      }).state( 'bonita.cases.active', {
        url: '/active',
        views : {
          'case-list' : {
            templateUrl: 'features/admin/cases/cases-list.html',
            controller: 'ActiveCaseListCtrl'
          }
        }
      }).state('bonita.cases.archived', {
        url: '/archived',
        views : {
          'case-list' : {
            templateUrl: 'features/admin/cases/archived-cases-list.html',
            controller: 'ArchivedCaseListCtrl'
          }
        }
      });
    }]);
})();
