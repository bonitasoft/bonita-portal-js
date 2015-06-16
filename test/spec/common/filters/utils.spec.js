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
