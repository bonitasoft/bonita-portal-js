/* global describe  */
(function () {
  'use strict';
  describe('admin cases list features', function () {

    var scope;

    beforeEach(module('org.bonita.features.admin.cases.list.delete'));

    beforeEach(inject(function ($rootScope) {
      scope = $rootScope.$new();
    }));

    it('should load directive without any error', inject(function($compile){
      $compile('<active-case-delete></active-case-delete')(scope);
    }));

    describe('confirmDeleteSelectedCases', function () {
      var modal = {
        open: function () {
        }
      };
      beforeEach(inject(function ($controller) {
        $controller('ActiveCaseDeleteCtrl', {
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
        $controller('ActiveCaseDeleteCtrl', {
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

    describe('simple deleteSelectedCases', function () {
      var promise, searchSpy, caseAPI, deferred;
      beforeEach(inject(function ($controller, $q) {
        deferred = $q.defer();
        promise = deferred.promise;
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
        $controller('ActiveCaseDeleteCtrl', {
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
        scope.handleHttpError = function () {
        };
        spyOn(scope, 'searchForCases');
        spyOn(scope, 'handleHttpError');
        spyOn(scope, 'addAlert');
        deferred.resolve();
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
        scope.pagination = {currentPage : 4};
        scope.deleteSelectedCases();
        scope.$apply();
        expect(scope.searchForCases).toHaveBeenCalled();
        expect(caseAPI.delete).toHaveBeenCalled();
        expect(caseAPI.delete.calls.allArgs()).toEqual([[{id: '1'}], [{id: '324'}]]);
        expect(scope.addAlert).toHaveBeenCalled();
        expect(scope.addAlert.calls.allArgs()).toEqual([[{type: 'success', status: '2 cases deleted successfully'}]]);
        expect(scope.pagination.currentPage).toBe(1);
      });

    });
    describe('simple deleteSelectedCases', function () {
      var searchSpy, caseAPI, successfullDeferred, failingDefered;
      beforeEach(inject(function ($controller, $q) {
        successfullDeferred = $q.defer();
        failingDefered = $q.defer();

        caseAPI = {
          search: function () {
            return {
              '$promise': {
                then: function () {
                }
              }
            };
          },
        };
        $controller('ActiveCaseDeleteCtrl', {
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
        searchSpy = spyOn(caseAPI, 'search').and.callThrough();
        scope.addAlert = function () {
        };
        scope.searchForCases = function () {
        };
        scope.handleHttpError = function () {
        };
        spyOn(scope, 'searchForCases');
        spyOn(scope, 'handleHttpError');
        spyOn(scope, 'addAlert');
      }));
      it('should try to delete every cases even if one of them fails', function () {
        scope.cases = [{selected: true, id: '1'}, {selected: true, id: '324'}, , {selected: true, id: '6548'}, {selected: true, id: '1324'}];
        caseAPI.delete = function(caseItem){
            if(caseItem && +caseItem.id === 324){
              return {'$promise' : failingDefered.promise };
            } else {
              return { '$promise' : successfullDeferred.promise };
            }
          };
        spyOn(caseAPI, 'delete').and.callThrough();
        var error = {
          status: 500,
          statusText: 'Internal Server Error',
          data: {resource: 'bpm/case', message: 'impossible to delete'}
        };
        failingDefered.reject(error);
        successfullDeferred.resolve('1');
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
        scope.pagination = {currentPage : 4};
        scope.deleteSelectedCases();
        scope.$apply();
        expect(scope.searchForCases).toHaveBeenCalled();
        expect(caseAPI.delete).toHaveBeenCalled();
        expect(caseAPI.delete.calls.allArgs()).toEqual([[{id: '1'}], [{id: '324'}], [{id: '6548'}], [{id: '1324'}]]);
        expect(scope.handleHttpError).toHaveBeenCalled();
        expect(scope.handleHttpError.calls.allArgs()).toEqual([[{ status : 500, statusText : 'Internal Server Error', data : { resource : 'bpm/case', message : 'impossible to delete' } }]]);
        expect(scope.addAlert).toHaveBeenCalled();
        expect(scope.addAlert.calls.allArgs()).toEqual([[{type: 'success', status: '3 cases deleted successfully'}]]);
        expect(scope.pagination.currentPage).toBe(1);
      });
      it('should delete nothing even all fails', function () {
        scope.cases = [{selected: true, id: '1'}, {selected: true, id: '324'}];
        caseAPI.delete = function(){
            return {'$promise' : failingDefered.promise };
          };
        spyOn(caseAPI, 'delete').and.callThrough();
        var error = {
          status: 500,
          statusText: 'Internal Server Error',
          data: {resource: 'bpm/case', message: 'impossible to delete'}
        };
        failingDefered.reject(error);
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
        scope.pagination = {currentPage : 4};
        scope.deleteSelectedCases();
        expect(caseAPI.search).not.toHaveBeenCalled();
        scope.$apply();
        expect(caseAPI.delete).toHaveBeenCalled();
        expect(caseAPI.delete.calls.allArgs()).toEqual([ [ { id : '1' } ], [ { id : '324' } ] ]);
        expect(scope.handleHttpError).toHaveBeenCalled();
        expect(scope.handleHttpError.calls.allArgs()).toEqual([
          [{ status : 500, statusText : 'Internal Server Error', data : { resource : 'bpm/case', message : 'impossible to delete' } }],
          [{ status : 500, statusText : 'Internal Server Error', data : { resource : 'bpm/case', message : 'impossible to delete' } }]
        ]);
        expect(scope.addAlert).toHaveBeenCalled();
        expect(scope.addAlert.calls.allArgs()).toEqual([[{type: 'success', status: '0 cases deleted successfully'}]]);
        expect(scope.searchForCases).toHaveBeenCalled();
        expect(scope.pagination.currentPage).toBe(1);
      });
    });
    describe('deleteCaseModalCtrl', function(){
      var modalInstance ;
      beforeEach(inject(function($controller){
        modalInstance = jasmine.createSpyObj('$modalInstance', ['close', 'dismiss']);
        $controller('DeleteCaseModalCtrl', {
          '$scope' : scope,
          '$modalInstance' : modalInstance,
          'caseItems' : []
        });
      }));
      it('should set a caseItems list', function(){
        expect(scope.caseItems).toBeDefined();
      });
      it('should close modal when ok is clicked', function(){
        scope.ok();
        expect(modalInstance.close).toHaveBeenCalled();
      });
      it('should dismiss modal when cancel is clicked', function(){
        scope.cancel();
        expect(modalInstance.dismiss).toHaveBeenCalled();
        expect(modalInstance.dismiss.calls.allArgs()).toEqual([['cancel']]);
      });
    });
  });
})();
