(function () {
  'use strict';

  describe('users routes', () => {

    let $state, userAPI;

    beforeEach(module('org.bonitasoft.features.admin.organisation.users', ($stateProvider) => {
      $stateProvider.state('bonita', {}); // simulate bonita parent state
    }));

    beforeEach(inject(function (_$state_, _userAPI_) {
      $state = _$state_;
      userAPI = _userAPI_;
    }));

    it('should define a user detail state and resolve associated data', () => {
      let expectedUser = {id: 42, firstname: 'John', lastname: 'Doe'};
      spyOn(userAPI, 'get').and.returnValue(expectedUser);

      let state = $state.get('bonita.userDetails');

      expect(state.url).toEqual('/admin/organisation/users/:id');
      expect(state.controller).toEqual('UserDetailsCtrl as vm');
      expect(state.templateUrl).toEqual('features/admin/organisation/users/details/index.html');
      expect(state.resolve.user(userAPI, expectedUser.id)).toEqual(expectedUser);
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
