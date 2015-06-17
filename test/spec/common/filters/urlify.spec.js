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

describe('urlify', function() {
  'use strict';

  var urlify;

  beforeEach(module('org.bonitasoft.common.filters.urlify'));

  beforeEach(inject(function($filter) {
    urlify = $filter('urlify');
  }));

  it('should replace spaces by dash in input', function () {
    expect(urlify('foo bar')).toBe('foo-bar');
  });

  it('should only leave url friendly characters in input', function () {
    expect(urlify('foo !@#$%^&*()_+=-[]{}|\'~.bar')).toBe('foo-_-~.bar');
  });

  it('should not throw an error when input is undefined', function () {
    expect(urlify(undefined)).toBe(undefined);
  });
});
