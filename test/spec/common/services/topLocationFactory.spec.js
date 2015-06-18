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

describe('topLocationFactory', function () {
  'use strict';

  var topLocation, $window;

  beforeEach(module('org.bonitasoft.services.navigation'));

  beforeEach(function () {
    $window = {top: {location: {}}};

    module(function ($provide) {
      $provide.value('$window', $window);
    });

    inject(function (_topLocation_) {
      topLocation = _topLocation_;
    });
  });

  it('should retrieve profile from top window hash', function () {
    $window.top.location.hash = '_pf=2';
    expect(topLocation._pf).toBe('2');
  });

  it('should return undefined when there is no profile defined in the top window hash', function () {
    expect(topLocation._pf).toBeUndefined();
  });

  it('should retrieve tenant from top window query string', function () {
    $window.top.location.search = 'tenant=4';
    expect(topLocation.tenant).toBe('4');
  });

  it('should return undefined when there is no tenant defined in the top window query string', function () {
    expect(topLocation.tenant).toBeUndefined();
  });
});
