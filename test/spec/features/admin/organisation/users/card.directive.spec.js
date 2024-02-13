(() => {
  'use strict';

  describe('card directive', () => {

    let element, scope;

    beforeEach(module('org.bonitasoft.features.admin.organisation.users', 'org.bonitasoft.templates'));

    beforeEach(inject(function ($compile, $rootScope) {
      scope = $rootScope.$new();

      let template = '<bo-card card-data="cardData" on-save="save" button-text="{{ buttonText }}"> </bo-card>';
      element = $compile(template)(scope);
      scope.$apply();
    }));

    it('should display cardata fields into inputs', () => {
      /* jshint camelcase: false */
      scope.cardData = {
        address: 'Renwick Drive',
        city: 'Grenoble',
        country: 'France',
        email: 'walter.bates@acme.com',
        mobile_number: '0707070707',
        phone_number: '0606060606',
        state: 'PA',
        zipcode: '19108',
      };
      scope.$apply();


      expect(element.find('input#address').val()).toEqual('Renwick Drive');
      expect(element.find('input#city').val()).toEqual('Grenoble');
      expect(element.find('input#country').val()).toEqual('France');
      expect(element.find('input#zipcode').val()).toEqual('19108');
      expect(element.find('input#state').val()).toEqual('PA');
      expect(element.find('input#email').val()).toEqual('walter.bates@acme.com');
      expect(element.find('input#phone_number').val()).toEqual('0606060606');
      expect(element.find('input#mobile_number').val()).toEqual('0707070707');
    });

    it('should display a save button with the according text', () => {
      scope.buttonText = 'Save button text';
      scope.$apply();

      expect(element.find('button.btn-primary').text()).toEqual('Save button text');
    });

    it('should call the save method when clicking on save button', () => {
      scope.save = jasmine.createSpy('save');
      scope.cardData = {id: 42};
      scope.$apply();

      element.find('button.btn-primary').click();

      expect(scope.save).toHaveBeenCalledWith(scope.cardData);
    });
  });

})();
