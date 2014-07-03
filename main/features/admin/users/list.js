'use strict';

/**
 * @ngdoc function
 * @name o.b.f.admin.users.list:adminListCtrl
 * @description
 * # adminListCtrl
 * Controller of the bonita.portal
 */
angular.module('org.bonita.features.admin.users.list', ['org.bonita.common.resources', 'ui.router', 'org.bonita.common.logged-user']).config(
    [ '$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('/admin/users/', '/admin/users');
        $stateProvider
            .state('adminUserList', {
                url: '/admin/users',
                templateUrl: 'features/admin/users/list.html',
                controller: 'adminListCtrl'
            });
    }]).controller('adminListCtrl', [ '$scope', 'loggedUser', 'User', function ($scope, loggedUser, User) {
        loggedUser.getLoggedUser().then(function(){
          $scope.users = User.search({
              p: 0,
              c: 10
          });
        });
    }]);
