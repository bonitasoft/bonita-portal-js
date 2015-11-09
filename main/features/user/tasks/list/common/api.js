(function() {
  'use strict';

  /**
   * ngResources based service to intereact with the bonita API
   */

  var API_PATH = '../API/';

  /**
   * Helper method wich remove the id parameter in the request object
   * Removing id avoid API error for not allowed parameters
   * @param  {Object} req a request object
   * @return {Object}     a request object without a id key
   */
  function updateTransformRequest(req) {
    if (req.hasOwnProperty('id')) {
      delete req.id;
    }
    return req;
  }

  /**
   * helper method which extract pagination data from Content-range HTTP header
   * @param  {String} strContentRange Content-Range value
   * @return {Object}                 object containing pagination
   */
  function parseContentRange(strContentRange) {
    if (strContentRange === null) {
      return {};
    }
    var arrayContentRange = strContentRange.split('/');
    var arrayIndexNumPerPage = arrayContentRange[0].split('-');
    return {
      total: parseInt(arrayContentRange[1], 10),
      index: parseInt(arrayIndexNumPerPage[0], 10),
      currentPage: parseInt(arrayIndexNumPerPage[0], 10) + 1,
      numberPerPage: parseInt(arrayIndexNumPerPage[1], 10)
    };
  }


  /**
   * list of ngResources factory to create
   * @type {Object}
   */
  var apiResources = {
    //identity
    User: 'identity/user',
    Membership: 'identity/membership',
    ProfessionalData: 'identity/professionalcontactdata',
    PersonalData: 'identity/personalcontactdata',

    //bpm
    Case: 'bpm/case',
    FlowNode: 'bpm/flowNode',
    HumanTask: 'bpm/humanTask',
    Process: 'bpm/process',
    ArchivedHumanTask: 'bpm/archivedHumanTask',
    ProcessSupervisor: 'bpm/processSupervisor',
    ArchivedFlowNode: 'bpm/archivedFlowNode',
    Comment: 'bpm/comment',

    //portal
    Profile: 'portal/profile'
  };



  /**
   * @ngdoc service
   * @name common.resources
   * @description
   * Define the resources accessible from the Bonita API
   */

  var mod = angular
    .module('common.resources', ['ngResource'])
    .constant('API_PATH', API_PATH)
    .value('apiResources', apiResources)
    /**
     * @ngdoc method
     * @name Resources#search
     * @methodOf bonita.common.resources.Resources
     * @description
     * the Resources service decorate the $resource to add a new search
     * function parsing the http header response to find the number of results
     * for the given resource search
     */
    .config(['$provide',
      function($provide) {
        $provide.decorator('$resource', ['$delegate', '$http',
          function($delegate, $http) {
            return function(url, paramDefaults, actions, options) {
              actions = angular.extend({}, actions, {
                'search': {
                  isArray: true,
                  interceptor: {
                    response: function(response) {
                      response.resource.pagination = parseContentRange(response.headers('Content-Range'));
                      return response;
                    }
                  }
                },
                'update': {
                  method: 'PUT',
                  // we add our transform request first, before object serialization
                  // It will remove id key from data to avoid API error for non allowed parameters
                  //transformRequest: [updateTransformRequest].concat($http.defaults.transformRequest)
                }

              });
              return $delegate(url, paramDefaults, actions, options);
            };
          }
        ]);
      }
    ]);


  /**
   * @ngdoc service
   * @name bonita.common.resources:User
   * @requires $resource
   * @description
   *
   * var user = User.get({ id: 1 });
   *
   * User is then empty but can be use in a scope.
   * It will be filled with its actual values once the http request is back.
   * We still can use the associated promise to use the data as soon as it gets back.
   *
   * user.$promise.then(function (user) {
   *  console.log(user);
   * });
   *
   **/

  angular.forEach(apiResources, function(resourceUrl, resourceName) {
    mod.factory(resourceName, ['$resource',
      function($resource) {
        return $resource(API_PATH + resourceUrl + '/:id', {
          id: '@id'
        });
      }
    ]);
  });

  mod.factory('I18N', ['$resource',
    function($resource) {
      return $resource(API_PATH + 'system/i18ntranslation/');
    }
  ]);

  mod.factory('session', ['$resource',
    function($resource) {
      return $resource(API_PATH + 'system/session/unusedId');
    }
  ]);
})();