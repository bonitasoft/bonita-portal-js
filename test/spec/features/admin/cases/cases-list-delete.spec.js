/* global describe  */
(function () {
  'use strict';
  describe('admin cases list features', function () {

    var scope, caseDeleteCtrl;

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
        caseDeleteCtrl = $controller('ActiveCaseDeleteCtrl', {
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
        caseDeleteCtrl.confirmDeleteSelectedCases();
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
        caseDeleteCtrl.confirmDeleteSelectedCases();
        expect(modal.open).toHaveBeenCalled();
        expect(promise.then).toHaveBeenCalledWith(caseDeleteCtrl.deleteSelectedCases);
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
        caseDeleteCtrl.confirmDeleteSelectedCases();
        expect(modal.open).toHaveBeenCalled();
        expect(promise.then).toHaveBeenCalledWith(caseDeleteCtrl.deleteSelectedCases);
        var modalOptions = modal.open.calls.argsFor(0);
        expect(modalOptions[0].resolve.caseItems()).toEqual([case1]);
      });
    });

    describe('checkCaseIsNotSelected', function () {
      beforeEach(inject(function ($controller) {
        caseDeleteCtrl = $controller('ActiveCaseDeleteCtrl', {
          '$scope': scope
        });
      }));
      it('should return false when nothing is in the case array', function () {
        scope.cases = [];
        expect(caseDeleteCtrl.checkCaseIsNotSelected()).toBeTruthy();
      });
      it('should return false when nothing is selected', function () {
        scope.cases = [{selected: false}, {}];
        expect(caseDeleteCtrl.checkCaseIsNotSelected()).toBeTruthy();
      });
      it('should return true when somethings selected', function () {
        scope.cases = [{selected: true}, {}];
        expect(caseDeleteCtrl.checkCaseIsNotSelected()).toBeFalsy();
      });
    });

    describe('simple deleteSelectedCases', function () {
      var promise, caseAPI, deferred;
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
        caseDeleteCtrl = $controller('ActiveCaseDeleteCtrl', {
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
        spyOn(scope, '$emit');
        deferred.resolve();
      }));
      it('should delete nothing if cases array is empty', function () {
        caseDeleteCtrl.deleteSelectedCases();
        expect(caseAPI.delete).not.toHaveBeenCalled();
      });
      it('should delete nothing if nothing is selected', function () {
        scope.cases = [{selected: false, id: '1'}, {selected: false, id: '324'}];
        caseDeleteCtrl.deleteSelectedCases();
        expect(caseAPI.delete).not.toHaveBeenCalled();
        expect(scope.cases).toEqual([{selected: false, id: '1'}, {selected: false, id: '324'}]);
      });
      it('should delete nothing if selected items have no id', function () {
        scope.cases = [{selected: false, id: '1'}, {selected: true}];
        caseDeleteCtrl.deleteSelectedCases();
        expect(caseAPI.delete).not.toHaveBeenCalled();
        expect(scope.cases).toEqual([{selected: false, id: '1'}, {selected: true}]);
      });
      it('should delete all selected cases', function () {
        scope.cases = [{selected: true, id: '1'}, {selected: true, id: '324'}];
        scope.pagination = {currentPage : 4};
        caseDeleteCtrl.deleteSelectedCases();
        scope.$apply();
        expect(caseAPI.delete).toHaveBeenCalled();
        expect(caseAPI.delete.calls.allArgs()).toEqual([[{id: '1'}], [{id: '324'}]]);
        expect(scope.$emit.calls.allArgs()).toEqual([['caselist:notify', {type: 'success', status: '2 cases deleted successfully'}], ['caselist:search']]);
        expect(scope.pagination.currentPage).toBe(1);
      });

    });
    describe('simple deleteSelectedCases', function () {
      var caseAPI, successfullDeferred, failingDefered;
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
        caseDeleteCtrl = $controller('ActiveCaseDeleteCtrl', {
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
        spyOn(scope, '$emit');
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

        scope.pagination = {currentPage : 4};
        caseDeleteCtrl.deleteSelectedCases();
        scope.$apply();
        expect(caseAPI.delete).toHaveBeenCalled();
        expect(caseAPI.delete.calls.allArgs()).toEqual([[{id: '1'}], [{id: '324'}], [{id: '6548'}], [{id: '1324'}]]);
        expect(scope.$emit.calls.allArgs()).toEqual([
          ['caselist:http-error', { status : 500, statusText : 'Internal Server Error', data : { resource : 'bpm/case', message : 'impossible to delete' } }],
          ['caselist:notify', {type: 'success', status: '3 cases deleted successfully'}],
          ['caselist:search']
        ]);
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

        scope.pagination = {currentPage : 4};
        caseDeleteCtrl.deleteSelectedCases();
        scope.$apply();
        expect(caseAPI.delete).toHaveBeenCalled();
        expect(caseAPI.delete.calls.allArgs()).toEqual([ [ { id : '1' } ], [ { id : '324' } ] ]);
        expect(scope.$emit.calls.allArgs()).toEqual([
          ['caselist:http-error', { status : 500, statusText : 'Internal Server Error', data : { resource : 'bpm/case', message : 'impossible to delete' } }],
          ['caselist:http-error', { status : 500, statusText : 'Internal Server Error', data : { resource : 'bpm/case', message : 'impossible to delete' } }],
          ['caselist:notify', {type: 'success', status: '0 cases deleted successfully'}],
          ['caselist:search']
        ]);
        expect(scope.pagination.currentPage).toBe(1);
      });
    });
    describe('deleteCaseModalCtrl', function(){
      var modalInstance ;
      beforeEach(inject(function($controller){
        modalInstance = jasmine.createSpyObj('$modalInstance', ['close', 'dismiss']);
        caseDeleteCtrl = $controller('DeleteCaseModalCtrl', {
          '$scope' : scope,
          '$modalInstance' : modalInstance,
          'caseItems' : []
        });
      }));
      it('should set a caseItems list', function(){
        expect(scope.caseItems).toBeDefined();
      });
      it('should close modal when ok is clicked', function(){
        caseDeleteCtrl.ok();
        expect(modalInstance.close).toHaveBeenCalled();
      });
      it('should dismiss modal when cancel is clicked', function(){
        caseDeleteCtrl.cancel();
        expect(modalInstance.dismiss).toHaveBeenCalled();
        expect(modalInstance.dismiss.calls.allArgs()).toEqual([['cancel']]);
      });
    });
  });
})();
