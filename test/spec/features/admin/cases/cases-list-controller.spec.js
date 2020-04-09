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

/* global cases, describe  */
(function() {
  'use strict';
  describe('admin cases list features', function() {

    var scope, caseAPI, fullCases, promise, q, deferred, casesCtrl;

    beforeEach(module('org.bonitasoft.features.admin.cases.list.table'));

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
      deferred = q.defer();
      promise = deferred.promise;
      caseAPI = jasmine.createSpyObj('caseAPI', ['search']);
      caseAPI.search.and.returnValue({
        $promise: promise
      });
      angular.module('org.bonitasoft.features.admin.cases.list.table').value('tabName', 'active');
    }));

    describe('controller initialization', function() {

      var defaultPageSize = 1000;
      var defaultSort = 'id';
      var defaultDeployedFields = ['titi', 'tata', 'toto'];
      var defaultActiveCounterFields = ['failed', 'ongoing'];

      describe('with incorrect columns', function() {
        beforeEach(inject(function($controller) {
          casesCtrl = $controller('ActiveCaseListCtrl', {
            '$scope': scope,
            'caseAPI': caseAPI,
            'defaultPageSize': defaultPageSize,
            'defaultSort': defaultSort,
            'defaultDeployedFields': defaultDeployedFields,
            'defaultActiveCounterFields': defaultActiveCounterFields,
            'casesColumns': [{
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
            'processId': undefined,
            'supervisorId': undefined,
            'tabName': 'active',
            'caseStateFilter': ''
          });
          casesCtrl.loadContent();
        }));
        it('should not display all fields', function() {
          deferred.resolve(fullCases);
          scope.$apply();
          expect(scope.cases).toBeDefined();
          expect(scope.cases.length).toBe(4);
          for (var j = 0; j < scope.cases.length; j++) {
            var singleCase = scope.cases[j];
            expect(singleCase[scope.columns[0].name]).toBeTruthy();
            expect(singleCase[scope.columns[1].name]).toBeFalsy();
            expect(singleCase[scope.columns[2].name]).toBeFalsy();
          }
          expect(caseAPI.search).toHaveBeenCalledWith({
            p: 0,
            c: defaultPageSize,
            o: defaultSort + ' DESC',
            d: defaultDeployedFields,
            f: [],
            n: defaultActiveCounterFields,
            s: undefined
          });
        });
      });

      describe('with correct columns', function() {

        beforeEach(inject(function($controller) {
          casesCtrl = $controller('ActiveCaseListCtrl', {
            '$scope': scope,
            'caseAPI': caseAPI,
            'defaultPageSize': defaultPageSize,
            'defaultSort': defaultSort,
            'defaultDeployedFields': defaultDeployedFields,
            'defaultActiveCounterFields': defaultActiveCounterFields,
            'processId': undefined,
            'supervisorId': undefined,
            'caseStateFilter': 'error'
          });
          casesCtrl.loadContent();
        }));

        it('should fill the scope cases', inject(function() {
          deferred.resolve(fullCases);

          scope.$apply();
          expect(scope.cases).toBeDefined();
          expect(scope.cases.length).toBe(4);
          for (var j = 0; j < scope.cases.length; j++) {
            var singleCase = scope.cases[j];
            for (var k = 0; k < scope.cases.length; k++) {
              expect(singleCase[scope.columns[k].name]).toBeTruthy();
            }
          }
          expect(caseAPI.search).toHaveBeenCalledWith({
            p: 0,
            c: defaultPageSize,
            o: defaultSort + ' DESC',
            d: defaultDeployedFields,
            f: [],
            n: defaultActiveCounterFields,
            s: undefined
          });
        }));
      });
      describe('when supervisor', function() {
        describe(' is set', function() {
          beforeEach(inject(function($controller) {
            $controller('ActiveCaseListCtrl', {
              '$scope': scope,
              'caseAPI': caseAPI,
              'defaultPageSize': defaultPageSize,
              'defaultSort': defaultSort,
              'defaultDeployedFields': defaultDeployedFields,
              'defaultActiveCounterFields': defaultActiveCounterFields,
              'processId': undefined,
              'supervisorId': 1,
              'caseStateFilter': ''
            });
          }));

          it('should fill ths filters with supervisor_id', inject(function() {
            expect(scope.searchOptions.filters).toEqual(['supervisor_id=1']);
          }));
        });
        describe(' is not set', function() {
          beforeEach(inject(function($controller) {
            $controller('ActiveCaseListCtrl', {
              '$scope': scope,
              'caseAPI': caseAPI,
              'defaultPageSize': defaultPageSize,
              'defaultSort': defaultSort,
              'defaultDeployedFields': defaultDeployedFields,
              'defaultActiveCounterFields': defaultActiveCounterFields,
              'processId': undefined,
              'supervisorId': undefined,
              'caseStateFilter': ''
            });
          }));

          it('should not fill ths filters with supervisor_id', inject(function() {
            expect(scope.searchOptions.filters).toEqual([]);
          }));
        });

        describe('$on event handler', function() {
          beforeEach(inject(function($controller) {
            spyOn(scope, '$on');
            casesCtrl = $controller('ActiveCaseListCtrl', {
              '$scope': scope,
              'caseAPI': caseAPI,
              'defaultPageSize': defaultPageSize,
              'defaultSort': defaultSort,
              'defaultDeployedFields': defaultDeployedFields,
              'defaultActiveCounterFields': defaultActiveCounterFields,
              'processId': undefined,
              'supervisorId': 1,
              'caseStateFilter': ''
            });
          }));
          it('should be set', function() {
            expect(scope.$on.calls.allArgs()).toEqual([
              ['caselist:http-error', casesCtrl.handleHttpErrorEvent],
              ['caselist:notify', casesCtrl.addAlertEventHandler],
              ['caselist:search', casesCtrl.searchForCases]
            ]);
          });
        });

      });
    });

    describe('handleHttpErrorEvent', function() {
      var mockedLocation = jasmine.createSpyObj('$location', ['url']);
      beforeEach(inject(function($controller) {
        casesCtrl = $controller('ActiveCaseListCtrl', {
          '$scope': scope,
          'caseAPI': caseAPI,
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
        casesCtrl = $controller('ActiveCaseListCtrl', {
          '$scope': scope,
          'caseAPI': caseAPI,
          'processId': undefined,
          'supervisorId': undefined,
          'caseStateFilter': ''
        });
      }));
      it('should change searchSort value', function() {
        scope.pagination.currentPage = 8;
        expect(scope.searchOptions.searchSort).toEqual('id DESC');
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
        expect(scope.searchOptions.searchSort).toEqual('id DESC');
        casesCtrl.updateSortField();
        expect(scope.pagination.currentPage).toBe(8);
        expect(scope.searchOptions.searchSort).toEqual('id DESC');
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

        describe('without supervisorId', function() {
          beforeEach(inject(function($controller) {
            casesCtrl = $controller('ActiveCaseListCtrl', {
              '$scope': scope,
              '$window': mockedWindow,
              'manageTopUrl': manageTopUrl,
              'moreDetailToken': 'casemoredetailsadmin',
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
            expect(casesCtrl.getLinkToCase(caseItem)).toEqual('/bonita/portal/homepage?tenant=1#?id=123&_p=casemoredetailsadmin&_pf=2');
            expect(casesCtrl.getLinkToProcess(caseItem)).toEqual('/bonita/portal/homepage?tenant=1#?id=321&_p=processmoredetailsadmin&_pf=2');
            caseItem = {
              id: '4568',
              processDefinitionId: {
                id: 3987
              }
            };
            casesCtrl.getLinkToCase(caseItem);
            casesCtrl.getLinkToProcess(caseItem);
            expect(casesCtrl.getLinkToCase(caseItem)).toEqual('/bonita/portal/homepage?tenant=1#?id=4568&_p=casemoredetailsadmin&_pf=2');
            expect(casesCtrl.getLinkToProcess(caseItem)).toEqual('/bonita/portal/homepage?tenant=1#?id=3987&_p=processmoredetailsadmin&_pf=2');
            expect(manageTopUrl.getPath.calls.count()).toEqual(12);
            expect(manageTopUrl.getSearch.calls.count()).toEqual(6);
            expect(manageTopUrl.getCurrentProfile.calls.count()).toEqual(6);
          });
        });
        describe('with supervisorId', function() {
          beforeEach(inject(function($controller) {
            casesCtrl = $controller('ActiveCaseListCtrl', {
              '$scope': scope,
              '$window': mockedWindow,
              'manageTopUrl': manageTopUrl,
              'moreDetailToken': 'casemoredetailsadmin',
              'processId': undefined,
              'supervisorId': 1,
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
            expect(casesCtrl.getLinkToCase(caseItem)).toEqual('/bonita/portal/homepage?tenant=1#?id=123&_p=casemoredetailspm&_pf=2');
            expect(casesCtrl.getLinkToProcess(caseItem)).toEqual('/bonita/portal/homepage?tenant=1#?id=321&_p=processmoredetailspm&_pf=2');
            caseItem = {
              id: '4568',
              processDefinitionId: {
                id: 78987
              }
            };
            casesCtrl.getLinkToCase(caseItem);
            casesCtrl.getLinkToProcess(caseItem);
            expect(casesCtrl.getLinkToCase(caseItem)).toEqual('/bonita/portal/homepage?tenant=1#?id=4568&_p=casemoredetailspm&_pf=2');
            expect(casesCtrl.getLinkToProcess(caseItem)).toEqual('/bonita/portal/homepage?tenant=1#?id=78987&_p=processmoredetailspm&_pf=2');
            expect(manageTopUrl.getPath.calls.count()).toEqual(12);
            expect(manageTopUrl.getSearch.calls.count()).toEqual(6);
            expect(manageTopUrl.getCurrentProfile.calls.count()).toEqual(6);
          });

          it('should change top location hash to case detail', inject(function($controller) {
            casesCtrl = $controller('ActiveCaseListCtrl', {
              '$scope': scope,
              '$window': mockedWindow,
              'manageTopUrl': manageTopUrl,
              'moreDetailToken': 'casemoredetails',
              'processId': undefined,
              'supervisorId': 1,
              'caseStateFilter': ''
            });

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
            expect(casesCtrl.getLinkToProcess(caseItem)).toEqual('/bonita/portal/homepage?tenant=1#?id=321&_p=processmoredetailspm&_pf=2');
            caseItem = {
              id: '4568',
              processDefinitionId: {
                id: 54545
              }
            };
            casesCtrl.getLinkToCase(caseItem);
            casesCtrl.getLinkToProcess(caseItem);
            expect(casesCtrl.getLinkToCase(caseItem)).toEqual('/bonita/portal/homepage?tenant=1#?id=4568&_p=casemoredetails&_pf=2');
            expect(casesCtrl.getLinkToProcess(caseItem)).toEqual('/bonita/portal/homepage?tenant=1#?id=54545&_p=processmoredetailspm&_pf=2');
            expect(manageTopUrl.getPath.calls.count()).toEqual(12);
            expect(manageTopUrl.getSearch.calls.count()).toEqual(6);
            expect(manageTopUrl.getCurrentProfile.calls.count()).toEqual(6);
          }));
        });
      });

      describe('go to case details in app', function() {
        var mockedWindow,
          manageTopUrl = jasmine.createSpyObj('manageTopUrl', ['getPath', 'getSearch', 'getCurrentProfile']),
          ApplicationLink = jasmine.createSpyObj('ApplicationLink', ['getSearch']);
        ApplicationLink.getLink = function(portalUrl, appsUrl) {
            return appsUrl;
        };
        beforeEach(function() {
          mockedWindow = {
            top: {
              location: {}
            }
          };
        });

        describe('for archived case', function() {
          beforeEach(function() {
            inject(function($controller) {
              casesCtrl = $controller('ArchivedCaseListCtrl', {
                '$scope': scope,
                '$window': mockedWindow,
                'manageTopUrl': manageTopUrl,
                'ApplicationLink': ApplicationLink,
                'processId': undefined,
                'supervisorId': undefined,
                'caseStateFilter': ''
              });
            });
          });

          it('should change top location to case detail', function() {
            manageTopUrl.getPath.and.returnValue('/bonita/apps/appName/pageName/');
            manageTopUrl.getCurrentProfile.and.returnValue('');
            var caseItem = {
              id: 123,
              processDefinitionId: {
                id: 321
              },
              sourceObjectId: 994
            };
            expect(casesCtrl.getLinkToCase(caseItem)).toEqual('/bonita/apps/appName/pageName/../admin-case-details?id=994');
            expect(casesCtrl.getLinkToProcess(caseItem)).toEqual('/bonita/apps/appName/pageName/../admin-process-details?id=321');
            caseItem = {
              id: '4568',
              processDefinitionId: {
                id: 3987
              },
              sourceObjectId: 5843
            };
            expect(casesCtrl.getLinkToCase(caseItem)).toEqual('/bonita/apps/appName/pageName/../admin-case-details?id=5843');
            expect(casesCtrl.getLinkToProcess(caseItem)).toEqual('/bonita/apps/appName/pageName/../admin-process-details?id=3987');
          });
        });

        describe('without supervisorId', function() {
          beforeEach(function() {
            inject(function($controller) {
              casesCtrl = $controller('ActiveCaseListCtrl', {
                '$scope': scope,
                '$window': mockedWindow,
                'manageTopUrl': manageTopUrl,
                'ApplicationLink': ApplicationLink,
                'processId': undefined,
                'supervisorId': undefined,
                'caseStateFilter': ''
              });
            });
          });
          it('should show undefined when no case is selected', function() {
            expect(casesCtrl.getLinkToCase()).toBeUndefined();
          });

          it('should change top location to case detail', function() {
            manageTopUrl.getPath.and.returnValue('/bonita/apps/appName/pageName/');
            manageTopUrl.getCurrentProfile.and.returnValue('');
            var caseItem = {
              id: 123,
              processDefinitionId: {
                id: 321
              }
            };
            expect(casesCtrl.getLinkToCase(caseItem)).toEqual('/bonita/apps/appName/pageName/../admin-case-details?id=123');
            expect(casesCtrl.getLinkToProcess(caseItem)).toEqual('/bonita/apps/appName/pageName/../admin-process-details?id=321');
            caseItem = {
              id: '4568',
              processDefinitionId: {
                id: 3987
              }
            };
            expect(casesCtrl.getLinkToCase(caseItem)).toEqual('/bonita/apps/appName/pageName/../admin-case-details?id=4568');
            expect(casesCtrl.getLinkToProcess(caseItem)).toEqual('/bonita/apps/appName/pageName/../admin-process-details?id=3987');
          });
        });
        describe('with supervisorId', function() {
          beforeEach(inject(function($controller) {
            casesCtrl = $controller('ActiveCaseListCtrl', {
              '$scope': scope,
              '$window': mockedWindow,
              'manageTopUrl': manageTopUrl,
              'ApplicationLink': ApplicationLink,
              'processId': undefined,
              'supervisorId': 1,
              'caseStateFilter': ''
            });
          }));
          it('should show undefined when no case is selected', function() {
            expect(casesCtrl.getLinkToCase()).toBeUndefined();
          });

          it('should change top location hash to case detail', function() {
            manageTopUrl.getPath.and.returnValue('/bonita/apps/appName/pageName/');
            manageTopUrl.getCurrentProfile.and.returnValue('');
            var caseItem = {
              id: 123,
              processDefinitionId: {
                id: 321
              }
            };
            expect(casesCtrl.getLinkToCase(caseItem)).toEqual('/bonita/apps/appName/pageName/../admin-case-details?id=123');
            expect(casesCtrl.getLinkToProcess(caseItem)).toEqual('/bonita/apps/appName/pageName/../admin-process-details?id=321');
            caseItem = {
              id: '4568',
              processDefinitionId: {
                id: 78987
              }
            };
            expect(casesCtrl.getLinkToCase(caseItem)).toEqual('/bonita/apps/appName/pageName/../admin-case-details?id=4568');
            expect(casesCtrl.getLinkToProcess(caseItem)).toEqual('/bonita/apps/appName/pageName/../admin-process-details?id=78987');
          });

          it('should change top location hash to case detail', inject(function($controller) {
            casesCtrl = $controller('ActiveCaseListCtrl', {
              '$scope': scope,
              '$window': mockedWindow,
              'manageTopUrl': manageTopUrl,
              'moreDetailToken': 'casemoredetails',
              'processId': undefined,
              'supervisorId': 1,
              'caseStateFilter': ''
            });

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
            expect(casesCtrl.getLinkToProcess(caseItem)).toEqual('/bonita/portal/homepage?tenant=1#?id=321&_p=processmoredetailspm&_pf=2');
            caseItem = {
              id: '4568',
              processDefinitionId: {
                id: 54545
              }
            };
            casesCtrl.getLinkToCase(caseItem);
            casesCtrl.getLinkToProcess(caseItem);
            expect(casesCtrl.getLinkToCase(caseItem)).toEqual('/bonita/portal/homepage?tenant=1#?id=4568&_p=casemoredetails&_pf=2');
            expect(casesCtrl.getLinkToProcess(caseItem)).toEqual('/bonita/portal/homepage?tenant=1#?id=54545&_p=processmoredetailspm&_pf=2');
          }));
        });
      });

      describe('page changes', function() {
        var defaultPageSize = 2;
        var defaultSort = 'id';
        var defaultDeployedFields = ['titi', 'tata', 'toto'];
        var anchorScroll = jasmine.createSpy();
        var defaultActiveCounterFields = ['failed', 'ongoing'];

        beforeEach(inject(function($controller) {
          casesCtrl = $controller('ActiveCaseListCtrl', {
            '$scope': scope,
            'caseAPI': caseAPI,
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
          casesCtrl.loadContent();
        }));
        it('should send a notification error when the search fails', function() {
          scope.pagination.total = 300;
          scope.currentFirstResultIndex = 10;
          scope.currentLastResultIndex = 1321;
          var error = {
            status: 401
          };
          deferred.reject(error);
          scope.$apply();
          expect(scope.pagination.total).toBe(0);
          expect(scope.currentFirstResultIndex).toBe(0);
          expect(scope.currentLastResultIndex).toBe(0);
          expect(scope.$emit.calls.allArgs()).toEqual([
            ['caselist:http-error', error]
          ]);
        });
        it('should call next Page without sort', function() {
          deferred.resolve(fullCases);
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
              o: defaultSort + ' DESC',
              f: [],
              n: defaultActiveCounterFields,
              s: undefined
            }],
            [{
              p: 1,
              c: defaultPageSize,
              d: defaultDeployedFields,
              o: defaultSort + ' DESC',
              f: [],
              n: defaultActiveCounterFields,
              s: undefined
            }],
          ]);
        });
        it('should call search twice on second page with second call faster than the first, the second result should be displayed', function() {
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
          deferred.resolve({
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
          secondDeferred.resolve({
            resource: results
          });
          scope.$apply();
          results = cases.slice(0, 2);
          results.pagination = {
            total: 6
          };
          deferred.resolve({
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
          deferred.resolve(fullCases);
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
              o: defaultSort + ' DESC',
              d: defaultDeployedFields,
              f: [],
              n: defaultActiveCounterFields,
              s: undefined
            }],
            [{
              p: 0,
              c: defaultPageSize,
              o: 'name DESC',
              d: defaultDeployedFields,
              f: [],
              n: defaultActiveCounterFields,
              s: undefined
            }],
            [{
              p: 1,
              c: defaultPageSize,
              o: 'name DESC',
              d: defaultDeployedFields,
              f: [],
              n: defaultActiveCounterFields,
              s: undefined
            }],
            [{
              p: 0,
              c: defaultPageSize,
              o: 'name DESC',
              d: defaultDeployedFields,
              f: [],
              n: defaultActiveCounterFields,
              s: undefined
            }],
            [{
              p: 0,
              c: defaultPageSize,
              o: 'version ASC',
              d: defaultDeployedFields,
              f: [],
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
            casesCtrl = $controller('ActiveCaseListCtrl', {
              '$scope': scope,
              'caseAPI': caseAPI,
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
            casesCtrl.loadContent();
          }));
          it('should call default sort on empty tableState', function() {
            deferred.resolve(fullCases);
            scope.$apply();
            expect(anchorScroll).toHaveBeenCalled();

            expect(caseAPI.search.calls.allArgs()).toEqual([
              [{
                p: 0,
                c: defaultPageSize,
                o: defaultSort + ' DESC',
                d: defaultDeployedFields,
                f: [],
                n: defaultActiveCounterFields,
                s: undefined
              }]
            ]);
            expect(anchorScroll).toHaveBeenCalled();
          });
          it('should call search on application name sort desc', function() {
            deferred.resolve(fullCases);
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
                o: 'id DESC',
                d: defaultDeployedFields,
                f: [],
                n: defaultActiveCounterFields,
                s: undefined
              }],
              [{
                p: 0,
                c: defaultPageSize,
                o: 'name DESC',
                d: defaultDeployedFields,
                f: [],
                n: defaultActiveCounterFields,
                s: undefined
              }],
              [{
                p: 0,
                c: defaultPageSize,
                o: 'name ASC',
                d: defaultDeployedFields,
                f: [],
                n: defaultActiveCounterFields,
                s: undefined
              }],
              [{
                p: 0,
                c: defaultPageSize,
                o: 'version DESC',
                d: defaultDeployedFields,
                f: [],
                n: defaultActiveCounterFields,
                s: undefined
              }]
            ]);
            /* jshint -W069 */
            it('should set started by fullname', function() {
              deferred.resolve(fullCases);
              scope.$apply();
              expect(scope.cases[0]['Started by fullname']).toEqual('William Jobs');
              expect(scope.cases[1]['Started by fullname']).toEqual(' Jobs');
              expect(scope.cases[2]['Started by fullname']).toEqual('William ');
              expect(scope.cases[3]['Started by fullname']).toEqual('william.jobs');
            });
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
            casesCtrl = $controller('ActiveCaseListCtrl', {
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
            casesCtrl = $controller('ActiveCaseListCtrl', {
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
        casesCtrl = $controller('ActiveCaseListCtrl', {
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
        casesCtrl = $controller('ActiveCaseListCtrl', {
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
      it('should change the number and reinit page number', function() {
        var itemsPerPage = 50;
        scope.currentPage = 2;
        casesCtrl.changeItemPerPage(itemsPerPage);
        expect(casesCtrl.searchForCases).toHaveBeenCalledWith();
        expect(scope.pagination.itemsPerPage).toBe(itemsPerPage);
        expect(scope.pagination.currentPage).toBe(1);
      });
    });

    describe('addAlertEventHandler', function() {
      var growl = jasmine.createSpyObj('growl', ['success', 'error', 'info']);
      beforeEach(inject(function($controller) {
        casesCtrl = $controller('ActiveCaseListCtrl', {
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
        casesCtrl = $controller('ActiveCaseListCtrl', {
          '$scope': scope,
          'processId': undefined,
          'supervisorId': undefined,
          'caseStateFilter': ''
        });
        scope.searchOptions.searchSort = {};
        scope.pagination.currentPage = 10;
        casesCtrl.reinitCases();
        expect(scope.searchOptions.searchSort).toBeUndefined();
        expect(scope.pagination.currentPage).toBe(1);
      }));
      it('should perform search', inject(function($controller) {
        casesCtrl = $controller('ActiveCaseListCtrl', {
          '$scope': scope,
          'processId': undefined,
          'supervisorId': undefined,
          'caseStateFilter': ''
        });
        delete scope.searchOptions.searchSort;
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
        deferred.resolve();
        casesCtrl = $controller('ActiveCaseListCtrl', {
          '$scope': scope,
          'store': {
            load: function() {
              return {
                then: function() {}
              };
            }
          },
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
        casesCtrl.loadContent();
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
          var processName = ['Process1', 'Process1'];
          scope.selectedFilters.selectedApp = processName;
          casesCtrl.buildFilters();
          expect(scope.searchOptions.filters).toEqual(['name=' + processName[0]]);
          expect(scope.pagination.currentPage).toBe(1);
        });
      });
    });
    describe('onDropComplete', function() {
      beforeEach(inject(function($controller) {
        casesCtrl = $controller('ActiveCaseListCtrl', {
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
