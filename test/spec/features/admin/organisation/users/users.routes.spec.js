(function () {
  'use strict';

  /* jshint camelcase: false */
  describe('users routes', () => {

    let $state, userAPI, $q, $rootScope;

    beforeEach(module('org.bonitasoft.features.admin.organisation.users', ($stateProvider) => {
      $stateProvider.state('bonita', {}); // simulate bonita parent state
    }));

    beforeEach(inject(function (_$state_, _userAPI_, _$q_, _$rootScope_) {
      $state = _$state_;
      userAPI = _userAPI_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    it('should define a user detail state and resolve associated data', done => {
      let expectedUser = {id: 42, firstname: 'John', lastname: 'Doe', manager_id: {id: 34}};
      spyOn(userAPI, 'get').and.returnValue({$promise: $q.when(expectedUser)});

      let state = $state.get('bonita.userDetails');

      expect(state.url).toEqual('/admin/organisation/users/:id');
      expect(state.controller).toEqual('UserDetailsCtrl as vm');
      expect(state.templateUrl).toEqual('features/admin/organisation/users/details/index.html');
      state.resolve.user(userAPI, expectedUser.id).then(user => {
          expect(user).toEqual(expectedUser);
          done();
        });
      $rootScope.$apply();
    });

    it('should reset the user manager field when user has no manager', done => {
      let expectedUser = {id: 3, manager_id: '0'};
      spyOn(userAPI, 'get').and.returnValue({$promise: $q.when(expectedUser)});

      let state = $state.get('bonita.userDetails');

      state.resolve.user(userAPI, expectedUser.id).then(user => {
        expect(user.manager_id).toBeUndefined();
        done();
      });
      $rootScope.$apply();
    });

    it('should define a user detail business card state', () => {

      let state = $state.get('bonita.userDetails.businessCard');

      expect(state.url).toEqual('/business-card');
      expect(state.templateUrl).toEqual('features/admin/organisation/users/details/business-card/index.html');
    });

    it('should define a user detail personal information state', () => {

      let state = $state.get('bonita.userDetails.personalInfo');

      expect(state.url).toEqual('/personal-information');
      expect(state.templateUrl).toEqual('features/admin/organisation/users/details/personal-information/index.html');
    });

  });
})();
