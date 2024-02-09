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

describe('locale service', function() {

  'use strict';

  var locale, $cookies;

  beforeEach(module('org.bonitasoft.common.i18n'));

  beforeEach(inject(function(_$cookies_, _locale_) {
    $cookies = _$cookies_;
    locale = _locale_;
  }));

  afterEach(function() {
    $cookies.remove('BOS_Locale');
  });

  it('should get locale from BOS_LOCALE cookie key', function() {
    $cookies.put('BOS_Locale', 'fr');
    expect(locale.get()).toBe('fr');
  });

  it('should get en when no bos locale is set in cookies', function() {
    $cookies.remove('BOS_Locale');
    expect(locale.get()).toBe('en');
  });
});
