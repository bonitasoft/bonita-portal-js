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
/* global element, protractor */
(function() {
  'use strict';
  describe('urlified directive', function(){

    beforeEach(function () {
      browser.get('#/admin/applications');
    });

    it('should not put the cursor at the end of the field', function() {
      // given
      element(By.id('create-application')).click();
      var initialValue = 'initial-value';
      var tokenInput = element(By.css('input[name=\'token\']'));
      tokenInput.sendKeys(initialValue);

      //when
      var prependValue = 'prepend-value-';
      tokenInput.sendKeys(protractor.Key.HOME);//set the caret at the begining
      tokenInput.sendKeys(prependValue);//type prependValue

      //then
      expect(tokenInput.getAttribute('value')).toBe(prependValue+initialValue);

    });
  });
})();
