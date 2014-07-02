'use strict';

/**
 * @ngdoc function
 * @name bonitaPortalJsApp.controller:ListCtrl
 * @description
 * # ListCtrl
 * Controller of the bonitaPortalJsApp
 */
angular.module('org.bonita.features.admin.users.list', ['org.bonita.common.resources', 'ui.router']).config(
    [ '$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('/admin/users/', '/admin/users');
        $stateProvider
            .state('adminUserList', {
                url: '/admin/users',
                templateUrl: 'features/admin/users/list.html',
                controller: 'adminListCtrl'
            });
    }]).controller('adminListCtrl', [ '$scope', 'User', function ($scope, User) {
        $scope.users = User.search({
            p: 0,
            c: 10
        });
    }]);
