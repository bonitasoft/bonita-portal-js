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

/* global cases, sessionsMock, describe  */
(function() {
  'use strict';
  describe('user cases list features', function() {

    var scope, sessionAPI, caseAPI, humanTaskAPI, fullCases, q, caseDeferred, casePromise, humanTaskDeferred, humanTaskPromise, sessionDeferred, sessionPromise, casesCtrl;

    beforeEach(module('org.bonitasoft.features.user.cases.list.table'));

    beforeEach(inject(function($rootScope, $q) {
      //we use the casesListMocks.js in order to init data for the test
      fullCases = {
        resource: cases
      };
      fullCases.resource.pagination = {
        total: 4
      };
      q = $q;
      scope = $rootScope.$new();
      caseDeferred = q.defer();
      casePromise = caseDeferred.promise;
      humanTaskDeferred = q.defer();
      humanTaskPromise = humanTaskDeferred.promise;
      sessionDeferred = q.defer();
      sessionPromise = sessionDeferred.promise;

      caseAPI = jasmine.createSpyObj('caseAPI', ['search']);
      caseAPI.search.and.returnValue({
        $promise: casePromise
      });
      humanTaskAPI = jasmine.createSpyObj('humanTaskAPI', ['search']);
      humanTaskAPI.search.and.returnValue({
        $promise: humanTaskPromise
      });
      sessionAPI = jasmine.createSpyObj('sessionAPI', ['get']);
      sessionAPI.get.and.returnValue({
        $promise: sessionPromise
      });
      angular.module('org.bonitasoft.features.user.cases.list.table').value('tabName', 'active');
    }));

    describe('controller initialization ', function() {

      var defaultPageSize = 1000;
      var defaultSort = 'id';
      var defaultDeployedFields = ['titi', 'tata', 'toto'];
      var defaultActiveCounterFields = ['failed', 'ongoing'];

      describe('with incorrect columns', function() {
        beforeEach(inject(function($controller) {
          casesCtrl = $controller('ActiveCaseListUserCtrl', {
            '$scope': scope,
            'sessionAPI': sessionAPI,
            'caseAPI': caseAPI,
            'humanTaskAPI': humanTaskAPI,
            'defaultPageSize': defaultPageSize,
            'casesUserColumns': [{
              name: 'AppName',
              sortName: 'name',
              path: ['processDefinitionId', 'name']
            }, {
              name: 'Version',
              sortName: 'version',
              path: ['processDefinitionIdsdf', 'version']
            }, {
              name: 'CaseId',
              sortName: 'id',
              path: ['idsdf']
            }],
            'defaultSort': defaultSort,
            'defaultDeployedFields': defaultDeployedFields,
            'defaultActiveCounterFields': defaultActiveCounterFields,

            'processId': undefined,
            'supervisorId': undefined,
            'tabName': 'active',
            'caseStateFilter': ''
          });
        }));
        it('should not display all fields', function() {
          caseDeferred.resolve(fullCases);
          sessionDeferred.resolve(sessionsMock['william.jobs']);
          humanTaskDeferred.resolve({resource:{pagination:{total:1}}});
          scope.$apply();
          expect(scope.cases).toBeDefined();
          expect(scope.cases.length).toBe(4);
          for (var j = 0; j < scope.cases.length; j++) {
            var singleCase = scope.cases[j];
            expect(singleCase[scope.columns[0].name]).toBeTruthy();
            expect(singleCase[scope.columns[1].name]).toBeFalsy();
            expect(singleCase[scope.columns[2].name]).toBeFalsy();
          }
          /* jshint camelcase: false */
          expect(caseAPI.search).toHaveBeenCalledWith({
            p: 0,
            c: 1000,
            d: [ 'titi',
            'tata',
            'toto' ],
            o: 'id ASC',
            f: [ 'user_id=30' ],
            n: [ 'failed',
            'ongoing' ],
            s: undefined
          });
          /* jshint camelcase: true */
        });
      });

      describe('with correct columns', function() {

        beforeEach(inject(function($controller) {
          $controller('ActiveCaseListUserCtrl', {
            '$scope': scope,
            'sessionAPI': sessionAPI,
            'caseAPI': caseAPI,
            'humanTaskAPI': humanTaskAPI,
            'defaultPageSize': defaultPageSize,
            'defaultSort': defaultSort,
            'defaultDeployedFields': defaultDeployedFields,
            'defaultActiveCounterFields': defaultActiveCounterFields,
            'tabName':undefined,
            'processId': undefined,
            'supervisorId': undefined,
            'caseStateFilter': 'error'
          });
        }));

        it('should fill the scope cases', inject(function() {
          var williamJobsSession = sessionsMock['william.jobs'];
          caseDeferred.resolve(fullCases);
          sessionDeferred.resolve(williamJobsSession);
          humanTaskDeferred.resolve({resource:{pagination:{total:1}}});
          scope.$apply();
          expect(scope.cases).toBeDefined();
          expect(scope.cases.length).toBe(4);
          for (var j = 0; j < scope.cases.length; j++) {
            var singleCase = scope.cases[j];
            for (var k = 0; k < scope.cases.length; k++) {
              expect(singleCase[scope.columns[k].name]).toBeTruthy();
            }
          }
          /* jshint camelcase: false */
          expect(caseAPI.search).toHaveBeenCalledWith({
            p: 0,
            c: defaultPageSize,
            o: defaultSort + ' ASC',
            d: defaultDeployedFields,
            f: ['state=error','user_id='+williamJobsSession.user_id],
            n: defaultActiveCounterFields,
            s: undefined
          });
          /* jshint camelcase: true */
        }));
      });
    });

    describe('handleHttpErrorEvent', function() {
      var mockedLocation = jasmine.createSpyObj('$location', ['url']);
      beforeEach(inject(function($controller) {
        casesCtrl = $controller('ActiveCaseListUserCtrl', {
          '$scope': scope,
          'sessionAPI': sessionAPI,
          'caseAPI': caseAPI,
          'humanTaskAPI': humanTaskAPI,
          '$location': mockedLocation,
          'processId': undefined,
          'supervisorId': 1,
          'caseStateFilter': ''
        });
        spyOn(scope, '$emit');
      }));
      it('should redirect to / when error contains a 401 status', function() {
        casesCtrl.handleHttpErrorEvent(undefined, {
          status: 401
        });
        expect(mockedLocation.url).toHaveBeenCalled();
      });
      it('should send a notification event with an error message', function() {
        var error = {
          status: 500,
          statusText: 'TestError'
        };
        casesCtrl.handleHttpErrorEvent(undefined, error);
        expect(scope.$emit).toHaveBeenCalledWith('caselist:notify', {
          status: error.status,
          statusText: error.statusText,
          type: 'danger'
        });
      });
      it('should send a notification event with an error message that hold detail information', function() {
        var error = {
          status: 500,
          statusText: 'TestError',
          data: {
            message: 'unvalid data',
            api: 'API/bpm',
            resource: 'flownode'
          }
        };
        casesCtrl.handleHttpErrorEvent(undefined, error);
        expect(scope.$emit).toHaveBeenCalledWith('caselist:notify', {
          status: error.status,
          statusText: error.statusText,
          type: 'danger',
          errorMsg: error.data.message,
          resource: 'API/bpm/flownode'
        });
      });
    });

    describe('updateSortField', function() {
      beforeEach(inject(function($controller) {
        casesCtrl = $controller('ActiveCaseListUserCtrl', {
          '$scope': scope,
          'sessionAPI': sessionAPI,
          'caseAPI': caseAPI,
          'humanTaskAPI': humanTaskAPI,
          'processId': undefined,
          'supervisorId': undefined,
          'caseStateFilter': ''
        });
      }));
      it('should change searchSort value', function() {
        scope.pagination.currentPage = 8;
        expect(scope.searchOptions.searchSort).toEqual('id ASC');
        casesCtrl.updateSortField({
          property: 'name',
          direction: false
        });
        expect(scope.pagination.currentPage).toBe(1);
        expect(scope.searchOptions.searchSort).toEqual('name DESC');

        casesCtrl.updateSortField({
          property: 'name',
          direction: true
        });
        expect(scope.pagination.currentPage).toBe(1);
        expect(scope.searchOptions.searchSort).toEqual('name ASC');

        casesCtrl.updateSortField({
          property: 'version',
          direction: false
        });
        expect(scope.searchOptions.searchSort).toEqual('version DESC');
        expect(scope.pagination.currentPage).toBe(1);
      });
      it('should do nothing if nothing is pass', function() {
        scope.pagination.currentPage = 8;
        expect(scope.searchOptions.searchSort).toEqual('id ASC');
        casesCtrl.updateSortField();
        expect(scope.pagination.currentPage).toBe(8);
        expect(scope.searchOptions.searchSort).toEqual('id ASC');
      });
      it('should set sort to default if strange things are passed', function() {
        scope.pagination.currentPage = 8;
        scope.searchOptions.searchSort = 'name ASC';
        casesCtrl.updateSortField({});
        expect(scope.pagination.currentPage).toBe(1);
        expect(scope.searchOptions.searchSort).toEqual('id ASC');
        scope.searchOptions.searchSort = 'name DESC';
        scope.pagination.currentPage = 8;
        casesCtrl.updateSortField({
          test: 'pouet',
          direction: false
        });

        expect(scope.pagination.currentPage).toBe(1);
        expect(scope.searchOptions.searchSort).toEqual('id DESC');
        scope.searchOptions.searchSort = 'id DESC';
        scope.pagination.currentPage = 8;
        casesCtrl.updateSortField({
          property: 'name',
          fsdfr: false
        });
        expect(scope.pagination.currentPage).toBe(1);
        expect(scope.searchOptions.searchSort).toEqual('name ASC');
      });
    });

    describe('top url behaviour', function() {
      describe('go to case details', function() {
        var mockedWindow,
          manageTopUrl = jasmine.createSpyObj('manageTopUrl', ['getPath', 'getSearch', 'getCurrentProfile']);
        beforeEach(function() {
          mockedWindow = {
            top: {
              location: {}
            }
          };
        });

        describe(' user', function() {
          beforeEach(inject(function($controller) {
            casesCtrl = $controller('ActiveCaseListUserCtrl', {
              '$scope': scope,
              '$window': mockedWindow,
              'manageTopUrl': manageTopUrl,
              'moreDetailToken': 'casemoredetails',
              'processId': undefined,
              'supervisorId': undefined,
              'caseStateFilter': ''
            });
            manageTopUrl.getPath.calls.reset();
            manageTopUrl.getSearch.calls.reset();
            manageTopUrl.getCurrentProfile.calls.reset();
          }));
          it('should change top location hash to case detail', function() {
            expect(casesCtrl.getLinkToCase()).toBeUndefined();
          });

          it('should change top location hash to case detail', function() {
            manageTopUrl.getPath.and.returnValue('/bonita/portal/homepage');
            manageTopUrl.getSearch.and.returnValue('?tenant=1');
            manageTopUrl.getCurrentProfile.and.returnValue('_pf=2');
            var caseItem = {
              id: 123,
              processDefinitionId: {
                id: 321
              }
            };
            expect(casesCtrl.getLinkToCase(caseItem)).toEqual('/bonita/portal/homepage?tenant=1#?id=123&_p=casemoredetails&_pf=2');
            caseItem = {
              id: '4568',
              processDefinitionId: {
                id: 3987
              }
            };
            casesCtrl.getLinkToCase(caseItem);
            expect(casesCtrl.getLinkToCase(caseItem)).toEqual('/bonita/portal/homepage?tenant=1#?id=4568&_p=casemoredetails&_pf=2');
            expect(manageTopUrl.getPath.calls.count()).toEqual(3);
            expect(manageTopUrl.getSearch.calls.count()).toEqual(3);
            expect(manageTopUrl.getCurrentProfile.calls.count()).toEqual(3);
          });
        });
      });

      describe('page changes', function() {
        var defaultPageSize = 2;
        var defaultSort = 'id';
        var defaultDeployedFields = ['titi', 'tata', 'toto'];
        var anchorScroll = jasmine.createSpy();
        var defaultActiveCounterFields = ['failed', 'ongoing'];

        beforeEach(inject(function($controller) {
          casesCtrl = $controller('ActiveCaseListUserCtrl', {
            '$scope': scope,

            'sessionAPI': sessionAPI,
            'caseAPI': caseAPI,
            'humanTaskAPI': humanTaskAPI,
            'defaultPageSize': defaultPageSize,
            'defaultSort': defaultSort,
            'defaultDeployedFields': defaultDeployedFields,
            'casesColumns': [{
              name: 'AppName',
              sortName: 'name',
              path: ['processDefinitionId', 'name']
            }, {
              name: 'Version',
              sortName: 'version',
              path: ['processDefinitionId', 'version']
            }, {
              name: 'CaseId',
              sortName: 'id',
              path: ['id']
            }],
            '$anchorScroll': anchorScroll,
            'defaultActiveCounterFields': defaultActiveCounterFields,
            'processId': undefined,
            'supervisorId': undefined,
            'caseStateFilter': ''
          });
          spyOn(scope, '$emit');
        }));
        it('should send a notification error when the search fails', function() {
          scope.pagination.total = 300;
          scope.currentFirstResultIndex = 10;
          scope.currentLastResultIndex = 1321;
          var error = {
            status: 401
          };
          caseDeferred.reject(error);
          sessionDeferred.resolve(sessionsMock['william.jobs']);
          scope.$apply();
          expect(scope.pagination.total).toBe(0);
          expect(scope.currentFirstResultIndex).toBe(0);
          expect(scope.currentLastResultIndex).toBe(0);
          expect(scope.$emit.calls.allArgs()).toEqual([
            ['caselist:http-error', error]
          ]);
        });
        it('should call next Page without sort', function() {
          caseDeferred.resolve(fullCases);
          sessionDeferred.resolve(sessionsMock['william.jobs']);
          scope.$apply();
          expect(scope.currentFirstResultIndex).toBe(1);
          expect(scope.currentLastResultIndex).toBe(2);
          scope.pagination.currentPage++;
          // deferred = q.defer();
          // caseAPI.search.and.returnValue({$promise : deferred.promise.then()});
          // deferred.resolve(fullCases);
          casesCtrl.searchForCases();
          scope.$apply();
          expect(scope.currentFirstResultIndex).toBe(3);
          expect(scope.currentLastResultIndex).toBe(4);
          expect(anchorScroll).toHaveBeenCalled();
          expect(caseAPI.search.calls.allArgs()).toEqual([
            [{
              p: 0,
              c: defaultPageSize,
              d: defaultDeployedFields,
              o: defaultSort + ' ASC',
              f: [ 'user_id=30' ],
              n: defaultActiveCounterFields,
              s: undefined
            }],
            [{
              p: 1,
              c: defaultPageSize,
              d: defaultDeployedFields,
              o: defaultSort + ' ASC',
              f: [ 'user_id=30' ],
              n: defaultActiveCounterFields,
              s: undefined
            }],
          ]);
        });
        it('should call search twice on second page with second call faster than the first, the second result should be displayed', function() {
          sessionDeferred.resolve(sessionsMock['william.jobs']);
          scope.$apply();
          scope.pagination.currentPage++;
          var secondDeferred = q.defer();
          caseAPI.search.and.returnValue({
            $promise: secondDeferred.promise,
            id: 1
          });
          casesCtrl.searchForCases();
          var results = cases.slice(2, 4);
          results.pagination = fullCases.resource.pagination;
          secondDeferred.resolve({
            resource: results
          });
          scope.$apply();
          results = cases.slice(0, 2);
          results.pagination = fullCases.resource.pagination;
          caseDeferred.resolve({
            resource: results
          });
          scope.$apply();
          expect(scope.cases[0].id).toBe('2');
          expect(scope.cases[1].id).toBe('4');
          expect(scope.cases.length).toBe(2);
          expect(scope.currentFirstResultIndex).toBe(3);
          expect(scope.currentLastResultIndex).toBe(4);
        });
        it('should call search twice with second call faster than the first, the second result should be displayed', function() {
          sessionDeferred.resolve(sessionsMock['william.jobs']);
          scope.$apply();
          var secondDeferred = q.defer();
          caseAPI.search.and.returnValue({
            $promise: secondDeferred.promise,
            id: 1
          });
          casesCtrl.searchForCases();
          var results = cases.slice(2, 4);
          results.pagination = {
            total: 20
          };
          sessionDeferred.resolve(sessionsMock['william.jobs']);
          secondDeferred.resolve({
            resource: results
          });
          scope.$apply();
          results = cases.slice(0, 2);
          results.pagination = {
            total: 6
          };
          caseDeferred.resolve({
            resource: results
          });

          scope.$apply();
          expect(scope.cases[0].id).toBe('2');
          expect(scope.cases[1].id).toBe('4');
          expect(scope.cases.length).toBe(2);
          expect(scope.currentFirstResultIndex).toBe(1);
          expect(scope.currentLastResultIndex).toBe(2);
          expect(scope.pagination.total).toBe(20);
        });
        it('should call next Page on current sort', function() {
          caseDeferred.resolve(fullCases);
          sessionDeferred.resolve(sessionsMock['william.jobs']);
          scope.$apply();
          scope.searchOptions.searchSort = 'name DESC';
          scope.$apply();
          expect(scope.currentFirstResultIndex).toBe(1);
          expect(scope.currentLastResultIndex).toBe(2);
          expect(anchorScroll).toHaveBeenCalled();
          scope.pagination.currentPage++;
          casesCtrl.searchForCases();
          scope.$apply();
          expect(scope.currentFirstResultIndex).toBe(3);
          expect(scope.currentLastResultIndex).toBe(4);
          expect(anchorScroll).toHaveBeenCalled();
          scope.pagination.currentPage--;
          casesCtrl.searchForCases();
          scope.$apply();
          expect(scope.currentFirstResultIndex).toBe(1);
          expect(scope.currentLastResultIndex).toBe(2);
          expect(anchorScroll).toHaveBeenCalled();
          scope.searchOptions.searchSort = 'version ASC';
          scope.$apply();
          expect(scope.currentFirstResultIndex).toBe(1);
          expect(scope.currentLastResultIndex).toBe(2);
          expect(anchorScroll).toHaveBeenCalled();

          expect(caseAPI.search.calls.allArgs()).toEqual([
            [{
              p: 0,
              c: defaultPageSize,
              o: defaultSort + ' ASC',
              d: defaultDeployedFields,
              f: [ 'user_id=30' ],
              n: defaultActiveCounterFields,
              s: undefined
            }],
            [{
              p: 0,
              c: defaultPageSize,
              o: 'name DESC',
              d: defaultDeployedFields,
              f: [ 'user_id=30' ],
              n: defaultActiveCounterFields,
              s: undefined
            }],
            [{
              p: 1,
              c: defaultPageSize,
              o: 'name DESC',
              d: defaultDeployedFields,
              f: [ 'user_id=30' ],
              n: defaultActiveCounterFields,
              s: undefined
            }],
            [{
              p: 0,
              c: defaultPageSize,
              o: 'name DESC',
              d: defaultDeployedFields,
              f: [ 'user_id=30' ],
              n: defaultActiveCounterFields,
              s: undefined
            }],
            [{
              p: 0,
              c: defaultPageSize,
              o: 'version ASC',
              d: defaultDeployedFields,
              f: [ 'user_id=30' ],
              n: defaultActiveCounterFields,
              s: undefined
            }]
          ]);
        });
      });

      describe('when tableState changes', function() {
        describe('casesSearch', function() {
          var defaultPageSize = 1000;
          var defaultSort = 'id';
          var defaultDeployedFields = ['titi', 'tata', 'toto'];
          var anchorScroll = jasmine.createSpy();
          var defaultActiveCounterFields = ['failed', 'ongoing'];

          beforeEach(inject(function($controller) {
            casesCtrl = $controller('ActiveCaseListUserCtrl', {
              '$scope': scope,
              'sessionAPI': sessionAPI,
              'caseAPI': caseAPI,
              'humanTaskAPI': humanTaskAPI,
              'defaultPageSize': defaultPageSize,
              'defaultSort': defaultSort,
              'defaultDeployedFields': defaultDeployedFields,
              'casesColumns': [{
                name: 'AppName',
                sortName: 'name',
                path: ['processDefinitionId', 'name']
              }, {
                name: 'Version',
                sortName: 'version',
                path: ['processDefinitionId', 'version']
              }, {
                name: 'CaseId',
                sortName: 'id',
                path: ['id']
              }],
              '$anchorScroll': anchorScroll,
              'defaultActiveCounterFields': defaultActiveCounterFields,
              'processId': undefined,
              'supervisorId': undefined,
              'caseStateFilter': ''
            });
          }));
          it('should call default sort on empty tableState', function() {
            caseDeferred.resolve(fullCases);
            sessionDeferred.resolve(sessionsMock['william.jobs']);
            scope.$apply();
            expect(anchorScroll).toHaveBeenCalled();

            expect(caseAPI.search.calls.allArgs()).toEqual([
              [{
                p: 0,
                c: defaultPageSize,
                o: defaultSort + ' ASC',
                d: defaultDeployedFields,
                f: [ 'user_id=30' ],
                n: defaultActiveCounterFields,
                s: undefined
              }]
            ]);
            expect(anchorScroll).toHaveBeenCalled();
          });
          it('should call search on application name sort desc', function() {
            sessionDeferred.resolve(sessionsMock['william.jobs']);
            caseDeferred.resolve(fullCases);
            scope.$apply();
            scope.searchOptions.searchSort = 'name DESC';
            scope.$apply();
            expect(anchorScroll).toHaveBeenCalled();
            scope.searchOptions.searchSort = 'name ASC';
            scope.$apply();
            expect(anchorScroll).toHaveBeenCalled();
            scope.searchOptions.searchSort = 'version DESC';
            scope.$apply();
            expect(anchorScroll).toHaveBeenCalled();
            expect(caseAPI.search.calls.allArgs()).toEqual([
              [{
                p: 0,
                c: defaultPageSize,
                o: 'id ASC',
                d: defaultDeployedFields,
                f: [ 'user_id=30' ],
                n: defaultActiveCounterFields,
                s: undefined
              }],
              [{
                p: 0,
                c: defaultPageSize,
                o: 'name DESC',
                d: defaultDeployedFields,
                f: [ 'user_id=30' ],
                n: defaultActiveCounterFields,
                s: undefined
              }],
              [{
                p: 0,
                c: defaultPageSize,
                o: 'name ASC',
                d: defaultDeployedFields,
                f: [ 'user_id=30' ],
                n: defaultActiveCounterFields,
                s: undefined
              }],
              [{
                p: 0,
                c: defaultPageSize,
                o: 'version DESC',
                d: defaultDeployedFields,
                f: [ 'user_id=30' ],
                n: defaultActiveCounterFields,
                s: undefined
              }]
            ]);

          });
        });
      });
      describe('when server returns an error on case search', function() {

        describe('about 401 unauthorized', function() {
          it('should redirect to the login page', inject(function($controller) {
            var location = {
              url: function() {}
            };
            spyOn(location, 'url').and.callThrough();
            casesCtrl = $controller('ActiveCaseListUserCtrl', {
              '$scope': scope,
              '$location': location,
              'processId': undefined,
              'supervisorId': undefined,
              'caseStateFilter': ''
            });
            spyOn(casesCtrl, 'addAlertEventHandler');
            casesCtrl.handleHttpErrorEvent(undefined, {
              status: 401
            });
            expect(location.url).toHaveBeenCalled();
            expect(location.url.calls.allArgs()).toEqual([
              ['/']
            ]);
          }));
        });
        describe('about 500 Internal Error', function() {
          it('should redirect to the login page', inject(function($controller) {
            var error = {
              status: 500,
              statusText: 'Internal Server Error',
              data: {
                resource: 'bpm/case',
                message: 'Invalid search !!'
              }
            };
            var growl = jasmine.createSpyObj('growl', ['success', 'error', 'info']);
            casesCtrl = $controller('ActiveCaseListUserCtrl', {
              '$scope': scope,
              'growl': growl,
              'processId': undefined,
              'supervisorId': undefined,
              'caseStateFilter': ''
            });
            spyOn(casesCtrl, 'addAlertEventHandler');
            casesCtrl.handleHttpErrorEvent(undefined, error);
            expect(growl.error).toHaveBeenCalled();
            expect(growl.error.calls.allArgs()).toEqual([
              [
                error.status + ' ' + error.statusText + ' ' + error.data.message, {
                  ttl: 3000,
                  disableCountDown: true,
                  disableIcons: true
                }
              ]
            ]);
          }));
        });
      });
    });

    describe('filter column ', function() {
      beforeEach(inject(function($controller) {
        casesCtrl = $controller('ActiveCaseListUserCtrl', {
          '$scope': scope,
          'processId': undefined,
          'supervisorId': undefined,
          'caseStateFilter': ''
        });
      }));
      it('should return false when column is not selected', function() {
        var column = {
          selected: false
        };
        expect(casesCtrl.filterColumn(column)).toBeFalsy();
      });
      it('should return true when column is selected', function() {
        var column = {
          selected: true
        };
        expect(casesCtrl.filterColumn(column)).toBeTruthy();
      });
    });

    describe('select nbItems in page ', function() {
      beforeEach(inject(function($controller) {
        casesCtrl = $controller('ActiveCaseListUserCtrl', {
          '$scope': scope,
          'processId': undefined,
          'supervisorId': undefined,
          'caseStateFilter': ''
        });
        spyOn(casesCtrl, 'searchForCases');
      }));
      it('should do nothing if nothing is passed', function() {
        var itemsPerPage = scope.itemsPerPage;
        casesCtrl.changeItemPerPage();
        expect(casesCtrl.searchForCases).not.toHaveBeenCalled();
        expect(scope.itemsPerPage).toBe(itemsPerPage);
      });
//      it('should change the number and reinit page number', function() {
//        var itemsPerPage = 50;
//        scope.currentPage = 2;
//        casesCtrl.changeItemPerPage(itemsPerPage);
//        expect(casesCtrl.searchForCases).toHaveBeenCalledWith();
//        expect(scope.pagination.itemsPerPage).toBe(itemsPerPage);
//        expect(scope.pagination.currentPage).toBe(1);
//      });
    });

    describe('addAlertEventHandler', function() {
      var growl = jasmine.createSpyObj('growl', ['success', 'error', 'info']);
      beforeEach(inject(function($controller) {
        casesCtrl = $controller('ActiveCaseListUserCtrl', {
          '$scope': scope,
          'growl': growl,
          'processId': undefined,
          'supervisorId': undefined,
          'caseStateFilter': ''
        });
      }));
      it('should call growl to add Notification error', function() {
        var error = {
          status: 500,
          statusText: 'Internal Server Error',
          errorMsg: 'Invalid search on bpm/case',
          type: 'danger'
        };
        casesCtrl.addAlertEventHandler(undefined, error);
        expect(growl.error).toHaveBeenCalled();
        expect(growl.error.calls.allArgs()).toEqual([
          [
            error.status + ' ' + error.statusText + ' ' + error.errorMsg, {
              ttl: 3000,
              disableCountDown: true,
              disableIcons: true
            }
          ]
        ]);
      });
      it('should call growl to add Notification success', function() {
        var error = {
          statusText: 'successfully deleted 1 case',
          type: 'success'
        };
        casesCtrl.addAlertEventHandler(undefined, error);
        expect(growl.success).toHaveBeenCalled();
        expect(growl.success.calls.allArgs()).toEqual([
          [
            error.statusText, {
              ttl: 3000,
              disableCountDown: true,
              disableIcons: true
            }
          ]
        ]);
      });
      it('should call growl to add Notification default', function() {
        var error = {
          statusText: 'successfully deleted 1 case'
        };
        casesCtrl.addAlertEventHandler(undefined, error);
        expect(growl.info).toHaveBeenCalled();
        expect(growl.info.calls.allArgs()).toEqual([
          [
            error.statusText, {
              ttl: 3000,
              disableCountDown: true,
              disableIcons: true
            }
          ]
        ]);
      });
    });

    describe('reinitCases', function() {
      it('should remove sort and set page to 1', inject(function($controller) {
        casesCtrl = $controller('ActiveCaseListUserCtrl', {
          '$scope': scope,
          'processId': undefined,
          'supervisorId': undefined,
          'caseStateFilter': ''
        });
        scope.searchOptions.searchSort = {};
        scope.pagination.currentPage = 10;
        spyOn(casesCtrl, 'searchForCases');
        casesCtrl.reinitCases();
        expect(scope.searchOptions.searchSort).toBeUndefined();
        expect(scope.pagination.currentPage).toBe(1);
        expect(casesCtrl.searchForCases).toHaveBeenCalledWith();
      }));
    });
    describe('filter updates', function() {
      beforeEach(inject(function($controller, $q) {
        var deferred = $q.defer();
        var localPromise = deferred.promise;
        sessionDeferred.resolve(sessionsMock['william.jobs']);
        deferred.resolve();
        casesCtrl = $controller('ActiveCaseListUserCtrl', {
          '$scope': scope,
          'store': {
            load: function() {
              return {
                then: function() {}
              };
            }
          },
          'sessionAPI': sessionAPI,
          'caseAPI': {
            search: function() {
              return {
                '$promise': localPromise
              };
            }
          },
          'processId': undefined,
          'supervisorId': undefined,
          'caseStateFilter': ''
        });
        scope.$apply();
        spyOn(casesCtrl, 'searchForCases');
      }));
      describe('watch on filters', function() {
        it('should call search when filters update', function() {
          scope.searchOptions.filters = [{}];
          scope.pagination.currentPage = 2;
          scope.$apply();
          expect(casesCtrl.searchForCases).toHaveBeenCalled();
          expect(scope.pagination.currentPage).toBe(1);
        });
        it('should not call search when processId is set', function() {
          scope.searchOptions.filters = [{}];
          scope.pagination.currentPage = 1;
          scope.selectedFilters.processId = 1;
          scope.$apply();
          expect(casesCtrl.searchForCases).not.toHaveBeenCalled();
          expect(scope.pagination.currentPage).toBe(1);
        });
      });
      describe('build filter', function() {
        it('should have process definition Id', function() {
          var processId = '2121354687951';
          scope.selectedFilters.selectedProcessDefinition = processId;
          casesCtrl.buildFilters();
          expect(scope.searchOptions.filters).toEqual(['processDefinitionId=' + processId]);
          expect(scope.pagination.currentPage).toBe(1);
        });
        it('should have process definition Id only even id app name is set', function() {
          var processId = '2121354687951';
          scope.selectedFilters.selectedProcessDefinition = processId;
          scope.selectedFilters.selectedApp = 'Process1';
          casesCtrl.buildFilters();
          expect(scope.searchOptions.filters).toEqual(['processDefinitionId=' + processId]);
          expect(scope.pagination.currentPage).toBe(1);
        });
        it('should have app name', function() {
          scope.$digest();
          var processName = 'Process1';
          scope.selectedFilters.selectedApp = processName;
          casesCtrl.buildFilters();
          expect(scope.searchOptions.filters).toEqual(['name=' + processName]);
          expect(scope.pagination.currentPage).toBe(1);
        });
      });
    });
    describe('onDropComplete', function() {
      beforeEach(inject(function($controller) {
        casesCtrl = $controller('ActiveCaseListUserCtrl', {
          '$scope': scope,
          'processId': undefined,
          'supervisorId': undefined,
          'caseStateFilter': ''
        });
      }));

      it('should put an element at the specified position and move the following ones', function() {
        var col1 = {
            id: 1
          },
          col2 = {
            id: 2
          },
          col3 = {
            id: 3
          },
          col4 = {
            id: 4
          },
          columns = [col1, col2, col3, col4];
        scope.columns = columns;
        casesCtrl.onDropComplete(1, col4);
        expect(scope.columns).toEqual([col1, col4, col2, col3]);
        scope.columns = [col1, col2, col3, col4];
        casesCtrl.onDropComplete(4, col1);
        expect(scope.columns).toEqual([col2, col3, col4, col1]);
        scope.columns = [col1, col2, col3, col4];
        casesCtrl.onDropComplete(0, col3);
        expect(scope.columns).toEqual([col3, col1, col2, col4]);
      });
    });
  });
})();

