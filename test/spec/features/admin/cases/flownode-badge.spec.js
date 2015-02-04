/* global describe  */
(function () {
  'use strict';
  describe('admin cases list features', function () {

    var scope;

    beforeEach(module('org.bonitasoft.features.admin.cases.list.flownodePopover'));

    beforeEach(inject(function ($rootScope) {
      scope = $rootScope.$new();
    }));

    it('should load directive without any error', inject(function ($compile) {
      $compile('<flow-node-badge case-id="1" label="2"></flow-node-badge>')(scope);
    }));

    describe('popover test', function () {

      var deferred, flowNodeBadgeCtrl, flowNodeAPI;

      beforeEach(inject(function ($controller, _flowNodeAPI_, $q) {
        deferred = $q.defer();
        flowNodeAPI = _flowNodeAPI_;
        spyOn(flowNodeAPI, 'search').and.returnValue({
          '$promise': deferred.promise
        });

        flowNodeBadgeCtrl = $controller('flowNodeBadgeCtrl', {
          '$scope': scope,
          'flowNodeAPI': flowNodeAPI
        });
      }));


      it('should trigger popoverAsyncTrigger when showPopover is called', function () {
        scope.triggerPopover = jasmine.createSpy();

        flowNodeBadgeCtrl.showPopover();
        deferred.resolve();
        scope.$digest();

        expect(scope.triggerPopover).toHaveBeenCalled();//verify
      });

      it('should filter flow nodes search by case id', function () {
        scope.caseId = 1;

        flowNodeBadgeCtrl.showPopover();

        expect(flowNodeAPI.search).toHaveBeenCalledWith({
          p: 0,
          c: 10,
          f: ['caseId=1']
        });
      });

      it('should filter flow nodes search by provided filter', function () {
        scope.caseId = 1;
        scope.filter = 'state=failed';

        flowNodeBadgeCtrl.showPopover();

        expect(flowNodeAPI.search).toHaveBeenCalledWith({
          p: 0,
          c: 10,
          f: ['caseId=1', 'state=failed']
        });
      });

      it('should add search result to the scope', function () {
        var flowNodesItems = ['flownode 1', 'flownode 2'];
        flowNodesItems.$promise = deferred.promise;
        flowNodeAPI.search.and.returnValue(flowNodesItems);

        flowNodeBadgeCtrl.showPopover();

        expect(scope.flowNodesItems).toEqual(flowNodesItems);
      });
    });

  });
})();
