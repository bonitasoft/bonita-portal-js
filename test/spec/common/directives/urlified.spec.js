describe('urlified', function () {
  'use strict';

  var scope, $compile, urlify, ngModelCtrl, setInputValue;

  beforeEach(module('org.bonitasoft.common.directives.urlified'));

  beforeEach(module(function ($filterProvider) {
    urlify = jasmine.createSpy();

    $filterProvider.register('urlify', function () {
      return urlify;
    });
  }));

  beforeEach(inject(function ($rootScope, _$compile_) {
    $compile = _$compile_;
    scope = $rootScope.$new();
    var element = $compile('<input ng-model="value" urlified>')(scope);
    setInputValue = function (value) {
      element.val(value);
      element.triggerHandler('input');
    };
    ngModelCtrl = element.controller('ngModel');
  }));

  it('should filter scope value', function () {
    urlify.and.returnValue('filtered-scope');

    setInputValue('foo');

    expect(scope.value).toBe('filtered-scope');
  });

  it('should filter view value', function () {
    urlify.and.returnValue('filtered-view');

    setInputValue('bar');

    expect(ngModelCtrl.$viewValue).toBe('filtered-view');
  });

  it('should update view when the filter is applied even if the model didn\'t change', function () {
    ngModelCtrl.$modelValue = 'foo';
    urlify.and.returnValue('foo');

    setInputValue('foobar');

    expect(ngModelCtrl.$viewValue).toBe('foo');
  });
});
