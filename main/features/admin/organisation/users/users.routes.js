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
      });
  }

})();
