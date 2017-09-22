(function () {
  'use strict';

  describe('general section', () => {

    let scope, elm;

    beforeEach(module(
      'org.bonitasoft.features.admin.organisation.users',
      'org.bonitasoft.templates'
    ));

    beforeEach(inject(function ($templateCache, $compile, $rootScope) {
      var template = $templateCache.get('features/admin/organisation/users/details/general/index.html');
      scope = $rootScope.$new();
      elm = $compile(template)(scope);
      scope.$apply();
    }));

    it('should display user general information', () => {
      /* jshint camelcase: false */
      scope.vm = {
        user: {
          title: 'Mr',
          firstname: 'Walter',
          lastname: 'Bates',
          userName: 'walter.bates',
          job_title: 'Human resources benefits'
        }
      };
      scope.$apply();


      expect(elm.find('#title').val()).toBe('Mr');
      expect(elm.find('#firstname').val()).toBe('Walter');
      expect(elm.find('#lastname').val()).toBe('Bates');
      expect(elm.find('#username').val()).toBe('walter.bates');
      expect(elm.find('#jobtitle').val()).toBe('Human resources benefits');
    });

    it('should display user metadata', () => {
      /* jshint camelcase: false */
      scope.vm = {
        user: {
          last_connection: '2017-09-20 13:50:42.856',
          creation_date: '2017-09-14 16:20:13.130',
        }
      };
      scope.$apply();

      expect(elm.find('.UserMetadata dd:first').text()).toBe('September 20, 2017 1:50 PM');
      expect(elm.find('.UserMetadata dd:last').text()).toBe('September 14, 2017 4:20 PM');
    });

    it('should save user information', () => {
      let expectedUser = {id: 42, firstname: 'John', lastname: 'Doe'};
      scope.vm = {
        user: expectedUser,
        saveGeneralInformation: jasmine.createSpy('saveGeneralInformation')
      };
      scope.$apply();

      expect(elm.find('button.btn-primary').click());

      expect(scope.vm.saveGeneralInformation).toHaveBeenCalledWith(expectedUser);
    });

  });

})();
