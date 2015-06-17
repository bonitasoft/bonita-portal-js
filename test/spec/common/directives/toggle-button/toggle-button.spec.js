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

describe('toggle/switch Button', function () {
  'use strict';

  beforeEach(module('org.bonitasoft.common.directives.toggleButton'));

  it('should call change enabled value to true when element is clicked', inject(function ($compile, $rootScope) {
    var scope = $rootScope.$new();
    scope.enable = true;
    scope.$emit= jasmine.createSpy();
    var element = $compile('<toggle-button initial-state="false" enable-toggle="enable"></toggle-button>')(scope);
    element.isolateScope().$emit =  scope.$emit;
    scope.$apply();
    expect(element.parent().attr('class')).toContain('toggle btn btn-default off bonita-toggle');
    element.click();
    scope.$apply();
    //for some reason, using PhantomJS does not change the class...
    //expect(element.parent().attr('class')).toContain('toggle btn btn-primary');
    expect(element.parent().find('.toggle-off').text()).toBe('off');
    expect(element.parent().find('.toggle-on').text()).toBe('on');
    expect(scope.$emit.calls.allArgs()).toEqual([ [ 'button.toggle', { value: true } ] ]);
  }));

  it('should not emit change event when element is clicked because button is disabled but once enabled, it will emit change event', inject(function ($compile, $rootScope) {
    var scope = $rootScope.$new();
    scope.$emit= jasmine.createSpy();
    var element = $compile('<toggle-button initial-state="false" enable-toggle="enable"></toggle-button>')(scope);
    element.isolateScope().$emit =  scope.$emit;
    scope.$apply();
    element.click();
    scope.$apply();
    //for some reason, using PhantomJS does not change the class...
    //expect(element.parent().attr('class')).toContain('toggle btn btn-primary');
    expect(element.parent().find('.toggle-off').text()).toBe('off');
    expect(element.parent().find('.toggle-on').text()).toBe('on');
    expect(scope.$emit).not.toHaveBeenCalled();
    scope.enable = true;
    scope.$apply();
    element.click();
    scope.$apply();
    expect(scope.$emit.calls.allArgs()).toEqual([ [ 'button.toggle', { value: true } ] ]);
    scope.$emit.calls.reset();
    scope.enable = false;
    scope.$apply();
    element.click();
    scope.$apply();
    expect(scope.$emit).not.toHaveBeenCalled();
  }));

  it('should call change enabled to false value when element is clicked', inject(function ($compile, $rootScope) {
    var scope = $rootScope.$new();
    scope.enable = true;
    spyOn(scope, '$emit');
    var element = $compile('<toggle-button initial-state="true" on="Enabled" off="Disabled" enable-toggle="enable"></toggle-button>')(scope);
    spyOn(element.isolateScope(), '$emit');
    scope.$apply();
    expect(element.parent().attr('class')).toContain('toggle btn btn-primary bonita-toggle');
    element.click();
    scope.$apply();
    //for some reason, using PhantomJS does not change the class...
    //expect(element.parent().attr('class')).toContain('toggle btn btn-default off');
    expect(element.parent().find('.toggle-off').text()).toBe('Disabled');
    expect(element.parent().find('.toggle-on').text()).toBe('Enabled');
    expect(element.isolateScope().$emit.calls.allArgs()).toEqual([ [ 'button.toggle', { value: false } ] ]);
  }));
});
