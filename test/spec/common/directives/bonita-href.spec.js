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

describe('goThroughPortal', function () {
  'use strict';

  var manageTopUrl, compile;

  beforeEach(module('org.bonitasoft.common.directives.bonitaHref'));

  beforeEach(function () {
    inject(function ($rootScope, $compile, _manageTopUrl_) {
      compile = function (html) {
        var scope = $rootScope.$new();
        var element = $compile(html)(scope);
        scope.$apply();
        return element;
      };
      manageTopUrl = _manageTopUrl_;
      spyOn(manageTopUrl, 'goTo');
    });
  });

  it('should call manageTopUrl when click is called', function () {
    var destination = {};
    var element = compile('<a bonita-href="'+JSON.stringify(destination)+'"></a>');
    element.trigger('click');
    expect(manageTopUrl.goTo.calls.allArgs()).toEqual([[destination]]);
  });

  it('should call manageTopUrl with destination params when click is called', function () {
    var destination = {token : 'caselistingadmin', '_tab' : 'archived'};
    var element = compile('<a bonita-href="'+JSON.stringify(destination).replace(/"/g,'\'')+'"></a>');
    element.trigger('click');
    expect(manageTopUrl.goTo.calls.allArgs()).toEqual([[destination]]);
  });


  it('should call manageTopUrl with simple destination params when click is called', function () {
    var destination = 'caselistingadmin';
    var element = compile('<a bonita-href="'+destination+'"></a>');
    element.trigger('click');
    expect(manageTopUrl.goTo.calls.allArgs()).toEqual([[destination]]);
  });
});
