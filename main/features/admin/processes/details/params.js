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

(function() {
  'use strict';
  /**
   * org.bonitasoft.features.admin.processes.details.params Module
   *
   * list params
   */
  angular.module('org.bonitasoft.features.admin.processes.details.params', [
    'org.bonitasoft.common.resources',
    'org.bonitasoft.service.features',
    'xeditable',
    'org.bonitasoft.services.i18n'
  ]).constant('TYPE_ERROR_MESSAGE', {
    'java.lang.Boolean': {
      message: 'processDetails.params.control.boolean',
      checkvalueMatchType: function(data) {
        return data === 'true' || data === 'false' || data === true || data === false;
      }
    },
    'java.lang.Double': {
      message: 'processDetails.params.control.double',
      checkvalueMatchType: function(data) {
        return (_.isString(data) && !isNaN(parseFloat(data))) || _.isNumber(data);
      }
    },
    'java.lang.Integer': {
      message: 'processDetails.params.control.integer',
      checkvalueMatchType: function(data) {
        return (_.isString(data) && Number(data) % 1 === 0) || (_.isNumber(data) && data % 1 === 0);
      }
    }
  })
    .controller('ProcessParamsCtrl', function(parameters, FeatureManager, process, parameterAPI, $log, $scope, i18nService, TYPE_ERROR_MESSAGE) {
      var vm = this;
      vm.parameters = parameters;
      vm.process = process;

      vm.booleanValues = [{
        value: 'true'
      }, {
        value: 'false'
      }];
      vm.showActions = FeatureManager.isFeatureAvailable('POST_DEPLOY_CONFIG');


      vm.updateParameter = function(parameter, data) {
        if (angular.isDefined(TYPE_ERROR_MESSAGE[parameter.type]) && !TYPE_ERROR_MESSAGE[parameter.type].checkvalueMatchType(data)) {
          return i18nService.getKey(TYPE_ERROR_MESSAGE[parameter.type].message);
        }
        /* jshint camelcase : false */
        return parameterAPI.update({
          'process_id': parameter.process_id,
          description: parameter.description,
          name: parameter.name,
          value: data,
          type: parameter.type
        }).$promise.then(function() {
          $scope.$emit('process.refresh');
        }, function(errorData) {
          $log.error('error updating parameter : ', errorData);
          return errorData.data.message;
        });
      };

    });
})();
