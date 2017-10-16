(() => {
  'use strict';

  describe('user details controller', () => {

    let controller, scope, userAPI, professionalDataAPI, personalDataAPI, growl, $q, $timeout;

    beforeEach(module('org.bonitasoft.features.admin.organisation.users'));

    beforeEach(inject(function ($controller, $rootScope, _$q_, _$timeout_) {
      $q = _$q_;
      $timeout = _$timeout_;

      userAPI = jasmine.createSpyObj('userApi', ['update', 'search']);
      professionalDataAPI = jasmine.createSpyObj('professionalDataAPI', ['save']);
      personalDataAPI = jasmine.createSpyObj('personalDataAPI', ['save']);
      growl = jasmine.createSpyObj('growl', ['success', 'error']);

      userAPI.update.and.returnValue({$promise: $q.when({})});
      professionalDataAPI.save.and.returnValue({$promise: $q.when({})});
      personalDataAPI.save.and.returnValue({$promise: $q.when({})});

      scope = $rootScope.$new();

      controller = $controller('UserDetailsCtrl', {
        $scope: scope,
        user: {},
        userAPI: userAPI,
        professionalDataAPI: professionalDataAPI,
        personalDataAPI: personalDataAPI,
        growl: growl
      });
      scope.$apply();
    }));

    it('should save user\'s general information', () => {
      let user = {
        'firstname': 'Walter',
        'icon': '../API/avatars/202',
        'creation_date': '2017-09-14 16:20:13.130',
        'userName': 'walter.bates',
        'title': 'Mr',
        'created_by_user_id': '-1',
        'enabled': 'true',
        'lastname': 'Bates',
        'last_connection': '2017-09-22 17:12:02.647',
        'password': '',
        'id': '4',
        'job_title': 'Human resources benefits',
        'last_update_date': '2017-09-22 16:24:20.005',
        'manager_id': {id: 42}
      };

      controller.saveGeneralInformation(user);

      expect(userAPI.update).toHaveBeenCalledWith({
        /* jshint camelcase: false */
        id: user.id,
        title: user.title,
        firstname: user.firstname,
        lastname: user.lastname,
        userName: user.userName,
        job_title: user.job_title,
        manager_id: 42
      });
    });

    it('should toast a success message when user\'s general information is successfully updated', () => {
      userAPI.update.and.returnValue({$promise: $q.when({})});

      controller.saveGeneralInformation({});
      scope.$apply();

      expect(growl.success).toHaveBeenCalled();
    });

    it('should toast an error message when user\'s general information is not successfully updated', () => {
      userAPI.update.and.returnValue({$promise: $q.reject({})});

      controller.saveGeneralInformation({});
      scope.$apply();

      expect(growl.error).toHaveBeenCalled();
    });

    it('should save user\'s new password', () => {
      /* jshint camelcase: false */
      controller.user = {id: 42};

      controller.updatePassword({new: 'newPassword', confirm: 'newPassword'});

      expect(userAPI.update).toHaveBeenCalledWith({
        id: 42,
        password: 'newPassword',
        password_confirm: 'newPassword'
      });
    });

    it('should toast a success message when password is successfully updated', () => {
      userAPI.update.and.returnValue({$promise: $q.when({})});

      controller.updatePassword({});
      scope.$apply();

      expect(growl.success).toHaveBeenCalled();
    });

    it('should toast an error message when password is not successfully updated', () => {
      userAPI.update.and.returnValue({$promise: $q.reject({})});

      controller.updatePassword({});
      scope.$apply();

      expect(growl.error).toHaveBeenCalled();
    });

    it('should save user\'s business card', () => {
      /* jshint camelcase: false */
      let businessCard = {
          address: 'Renwick Drive',
          building: '70',
          city: 'Grenoble',
          country: 'France',
          email: 'walter.bates@acme.com',
          fax_number: '484-302-0000',
          id: '4',
          mobile_number: '',
          phone_number: '0606060606',
          room: '',
          state: 'PA',
          website: '',
          zipcode: '19108',
        }
      ;

      controller.saveBusinessCard(businessCard);

      expect(professionalDataAPI.save).toHaveBeenCalledWith(businessCard);
    });

    it('should toast a success message when user\'s business card is successfully updated', () => {
      professionalDataAPI.save.and.returnValue({$promise: $q.when({})});

      controller.saveBusinessCard({});
      scope.$apply();

      expect(growl.success).toHaveBeenCalled();
    });

    it('should toast an error message when user\'s business card is not successfully updated', () => {
      professionalDataAPI.save.and.returnValue({$promise: $q.reject({})});

      controller.saveBusinessCard({});
      scope.$apply();

      expect(growl.error).toHaveBeenCalled();
    });

    it('should save user\'s personal information', () => {
      /* jshint camelcase: false */
      let personalInfo = {
        address: 'Renwick Drive',
        building: '70',
        city: 'Grenoble',
        country: 'France',
        email: 'walter.bates@acme.com',
        fax_number: '484-302-0000',
        id: '4',
        mobile_number: '',
        phone_number: '0606060606',
        room: '',
        state: 'PA',
        website: '',
        zipcode: '19108',
      };

      controller.savePersonalInformation(personalInfo);

      expect(personalDataAPI.save).toHaveBeenCalledWith(personalInfo);
    });

    it('should toast a success message when user\'s personal information is successfully updated', () => {
      personalDataAPI.save.and.returnValue({$promise: $q.when({})});

      controller.savePersonalInformation({});
      scope.$apply();

      expect(growl.success).toHaveBeenCalled();
    });

    it('should toast an error message when user\'s personal information is not successfully updated', () => {
      personalDataAPI.save.and.returnValue({$promise: $q.reject({})});

      controller.savePersonalInformation({});
      scope.$apply();

      expect(growl.error).toHaveBeenCalled();
    });

    it('should search for managers', (done) => {
      userAPI.search.and.returnValue({$promise: $q.when({data: [{manager: 1}, {manager: 2}]})});

      controller.searchManagers('whatever')
        .then(managers => {
          expect(managers).toEqual([{manager: 1}, {manager: 2}]);
          done();
        });
      scope.$apply();
    });
  });

})();
