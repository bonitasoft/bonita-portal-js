describe('urlified', function () {
  'use strict';

  var scope, $compile;

  beforeEach(module('org.bonita.common.directives.selectAll'));

  describe('directive', function(){

    beforeEach(inject(function ($rootScope, _$compile_) {
      $compile = _$compile_;
      scope = $rootScope;
    }));

    it('should be in indeterminate state if only one item checked', function () {
      var case1 = {selected : false};
      var case2 = {selected : false};
      var case3 = {selected : false};
      scope.cases = [case1, case2, case3];
      var element = $compile('<select-all-checkbox checkboxes="cases"></select-all-checkbox>')(scope);
      var elementScope = element.isolateScope();
      scope.$apply();
      case1.selected = true;
      scope.$apply();
      expect(element.prop('indeterminate')).toBe(true);
      expect(elementScope.masterIndeterminate).toBe('indeterminate');
    });

    it('should be in checked state if all items are checked', function () {
      var case1 = {selected : false};
      var case2 = {selected : false};
      var case3 = {selected : false};
      scope.cases = [case1, case2, case3];
      var elementScope = $compile('<select-all-checkbox checkboxes="cases"></select-all-checkbox>')(scope).isolateScope();
      scope.$apply();
      case1.selected = true;
      case2.selected = true;
      case3.selected = true;
      scope.$apply();
      expect(elementScope.master).toBe(true);
    });

    it('should be in checked state if none is checked', function () {
      var case1 = {selected : true};
      var case2 = {selected : true};
      var case3 = {selected : true};
      scope.cases = [case1, case2, case3];
      var elementScope = $compile('<select-all-checkbox checkboxes="cases"></select-all-checkbox>')(scope).isolateScope();
      scope.$apply();
      case1.selected = false;
      case2.selected = false;
      case3.selected = false;
      scope.$apply();
      expect(elementScope.master).toBe(false);
      expect(elementScope.masterIndeterminate).toBeUndefined();
    });

    it('should be in checked state if none is checked', function () {
      var case1 = {selected : true};
      var case2 = {selected : true};
      var case3 = {selected : true};
      scope.cases = [case1, case2, case3];
      var elementScope = $compile('<select-all-checkbox checkboxes="cases"></select-all-checkbox>')(scope).isolateScope();
      scope.$apply();
      case2.selected = false;
      scope.$apply();
      expect(elementScope.master).toBe(true);
      expect(elementScope.masterIndeterminate).toBe('indeterminate');
    });

    it('should check every item if master CB is checked', function () {
      var case1 = {selected : false};
      var case2 = {selected : false};
      var case3 = {selected : false};
      scope.cases = [case1, case2, case3];
      var elementScope = $compile('<select-all-checkbox checkboxes="cases"></select-all-checkbox>')(scope).isolateScope();
      scope.$apply();
      elementScope.master = true;
      elementScope.masterChange();
      scope.$apply();
      expect(elementScope.master).toBe(true);
      expect(case1.selected).toBe(true);
      expect(case2.selected).toBe(true);
      expect(case3.selected).toBe(true);
      expect(elementScope.masterIndeterminate).toBeUndefined();
    });

    it('should uncheck every item if master CB is unchecked', function () {
      var case1 = {selected : true};
      var case2 = {selected : true};
      var case3 = {selected : true};
      scope.cases = [case1, case2, case3];
      var elementScope = $compile('<select-all-checkbox checkboxes="cases"></select-all-checkbox>')(scope).isolateScope();
      scope.$apply();
      elementScope.master = false;
      elementScope.masterChange();
      scope.$apply();
      expect(elementScope.master).toBe(false);
      expect(case1.selected).toBe(false);
      expect(case2.selected).toBe(false);
      expect(case3.selected).toBe(false);
      expect(elementScope.masterIndeterminate).toBeUndefined();
    });

    it('should uncheck every item if master CB is unchecked in indeterminate state', function () {
      var case1 = {selected : true};
      var case2 = {selected : true};
      var case3 = {selected : true};
      scope.cases = [case1, case2, case3];
      var elementScope = $compile('<select-all-checkbox checkboxes="cases"></select-all-checkbox>')(scope).isolateScope();
      scope.$apply();
      case1.selected = false;
      scope.$apply();
      expect(elementScope.masterIndeterminate).toBe('indeterminate');
      elementScope.masterChange();
      scope.$apply();
      expect(elementScope.master).toBe(false);
      expect(case1.selected).toBe(false);
      expect(case2.selected).toBe(false);
      expect(case3.selected).toBe(false);
      expect(elementScope.masterIndeterminate).toBeUndefined();
    });
  });
});
