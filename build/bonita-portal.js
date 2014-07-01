'use strict';

angular
    .module('bonita.portal', [
        'ngCookies',
        'ngResource',
        'ngRoute'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'features/poc/views/main.html',
                controller: 'MainCtrl'
            }).when('/cases', {
                templateUrl: 'features/poc/views/cases.html',
                controller: 'CasesCtrl'
            }).when('/users', {
                templateUrl: 'features/poc/views/users.tpl.html',
                controller: 'UsersCtrl'
            })
            .when('/pocProtractor', {
              templateUrl: 'features/poc/pocprotractor.html',
              controller: 'PocprotractorCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

'use strict';

/**
 * @ngdoc function
 * @name portaljsApp.controller:PocprotractorCtrl
 * @description
 * # PocprotractorCtrl
 * Controller of the portaljsApp
 */
angular.module('bonita.portal')
  .controller('PocprotractorCtrl', function ($scope) {
    $scope.awesomeThings = 'Have Fun With Bonita!!';
  });
