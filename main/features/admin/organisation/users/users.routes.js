(function () {

  'use strict';

  angular
    .module('org.bonitasoft.features.admin.organisation.users')
    .config(routes);

  function routes($stateProvider) {
    $stateProvider
      .state('bonita.userDetails', {
        url: '/admin/organisation/users/:id',
        templateUrl: 'features/admin/organisation/users/details/index.html',
        controller: 'UserDetailsCtrl as vm',
        abstract: true,
        resolve: {
          stateParamsUserId: function($stateParams) {
            return $stateParams.id;
          },
          user: function (userAPI, stateParamsUserId) {
            if (!stateParamsUserId || stateParamsUserId === '') {
              return {};
            }
            return userAPI.get({id: stateParamsUserId, d: ['professional_data', 'personnal_data', 'manager_id']})
              .$promise.then(function(user) {
                // reset the manager field when user has no manager. (i.e. rest API is sending us manager_id: "0")
                /* jshint camelcase: false */
                user.manager_id = !angular.isObject(user.manager_id) ? undefined : user.manager_id;
                return user;
              }).catch(function () {
                return {};
              });
          }
        }
      })
      .state('bonita.userDetails.businessCard', {
        url: '/business-card',
        templateUrl: 'features/admin/organisation/users/details/business-card/index.html',
      })
      .state('bonita.userDetails.personalInfo', {
        url: '/personal-information',
        templateUrl: 'features/admin/organisation/users/details/personal-information/index.html'
      })
      .state('bonita.userDetails.general', {
        url: '',
        templateUrl: 'features/admin/organisation/users/details/general/index.html'
      })
      .state('bonita.userDetails.password', {
        url: '/password',
        templateUrl: 'features/admin/organisation/users/details/password/index.html'
      })
      .state('bonita.userDetails.profiles', {
        url: '/profiles',
        templateUrl: 'features/admin/organisation/users/details/profiles/index.html',
        controller: 'UserProfiles as vm',
        resolve: {
          profiles: function (profileAPI, stateParamsUserId) {
            if (!stateParamsUserId || stateParamsUserId === '') {
              return [];
            }
            return profileAPI.search({p: 0, c: 100, f: 'user_id=' + stateParamsUserId});
          },
          memberships: function (membershipAPI, stateParamsUserId) {
            if (!stateParamsUserId || stateParamsUserId === '') {
              return [];
            }
            return membershipAPI.search({p:0, c:25, f:'user_id=' + stateParamsUserId, d: ['role_id', 'group_id']});
          }
        }
      })
      .state('bonita.userDetails.customInfo', {
        url: '/custom-information',
        templateUrl: 'features/admin/organisation/users/details/custom-information/index.html',
        controller: 'UserCustomInfoCtrl as vm',
        resolve: {
          customInformation: function (customUserInfoAPI, stateParamsUserId) {
            if (!stateParamsUserId || stateParamsUserId === '') {
              return [];
            }
            return customUserInfoAPI.search({p: 0, c: 100, f: 'userId=' + stateParamsUserId})
              .$promise.then(function(response) {
                return response.data;
              }, function() {
                return [];
              });
          }
        }
      });
  }

})();
