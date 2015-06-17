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

describe('Utils module', function() {

  'use strict';

  var filter;

  beforeEach(module('org.bonitasoft.common.utils.filters'));

  beforeEach(inject(function($filter) {
    filter = $filter;
  }));

  describe('Filter ucFirst', function() {

    it('should transform the first letter of a string to uppercase', function() {
      expect(filter('ucfirst')('string')).toEqual('String');
    });

    it('should not change anything if an uppercase already exist', function() {
      expect(filter('ucfirst')('String')).toEqual('String');
    });

    it('should not throw an error if it is not a String at char1', function() {
      expect(filter('ucfirst')('2string')).toEqual('2string');
    });

    it('should be empty if it is an empty string', function() {
      expect(filter('ucfirst')('')).toEqual('');
    });

    it('should be empty if no string', function() {
      expect(filter('ucfirst')()).toEqual('');
    });

  });

});
