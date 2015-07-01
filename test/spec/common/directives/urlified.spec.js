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
