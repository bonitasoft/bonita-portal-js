(() => {
  'use strict';

  /* jshint camelcase: false */
  describe('user details controller', () => {

    let controller, scope, userAPI, growl, $q;

    beforeEach(module('org.bonitasoft.features.admin.organisation.users'));

    beforeEach(inject(function ($controller, $rootScope, _$q_) {
      $q = _$q_;

      userAPI = jasmine.createSpyObj('userAPI', ['update']);
      growl = jasmine.createSpyObj('growl', ['success', 'error']);

      userAPI.update.and.returnValue({$promise: $q.when({})});

      scope = $rootScope.$new();

      controller = $controller('UserDetailsCtrl', {
        $scope: scope,
        user: {},
        userAPI: userAPI,
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
        'last_update_date': '2017-09-22 16:24:20.005'
      };

      controller.saveGeneralInformation(user);

      expect(userAPI.update).toHaveBeenCalledWith({
        id: user.id,
        title: user.title,
        firstname: user.firstname,
        lastname: user.lastname,
        userName: user.userName,
        job_title: user.job_title
      });
    });

    it('should toast a success message when user\'s general information is successfully updated', () => {
      userAPI.update.and.returnValue({$promise: $q.when({})});

      controller.saveGeneralInformation({});
      scope.$apply();

      expect(growl.success).toHaveBeenCalled();
    });

    it('should toast a success message when user\'s general information is successfully updated', () => {
      userAPI.update.and.returnValue({$promise: $q.reject({})});

      controller.saveGeneralInformation({});
      scope.$apply();

      expect(growl.error).toHaveBeenCalled();
    });
  });

})();
