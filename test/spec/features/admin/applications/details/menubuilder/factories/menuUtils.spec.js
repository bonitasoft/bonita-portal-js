/** Copyright (C) 2015 Bonitasoft S.A.
 * Bonitasoft, 32 rue Gustave Eiffel - 38000 Grenoble
 * This library is free software; you can redistribute it and/or modify it under the terms
 * of the GNU Lesser General Public License as published by the Free Software Foundation
 * version 2.1 of the License.
 * This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public License along with this
 * program; if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth
 * Floor, Boston, MA 02110-1301, USA.
 */

(function () {
  'use strict';

  describe('Factory: utils', function () {

    var factory = {};
    beforeEach(module('org.bonitasoft.features.admin.applications.details'));

    beforeEach(inject(function ($injector) {
      factory = $injector.get('menuUtils');
    }));


    describe('findItemPerId: find an item per its id in a collection', function () {

      var collection = [{
        id: 1,
        name: 'toto1'
      },
      {
        id: 2,
        name: 'toto2'
      },
      {
        id: 3,
        name: 'toto3'
      }];

      it('should return an empty object if no elements', function () {
        var result = factory.findItemPerId(54, collection);
        expect(result).toBeDefined();
        expect(Object.keys(result).length).toBe(0);
      });

      it('should find an element', function () {
        var result = factory.findItemPerId(2, collection);
        expect(result).toBeDefined();
        expect(Object.keys(result).length).toBeGreaterThan(0);
      });

      it('should find the element with the valid id', function () {
        var result = {
          e1: factory.findItemPerId(1, collection),
          e2: factory.findItemPerId(2, collection),
          e3: factory.findItemPerId(3, collection)
        };

        expect(Object.keys(result.e1).length).toBeGreaterThan(0);
        expect(Object.keys(result.e2).length).toBeGreaterThan(0);
        expect(Object.keys(result.e3).length).toBeGreaterThan(0);

        expect(result.e1.name).toBe('toto1');
        expect(result.e2.name).toBe('toto2');
        expect(result.e3.name).toBe('toto3');
      });

    });

    describe('bindChildren: it should bind each children into an array L1', function () {

      var collection = [];
      //@TODO: Test return valid parent id
      beforeEach(function () {

        var i = 50,
            j = 10;
        var mock = {
          children: [],
          menuIndex: '01',
          parentMenuId: 0
        },
            mockGhost1, mockGhost2;

        while (--i >= 0) {
          mockGhost1 = angular.copy(mock);

          while (--j >= 0) {
            mockGhost2 = angular.copy(mock);
            mockGhost1.children.push(mockGhost2);
          }

          j = 10;
          collection.push(mockGhost1);
        }
      });

      it('should return an array', function () {
        expect(Array.isArray(factory.bindChildren(collection[0], []))).toBeTruthy();
      });

      it('should return an array of 10 values or 0 if no object', function () {
        expect(factory.bindChildren(collection[0], []).length).toBe(10);
        expect(factory.bindChildren(collection[12], []).length).toBe(10);
        expect(factory.bindChildren(collection[32], []).length).toBe(10);
        expect(factory.bindChildren(collection[122] || {}, []).length).toBe(0);
      });

      it('should return an array of object', function () {
        factory.bindChildren(collection[0], []).forEach(function (item) {
          expect(typeof item).toBe('object');
          expect(item.forEach).not.toBeDefined();
          expect(item.menuIndex).toBeDefined();
        });
      });

    });

  });
})();
