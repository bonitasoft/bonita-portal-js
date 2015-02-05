(function () {
  'use strict';

  describe('Factory: menuConvertor', function () {

    var factory;
    var mock = {
      id: '515',
      children: [],
      menuIndex: '01',
      parentMenuId: 0
    };

    beforeEach(module('com.bonita.features.admin.applications.details'));

    beforeEach(inject(function ($injector) {
      factory = $injector.get('menuConvertor');
    }));

    describe('We will convert our array for the API', function () {
      var collection = [];

      beforeEach(function () {
        var i = 50,
            j = 10,
            mockGhost1, mockGhost2;

        while (--i >= 0) {
          mockGhost1 = angular.copy(mock);
          mockGhost1.menuIndex = (i + 1);

          while (--j >= 0) {
            mockGhost2 = angular.copy(mock);
            mockGhost2.menuIndex = (i + 1);
            mockGhost1.children.push(mockGhost2);
          }

          j = 10;
          collection.push(mockGhost1);
        }
      });

      it('should create an array of each elements instead of parents', function () {
        expect(factory.buildIndex(collection).length).toBe(550);
      });

      it('should remove the key children', function () {
        var childrenExist = factory.buildIndex(collection).filter(function (item) {
          return item.children;
        });
        expect(childrenExist.length).toBe(0);
      });

    });

    describe('it should convert the data from API to our format', function () {

      var collection = [];

      beforeEach(function () {
        collection = [];
        var i = 10,
            j = 2,
            item;

        while (--i >= 0) {
          item = angular.copy(mock);
          delete item.children;
          item.parentMenuId = 0;
          item.id = i + 1;
          item.menuIndex = i + 1;
          collection.push(item);
        }

        while (--j >= 0) {
          item = angular.copy(mock);
          item.parentMenuId = j + 1;
          item.menuIndex = '1-' + j + 1;
          collection.push(item);
        }
      });

      it('should reduce the size of the menu', function () {
        var o = factory.fromApi(collection);
        expect(o.length).toBe(10);
      });

      it('should create the key children', function () {

        var c = factory.fromApi(collection);
        var childrenExist = c.filter(function (item) {
          return item.children;
        });
        expect(childrenExist.length).toBe(10);
      });

      it('should create the key children if no key children', function () {

        var c = factory.fromApi(collection.map(function (item) {
          delete item.children;
          return item;
        }));
        var childrenExist = c.filter(function (item) {
          return item.children;
        });
        expect(childrenExist.length).toBe(10);
      });


      it('should create the key children if applicationPageId = -1', function () {

        var c = factory.fromApi(collection.map(function (item) {
          item.applicationPageId = '-1';
          return item;
        }));
        var childrenExist = c.filter(function (item) {
          return item.children;
        });
        expect(childrenExist.length).toBe(10);
      });

    });

    describe('Consume a menuItem and produce a menuItem for the API', function () {

      it('should remove the key children and set parent to -1', function () {
        var c = factory.toApi({
          name: 'doe',
          children: []
        });

        expect(c.children).toBeUndefined();
        expect(c.parentMenuId).toBe('-1');
      });

      it('should keep the parent menu id to -1 if no child nor parent', function () {
        var c = factory.toApi({
          name: 'doe'
        });
        expect(c.parentMenuId).toBe('-1');
      });


      it('should keep the parent menu id to -1 if parentMenuId === -1', function () {
        var c = factory.toApi({
          name: 'doe',
          parentMenuId: '-1'
        });
        expect(c.parentMenuId).toBe('-1');
      });

      it('should keep the parent menu id to -1 if parentMenuId == 0', function () {
        var c = factory.toApi({
          name: 'doe',
          parentMenuId: 0
        });
        expect(c.parentMenuId).toBe('-1');
      });


      it('should keep the parent menu id to -1 if parentMenuId <0', function () {
        var c = factory.toApi({
          name: 'doe',
          parentMenuId: '-5'
        });
        expect(c.parentMenuId).toBe('-1');
      });
    });

  });
})();