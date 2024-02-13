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

  function toggleError(scope, property, value) {
    scope.error = value && scope.form[property.field].$dirty;
    scope.errorMessage = scope.errors[property.name];
  }

  function watch(scope, property, callback) {
    scope.$parent.$watch(property.fullName, function (value) {
      callback(scope, property, value);
    });
  }

  angular.module('org.bonitasoft.common.directives.bootstrap-form-control', [])
    .directive('bootstrapFormControl', function ($log) {

      return {
        restrict: 'AE',
        transclude: true,
        scope: {
          label: '@',
          form: '=',
          errors: '='
        },
        template: '<div class="form-group has-feedback"><label for="{{ id }}" class="control-label">{{ label }}<span ng-if="required" style="color:red"> *</span></label><span ng-show="error" class="glyphicon glyphicon-warning-sign form-control-feedback"></span><ng-transclude></ng-transclude><span class="help-block" ng-show="error">{{ errorMessage }}</span></div>',
        link: function (scope, element) {
          var input = element.find('input, textarea, select');
          scope.id = input.attr('id');
          scope.required = input.attr('required');
          var name = input.attr('name');

          input.addClass('form-control');

          scope.$watch('error', function () {
            element.toggleClass('error has-error', !!scope.error);
          });

          if (angular.isUndefined(name)) {
            $log.error(scope.id + ' doesn\'t specify a name attribute');
          } else {
            for (var property in scope.errors) {
              if (scope.errors.hasOwnProperty(property)) {
                watch(scope, {
                  field: name,
                  name: property,
                  fullName: scope.form.$name + '.' + name + '.' + property
                }, toggleError);
              }
            }
          }
        }
      };
    });
})();
