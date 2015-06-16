/**
 * Copyright (C) 2015 Bonitasoft S.A.
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

(function () {
  'use strict';

  angular.module('org.bonitasoft.common.filters.stringTemplater', []).filter('stringTemplater', function () {
    return function (template, replacement) {
      var templteRE = /\{\}/;
      if (!template || !replacement || typeof template !== 'string') {
        return template;
      }
      if (replacement instanceof Array) {
        return replacement.reduce(function (newTemplate, currentReplacement) {
          return newTemplate.replace(templteRE, currentReplacement);
        }, template).replace(/\{\}/g, '');
      } else {
        return template.replace(templteRE, replacement).replace(/\{\}/g, '');
      }
    };
  });
})();
