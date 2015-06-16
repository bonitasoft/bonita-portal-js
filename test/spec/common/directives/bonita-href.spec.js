/** Copyright (C) 2015 Bonitasoft S.A.
 * Bonitasoft, 32 rue Gustave Eiffel - 38000 Grenoble
 * This library is free software; you can redistribute it and/or modify it under the terms
 * of the GNU Lesser General Public License as published by the Free Software Foundation
 * version 2.1 of the License.
 * This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public License along with this
 * program; if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth
 * Floor, Boston, MA 02110-1301, USA.
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
