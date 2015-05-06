(function() {
  'use strict';
  /**
   * org.bonitasoft.service.process.errorMessage Module
   *
   * Description
   */
  angular.module('org.bonitasoft.service.process.resolution', ['gettext'])
  .value('ProcessResolutionProblemItems', {
    actor: 'Entity Mapping must be resolved before enabling the Process.',
    connector: 'Connector definitions must be resolved before enabling the Process.',
    parameter: 'Parameters must be resolved before enabling the Process.',
    'business data': 'The business data: [ {} ] uses Business Objects which are not defined in the current Business Data model. Deploy a compatible Business Data model before enabling the process.'
  })
  .service('ProcessProblemResolutionService', function(gettextCatalog, ProcessResolutionProblemItems) {
    var processProblemResolutionService = {};
    processProblemResolutionService.title = gettextCatalog.getString('The Process cannot be enabled');
    processProblemResolutionService.buildProblemsList = function(stateResolverList) {
      var problemList = [];
      if (!_.isArray(stateResolverList)) {
        return problemList;
      }

      angular.forEach(ProcessResolutionProblemItems, function(value, key) {
        var problemAndRessources = stateResolverList.filter(function(item) {
          return item.type === key;
        });
        if(problemAndRessources.length){
          var problem = {
            type: key,
            message: gettextCatalog.getString(value)
          };
          var args = _.chain(problemAndRessources).pluck('ressource_id').compact().value();
          if(_.isArray(args) && _.size(args) > 0) {
            problem.args = (_.size(args) > 2 ? _.take(args, 2).join(', ') + ',...' : args.join(', '));
          }


          problemList.push(problem);
        }
      });
      return problemList;
    };
    return processProblemResolutionService;
  });
})();
