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


      vm.updateParameter = function(parameter, data){

        switch(parameter.type){
          case 'java.lang.Boolean':
            if(data !== 'true' && data !== 'false'){
              return 'Error: value must be a boolean';
            }
            break;
          case 'java.lang.Double':
            if(isNaN(parseFloat(data))){
              return 'Error: value must be a double';
            }
            break;
          case 'java.lang.Integer':
            if(data % 1 !== 0){
              return 'Error: value must be an integer';
            }
            break;
        }
        /* jshint camelcase : false */
        return parameterAPI.update({
          'id': parameter.process_id + '/' + parameter.name,
          description: parameter.description,
          name: parameter.name,
          value: data,
          type: parameter.type
        }).$promise.then(angular.noop, function(errorData) {
          $log.error('error updating parameter : ', errorData);
          return errorData.data.message;
        });
      };

    });
})();
