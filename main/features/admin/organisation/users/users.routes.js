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
          user: function (userAPI, $stateParams) {
            return userAPI.get({id: $stateParams.id, d: ['professional_data', 'personnal_data', 'manager_id']});
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
          profiles: function (profileAPI, $stateParams) {
            return profileAPI.search({p: 0, c: 100, f: 'user_id=' + $stateParams.id});
          },
          memberships: function (membershipAPI, $stateParams) {
            return membershipAPI.search({p:0, c:100, f:'user_id=' + $stateParams.id, d: ['role_id', 'group_id']});
          }
        }
      })
      .state('bonita.userDetails.customInfo', {
        url: '/custom-information',
        templateUrl: 'features/admin/organisation/users/details/custom-information/index.html',
        controller: 'UserCustomInfoCtrl as vm',
        resolve: {
          customInformation: function (customUserInfoAPI, $stateParams) {
            return customUserInfoAPI.search({p: 0, c: 100, f: 'userId=' + $stateParams.id})
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
