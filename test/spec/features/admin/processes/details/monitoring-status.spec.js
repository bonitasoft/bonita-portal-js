/** Copyright (C) 2015 Bonitasoft S.A.
 * Bonitasoft is a trademark of Bonitasoft SA.
 * This software file is BONITASOFT CONFIDENTIAL. Not For Distribution.
 * For commercial licensing information, contact:
 * Bonitasoft, 32 rue Gustave Eiffel – 38000 Grenoble
 * or Bonitasoft US, 51 Federal Street, Suite 305, San Francisco, CA 94107
 */

(function() {
  'use strict';

  describe('monitoringStatus Directive and Controller in Process More Details',
    function() {
      var scope, compile, archivedCaseAPI, q, defferedArchivedCases, controller, httpBackend;

      beforeEach(module('org.bonitasoft.templates'));
      beforeEach(angular.mock.module('org.bonitasoft.features.admin.processes.details.monitoringStatus',
        function($provide) {
          $provide.factory('ArchivedCaseAPI', function() {
            // Service/Factory Mock
            return jasmine.createSpyObj('archivedCaseAPI', ['search']);
          });
      }));

      beforeEach(module('org.bonitasoft.features.admin.processes.details.monitoringStatus'));

      beforeEach(inject(function($rootScope, $compile, $q, ArchivedCaseAPI, $controller, $httpBackend) {
        q = $q;
        compile = $compile;
        scope = $rootScope.$new();
        defferedArchivedCases = $q.defer();
        archivedCaseAPI = ArchivedCaseAPI;
        controller = $controller;
        httpBackend = $httpBackend;
      }));
      beforeEach(function() {
        archivedCaseAPI.search.and.returnValue(defferedArchivedCases.promise);
      });
      describe('MonitoringStatusCtrl', function() {
        it('init Monitoring view model properly', function() {
          var process = {id: '21'};
          scope.process = process;
          var monitoringStatusCtrl = controller('MonitoringStatusCtrl', {
            $scope: scope,
            TokenExtensionService: {
              tokenExtensionValue: 'admin'
            }
          });
          expect(monitoringStatusCtrl.process).toBe(process);
          expect(monitoringStatusCtrl.pageProfileToken).toEqual('admin');
        });
        it('init Monitoring view model with pm property', function() {
          var process = {id: '21'};
          scope.process = process;
          var monitoringStatusCtrl = controller('MonitoringStatusCtrl', {
            $scope: scope,
            TokenExtensionService: {
              tokenExtensionValue: 'pm'
            }
          });
          expect(monitoringStatusCtrl.pageProfileToken).toEqual('pm');
        });
      });

      describe('monitoringStatus directive', function() {

        it('should contains a table and its contents', function() {
          defferedArchivedCases.resolve();
          scope.process = {
            id: '123',
            openCases: 7,
            failedCases: 3
          };
          scope.archivedCaseCount = 1;
          var element = compile('<monitoring-status process="process"></monitoring-status>')(scope);
          httpBackend.whenGET('../API/bpm/archivedCase?c=2147483646&f=processDefinitionId%3D'+scope.process.id+'&p=0')
            .respond([{'archivedCaseId': 34}]);
          httpBackend.flush();

          scope.$apply();
          expect(element.isolateScope().monitoringCtrl.pageProfileToken).toEqual('admin');
          var totalLabels = element.find('.totalLabel');

          expect(totalLabels.length).toBe(4);
          expect(angular.element(totalLabels.get(0)).text()).toEqual('Cases with failures');
          expect(angular.element(totalLabels.get(1)).text()).toEqual('Healthy cases');
          expect(angular.element(totalLabels.get(2)).text()).toEqual('Open cases');
          expect(angular.element(totalLabels.get(3)).text()).toEqual('Archived cases');

          var counters = element.find('.counter');
          expect(counters.length).toBe(4);
          expect(angular.element(counters.get(0)).text()).toEqual('3');
          expect(angular.element(counters.get(1)).text()).toEqual('4');
          expect(angular.element(counters.get(2)).text()).toEqual('7');
          expect(angular.element(counters.get(3)).text()).toEqual('1');
        });
      });
    });
}());
