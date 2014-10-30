/* global describe  */
(function () {
  'use strict';
  describe('admin cases list features', function () {

    var scope;

    beforeEach(module('org.bonita.features.admin.cases.list'));

    beforeEach(inject(function ($rootScope) {
      scope = $rootScope.$new();
    }));

    describe('confirmDeleteSelectedCases', function () {
      var modal = {
        open: function () {
        }
      };
      beforeEach(inject(function ($controller) {
        $controller('caseDeleteController', {
          '$scope': scope,
          '$modal': modal,
          'caseAPI': {
            delete: function () {
              return {
                '$promise': {
                  then: function () {
                  }
                }
              };
            }
          }
        });
      }));
      it('should do nothing if cases array is empty', function () {
        spyOn(modal, 'open');
        delete scope.cases;
        scope.confirmDeleteSelectedCases();
        expect(modal.open).not.toHaveBeenCalled();
      });
      it('should call open on modal with empty cases list', function () {
        var promise = {
          then: function () {
          }
        };
        spyOn(modal, 'open').and.returnValue({'result': promise});
        spyOn(promise, 'then');
        scope.cases = [];
        scope.confirmDeleteSelectedCases();
        expect(modal.open).toHaveBeenCalled();
        expect(promise.then).toHaveBeenCalledWith(scope.deleteSelectedCases);
        var modalOptions = modal.open.calls.argsFor(0);
        expect(modalOptions[0].resolve.caseItems()).toEqual([]);
      });
      it('should call open on modal with not empty cases list', function () {
        var promise = {
          then: function () {
          }
        };
        spyOn(modal, 'open').and.returnValue({'result': promise});
        spyOn(promise, 'then');
        var case1 = {selected: true};
        var case2 = {selected: false};
        scope.cases = [case1, case2];
        scope.confirmDeleteSelectedCases();
        expect(modal.open).toHaveBeenCalled();
        expect(promise.then).toHaveBeenCalledWith(scope.deleteSelectedCases);
        var modalOptions = modal.open.calls.argsFor(0);
        expect(modalOptions[0].resolve.caseItems()).toEqual([case1]);
      });
    });

    describe('checkCaseIsNotSelected', function () {
      beforeEach(inject(function ($controller) {
        $controller('caseDeleteController', {
          '$scope': scope
        });
      }));
      it('should return false when nothing is in the case array', function () {
        scope.cases = [];
        expect(scope.checkCaseIsNotSelected()).toBeTruthy();
      });
      it('should return false when nothing is selected', function () {
        scope.cases = [{selected: false}, {}];
        expect(scope.checkCaseIsNotSelected()).toBeTruthy();
      });
      it('should return true when somethings selected', function () {
        scope.cases = [{selected: true}, {}];
        expect(scope.checkCaseIsNotSelected()).toBeFalsy();
      });
    });

    describe('deleteSelectedCases', function () {
      var promise, searchSpy, caseAPI;
      beforeEach(inject(function ($controller) {
        promise = {
          then: function (successMethod, errorMethod) {
            if (successMethod) {
              successMethod();
            } else if (errorMethod) {
              errorMethod();
            }
            return promise;
          }
        };
        caseAPI = {
          search: function () {
            return {
              '$promise': {
                then: function () {
                }
              }
            };
          },
          delete: function () {
            return {
              '$promise': promise
            };
          }
        };
        $controller('caseDeleteController', {
          '$scope': scope,
          'caseAPI': caseAPI,
          'store': {
            load: function () {
              return {
                then: function () {
                }
              };
            }
          },
        });
        spyOn(caseAPI, 'delete').and.callThrough();
        searchSpy = spyOn(caseAPI, 'search').and.callThrough();
        scope.addAlert = function () {
        };
        scope.searchForCases = function () {
        };
        scope.displayError = function () {
        };
        spyOn(scope, 'searchForCases');
        spyOn(scope, 'displayError');
        spyOn(scope, 'addAlert');
      }));
      it('should delete nothing if cases array is empty', function () {
        scope.deleteSelectedCases();
        expect(caseAPI.delete).not.toHaveBeenCalled();
      });
      it('should delete nothing if nothing is selected', function () {
        scope.cases = [{selected: false, id: '1'}, {selected: false, id: '324'}];
        scope.deleteSelectedCases();
        expect(caseAPI.delete).not.toHaveBeenCalled();
        expect(scope.cases).toEqual([{selected: false, id: '1'}, {selected: false, id: '324'}]);
      });
      it('should delete nothing if selected items have no id', function () {
        scope.cases = [{selected: false, id: '1'}, {selected: true}];
        scope.deleteSelectedCases();
        expect(caseAPI.delete).not.toHaveBeenCalled();
        expect(scope.cases).toEqual([{selected: false, id: '1'}, {selected: true}]);
      });
      it('should delete all selected cases', function () {
        scope.cases = [{selected: true, id: '1'}, {selected: true, id: '324'}];
        caseAPI.search.calls.reset();
        searchSpy.and.returnValue({
          '$promise': {
            then: function (success) {
              var resource = [];
              resource.pagination = {total: 0};
              success({resource: resource});
            }
          }
        });
        scope.deleteSelectedCases();
        expect(scope.searchForCases).toHaveBeenCalled();
        expect(caseAPI.delete).toHaveBeenCalled();
        expect(caseAPI.delete.calls.allArgs()).toEqual([[{id: '324'}], [{id: '1'}]]);
        expect(scope.addAlert).toHaveBeenCalled();
        expect(scope.addAlert.calls.allArgs()).toEqual([[{type: 'success', status: '2 case(s) deleted successfully'}]]);
      });
      it('should delete all cases even if one of them fails', inject(function ($q) {
        scope.cases = [{selected: true, id: '1'}, {selected: true, id: '324'}];
        var deferredError = $q.defer();
        var deferredSuccess = $q.defer();
        promise = deferredError.promise;
        promise.then(undefined, function () {
          promise = deferredSuccess.promise;
        });
        var error = {
          status: 500,
          statusText: 'Internal Server Error',
          data: {resource: 'bpm/case', message: 'impossible to delete'}
        };
        deferredError.reject(error);
        deferredSuccess.resolve();
        caseAPI.search.calls.reset();
        searchSpy.and.returnValue({
          '$promise': {
            then: function (success) {
              var resource = [{name: 'Process1', version: '1.0', 'id': '324'}];
              resource.pagination = {total: 0};
              success({resource: resource});
            }
          }
        });
        scope.deleteSelectedCases();
        scope.$apply();
        expect(scope.searchForCases).toHaveBeenCalled();
        expect(caseAPI.delete).toHaveBeenCalled();
        expect(caseAPI.delete.calls.allArgs()).toEqual([[{id: '324'}], [{id: '1'}]]);
        expect(scope.displayError).toHaveBeenCalled();
        expect(scope.displayError.calls.allArgs()).toEqual([[{ status : 500, statusText : 'Internal Server Error', data : { resource : 'bpm/case', message : 'impossible to delete' } }]]);
        expect(scope.addAlert).toHaveBeenCalled();
        expect(scope.addAlert.calls.allArgs()).toEqual([[{type: 'success', status: '1 case(s) deleted successfully'}]]);
      }));
      it('should delete nothing even all fails', inject(function ($q) {
        scope.cases = [{selected: true, id: '1'}, {selected: true, id: '324'}];
        var deferredError = $q.defer();
        promise = deferredError.promise;
        var error = {
          status: 500,
          statusText: 'Internal Server Error',
          data: {resource: 'bpm/case', message: 'impossible to delete'}
        };
        deferredError.reject(error);
        caseAPI.search.calls.reset();
        searchSpy.and.returnValue({
          '$promise': {
            then: function (success) {
              var resource = [];
              resource.pagination = {total: 0};
              success({resource: resource});
            }
          }
        });
        scope.deleteSelectedCases();
        expect(caseAPI.search).not.toHaveBeenCalled();
        scope.$apply();
        expect(caseAPI.delete).toHaveBeenCalled();
        expect(caseAPI.delete.calls.allArgs()).toEqual([[{id: '324'}], [{id: '1'}]]);
        expect(scope.displayError).toHaveBeenCalled();
        expect(scope.displayError.calls.allArgs()).toEqual([
          [{ status : 500, statusText : 'Internal Server Error', data : { resource : 'bpm/case', message : 'impossible to delete' } }],
          [{ status : 500, statusText : 'Internal Server Error', data : { resource : 'bpm/case', message : 'impossible to delete' } }]
        ]);
        expect(scope.addAlert).toHaveBeenCalled();
        expect(scope.addAlert.calls.allArgs()).toEqual([[{type: 'success', status: '0 case(s) deleted successfully'}]]);
        expect(scope.searchForCases).toHaveBeenCalled();
      }));
    });
  });
})();
