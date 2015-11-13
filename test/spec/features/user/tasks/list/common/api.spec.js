'use strict';

describe('API', function() {

  var $httpBackend;
  var apiRegexp = /^\.\.\/API\/([\w]+\/)+/;
  var Resources = {};

  beforeEach(module('common.resources'));

  beforeEach( inject( function($injector) {
    $httpBackend = $injector.get('$httpBackend');
  }));



  ['FlowNode', 'Process', 'HumanTask', 'Case', 'User', 'Membership', 'ProfessionalData', 'PersonalData'].forEach(function(model) {

    beforeEach(inject(function($injector) {
      Resources[model] = $injector.get(model);
    }));


    it('should get '+model+' specified by the id', function () {
      $httpBackend.expectGET(apiRegexp).respond({
        id: 123
      });

      var item = Resources[model].get({ id: 123 });
      $httpBackend.flush();

      expect(item.id).toBe(123);
    });


    it('should search a '+model+' and return the results and its pagination', function () {

      $httpBackend.expectGET(apiRegexp).respond(function () {
        return [200, [{ id: 1 }, { id: 2 }], {'Content-Range': '0-10/10'}];
      });

      var items = Resources[model].search({ p: 0, c: 10 });
      $httpBackend.flush();
      expect(items.length).toEqual(2);
      expect(items[0].id).toEqual(1);
      expect(items[1].id).toEqual(2);
      expect(items. pagination).toEqual({ total : 10, index : 0, currentPage : 1, numberPerPage : 10 });

    });

    it('should not throw exception if no content-range are provided', function() {
      $httpBackend.expectGET(apiRegexp).respond(function () {
        return [200, [], {}];
      });

      var items = Resources[model].search({ p: 0, c: 10 });
      $httpBackend.flush();

      expect(items.pagination).toEqual({});

    });

  });
});
