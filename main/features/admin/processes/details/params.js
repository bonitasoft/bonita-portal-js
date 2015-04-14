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
    'xeditable'
  ])
    .controller('ProcessParamsCtrl', function(parameters, FeatureManager, process, parameterAPI, $log) {
      var vm = this;
      vm.parameters = parameters;
      vm.process = process;

      vm.booleanValues = [{
        value: 'true'
      }, {
        value: 'false'
      }];
      vm.showActions = FeatureManager.isFeatureAvailable('POST_DEPLOY_CONFIG');


      vm.updateParameter = function(parameter, $data){

        /* jshint camelcase : false */
        return parameterAPI.update({
          'id': parameter.process_id + '/' + parameter.name,
          description: parameter.description,
          name: parameter.name,
          value: $data,
          type: parameter.type
        }).$promise.then(angular.noop, function(errorData) {
          $log.error('error updating parameter : ' , errorData);
          return errorData.data.message;
        });
      };

    });
})();