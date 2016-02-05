/** Copyright (C) 2015 Bonitasoft S.A.
 * BonitaSoft, 31 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

(function () {
  'use strict';

  describe('Service: Menu factory', function () {
    var $httpBackend, service, loadRequest, applicationMenuAPI, menuConvertor, rootScope, qPromise;

    beforeEach(module('org.bonitasoft.features.admin.applications.details'));

    beforeEach(inject(function ($injector, $q) {
      service = $injector.get('menuFactory');
      $httpBackend = $injector.get('$httpBackend');
      applicationMenuAPI = $injector.get('applicationMenuAPI');
      menuConvertor = $injector.get('menuConvertor');
      rootScope = $injector.get('$rootScope');
      loadRequest = $q.defer();
      qPromise = $q;
    }));

    beforeEach(function () {
      // spyOn(console, 'debug');
      console.debug = angular.noop;
    });

    describe('When the service try to contact the API (mock)', function () {

      var store, rootScope;

      beforeEach(inject(function ($injector, $q, $rootScope) {

        rootScope = $rootScope;
        store = $injector.get('store');
        spyOn(store, 'load').and.returnValue(loadRequest.promise);

        function mockNgResource() {
          var deferred = $q.defer();
          return {
            $promise: deferred.promise
          };
        }

        spyOn(applicationMenuAPI, 'save').and.callFake(mockNgResource);
        spyOn(applicationMenuAPI, 'remove');
        spyOn(applicationMenuAPI, 'update').and.callFake(mockNgResource);

      }));

      it('should fetch some data from the API', function () {
        service.get(1);
        expect(store.load).toHaveBeenCalled();
        expect(store.load).toHaveBeenCalledWith(applicationMenuAPI, {
          f: 'applicationId=1',
          o: 'menuIndex ASC'
        });
      });

      it('should fetch some data from the API or throw an exception', function () {

        var ns = {
          res: function () {},
          rej: function () {}
        };
        spyOn(ns, 'res');
        spyOn(ns, 'rej');
        qPromise.when(service.get(1)).then(ns.res, ns.rej);

        loadRequest.reject();
        rootScope.$apply();

        expect(store.load).toHaveBeenCalled();
        expect(ns.rej).toHaveBeenCalledWith(new Error('Cannot find any data for the menu'));
      });

      it('should call applicationMenuAPI.remove on remove', function () {
        service.remove(1);
        expect(applicationMenuAPI.remove).toHaveBeenCalled();
        expect(applicationMenuAPI.remove).toHaveBeenCalledWith({
          id: 1
        });
      });

      it('should call applicationMenuAPI.update on update', function () {
        service.update({
          id: 1,
          name: 'robvert'
        });
        expect(applicationMenuAPI.update).toHaveBeenCalled();
        expect(applicationMenuAPI.update).toHaveBeenCalledWith({
          id: 1
        }, {
          id: 1,
          name: 'robvert',
          menuIndex: 1,
          parentMenuId: '-1'
        });
      });

      it('should call applicationMenuAPI.save for a new record', function () {
        service.create({
          id: 1,
          name: 'robvert'
        });
        expect(applicationMenuAPI.save).toHaveBeenCalled();
        expect(applicationMenuAPI.save).toHaveBeenCalledWith({
          id: 1,
          name: 'robvert',
          menuIndex: 1,
          parentMenuId: '-1'
        });

      });

    });


    describe('When we contact the webservice, emulate da HTTP', function () {

      beforeEach(function () {

        $httpBackend.when('GET', '../API/living/application-menu?f=applicationId%3D1&o=menuIndex+ASC&p=0').respond(200, ['de']);
        $httpBackend.when('GET', '../API/living/application-menu?c=0&f=applicationId%3D1&p=0').respond(200, ['de']);
        $httpBackend.when('GET', '../API/living/application-menu?c=0&f=applicationId%3D3&p=0').respond(200, ['de']);
        $httpBackend.when('GET', '../API/living/application-menu?c=0&f=applicationId%3D2&p=0').respond(200, ['de']);
      });

      it('should fetch some data from the API', function () {
        service.get(1);
      });

      it('should update and fetch some data from the API', function () {
        $httpBackend.when('PUT', '../API/living/application-menu/1').respond(200, {
          id: 1,
          name: 'test',
          applicationId: 2
        });
        $httpBackend.when('GET', '../API/living/application-menu?f=applicationId%3D2&o=menuIndex+ASC&p=0').respond(200, ['de']);
        service.update({
          id: 1,
          name: 'test',
          applicationId: 2
        });
      });


      it('should remove and fetch some data from the API', function () {
        $httpBackend.when('DELETE', '../API/living/application-menu/1').respond(200, {
          id: 1,
          name: 'test',
          applicationId: 2
        });

        service.remove(1);
      });


      it('should create and fetch some data from the API', function () {
        $httpBackend.when('POST', '../API/living/application-menu/1').respond(200, {
          id: 1,
          name: 'test',
          applicationId: 2
        });
        $httpBackend.when('GET', '../API/living/application-menu?f=applicationId%3D3&o=menuIndex+ASC&p=0').respond(200, ['de']);
        service.create({
          id: 1,
          name: 'test',
          applicationId: 3
        });
      });

      afterEach(function () {
        // $httpBackend.flush();
        // $httpBackend.verifyNoOutstandingExpectation();
      });

    });

  });
})();
