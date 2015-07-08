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

(function () {
  'use strict';
  describe('resizable column directive', function () {

    var scope;

    beforeEach(module('org.bonitasoft.common.table.resizable'));

    beforeEach(inject(function ($rootScope) {
      scope = $rootScope.$new();
    }));

    var compile, timeout;
    beforeEach(inject(function ($rootScope, _$compile_, $timeout) {
      compile = _$compile_;
      scope = $rootScope.$new();
      timeout = $timeout;
      scope.columns = [];
    }));

    afterEach(function () {
      timeout.verifyNoPendingTasks();
    });
    it('should call the jQuery Plugin resizable-column function', function () {
      var element = compile('<div><table resizable-column="columns"><thead><tr><th>column 1</th><th>column 2</th></tr></thead><tbody><tr><td>content 1</td><td>content 2</td></tr></tbody></table></div>')(scope);
      element[0].style.width = 1000;
      scope.columns.push('test2');
      scope.$apply();
      timeout.flush();
      expect(element.find('.rc-handle').length).toBe(1);
      scope.columns.push('test');
      element.find('tr th').parent().first().append('<th>new column 1</th><th>new column 2</th>');
      element.find('tr td').parent().first().append('<td>new content 1</td><td>new content 2</td>');
      scope.$apply();
      timeout.flush();
      element.find('tr th').first().remove();
      element.find('tr td').first().remove();
      scope.columns.pop();
      scope.$apply();
      timeout.flush();
      expect(element.find('.rc-handle').length).toBe(2);
    });
  });
})();
