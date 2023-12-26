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

describe('dateI18n filter', function() {

  'use strict';

  var window, dateI18nFilter, moment;

  beforeEach(module('org.bonitasoft.common.moment'));

  beforeEach(inject(function(_dateI18nFilter_, _$window_, _moment_) {
    dateI18nFilter = _dateI18nFilter_;
    window = _$window_;
    moment = _moment_;
  }));

  it('should return an empty string if no input', function() {
    expect(dateI18nFilter()).toBe('');
  });

  it('should throw an error if no output filter is set', function() {
    expect(function() {
      dateI18nFilter(Date.now());
    }).toThrowError('[com.bonitasoft.common.i18n.filters@dateI18nFilter] You cannot use the date filter without a format');
  });

  it('should convert a date to a specific format', function() {
    // January 07 2015
    expect(dateI18nFilter(1420621013493, 'YYYY')).toBe('2015');
  });

  it('should convert a string representation of epoc time to a specific format', function() {
    // January 07 2015
    expect(dateI18nFilter('1420621013493', 'YYYY')).toBe('2015');
  });

  it('should be localized', function() {
    moment.locale('fr');
    expect(dateI18nFilter(1415281485491, 'MMMM')).toBe('novembre');
  });

});
