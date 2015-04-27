(function() {
  'use strict';
  /**
   * @ngdoc service
   * @name bonita.common.resources.Resources
   * @description
   * Define the resources accessible from the Bonita API
   */

  var API_PATH = '../API/';

  /**
   * @internal
   * Parse Content-Range header and return an object with pagination infos
   * @param  {String} strContentRange Content-Range header attribute
   * @return {Object}                 pagination object
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

  var resourceDecorator = ['$delegate',
    function($delegate) {
      return function(url, paramDefaults, actions, options) {
        //in angular 1.4 use angular.merge instead of angular.extend
        actions = angular.extend({}, actions, {
          'search': angular.extend({
            isArray: true,
            interceptor: {
              response: function(response) {
                response.resource.pagination = parseContentRange(response.headers('Content-Range'));
                return response;
              }
            }
          }, actions && actions.search),

          'update': angular.extend({method: 'PUT'}, actions && actions.update)
        });
        return $delegate(url, paramDefaults, actions, options);
      };
    }
  ];

  var module = angular.module('org.bonitasoft.common.resources', ['ngResource'])
    .constant('API_PATH', API_PATH)

  /**
   * @ngdoc method
   * @name Resources#search
   * @methodOf bonita.common.resources.Resources
   * @description
   * the Resources service decorate the $resource to add a new search
   * function parsing the http header response to find the number of results
   * for the given resource search
   */
  .config(function($provide, $httpProvider) {
    $httpProvider.interceptors.push('unauthorizedResponseHandler');
    $provide.decorator('$resource', resourceDecorator);
  })

  .factory('unauthorizedResponseHandler',
    function($q, $window) {
      return {
        'responseError': function(rejection) {
          if (rejection.status === 401) {
            $window.top.location.reload();
          }
          return $q.reject(rejection);
        }
      };
    }
  );


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
  (function(resources) {
    angular.forEach(resources, function(path, name) {
      module.factory(name, ['$resource',
        function($resource) {
          return $resource(API_PATH + path + '/:id', {
            id: '@id'
          });
        }
      ]);
    });
  })({
    'actorAPI': 'bpm/actor',
    'actorMemberAPI': 'bpm/actorMember',
    'archivedCaseAPI': 'bpm/archivedCase',
    'applicationAPI': 'living/application',
    'applicationMenuAPI': 'living/application-menu',
    'applicationPageAPI': 'living/application-page',
    'caseAPI': 'bpm/case',
    'categoryAPI': 'bpm/category',
    'customPageAPI': 'portal/page',
    'featureAPI': 'system/feature',
    'flowNodeAPI': 'bpm/flowNode',
    'formMappingAPI': 'form/mapping',
    'groupAPI': 'identity/group',
    'humanTaskAPI': 'bpm/humanTask',
    'i18nAPI': 'system/i18ntranslation',
    'membershipAPI': 'identity/membership',
    'parameterAPI': 'bpm/processParameter',
    'personalDataAPI': 'identity/personalcontactdata',
    'processAPI': 'bpm/process',
    'processResolutionProblemAPI': 'bpm/processResolutionProblem',
    'professionalDataAPI': 'identity/professionalcontactdata',
    'profileAPI': 'portal/profile',
    'roleAPI': 'identity/role',
    'userAPI': 'identity/user'
  });

  module.factory('importApplication',
    function($resource) {
      return $resource('../services/application/import', {
        importPolicy: '@importPolicy',
        applicationsDataUpload: '@applicationsDataUpload'
      });
    }
  );


  module.factory('processCategoryAPI', function($http) {
    /*jshint camelcase: false */
    var processCategoryAPI = {};
    processCategoryAPI.save = function(options) {
      return $http({
        url: API_PATH + 'bpm/processCategory',
        method: 'POST',
        data: {
          'category_id': '' + options.category_id,
          'process_id': '' + options.process_id
        }
      });
    };
    processCategoryAPI.delete = function(options) {
      return $http({
        url: API_PATH + 'bpm/processCategory',
        method: 'DELETE',
        data: [options.process_id + '/' + options.category_id]
      });
    };
    return processCategoryAPI;
  });

  module.factory('processConnectorAPI', function($http, $resource) {
    /*jshint camelcase: false */
    return $resource(API_PATH + 'bpm/processConnector/:process_id/:definition_id/:definition_version', {
      'process_id': '@process_id',
      'definition_id': '@definition_id',
      'definition_version': '@definition_version'
    }, {
      'search': {
        isArray: true,
        url: API_PATH + 'bpm/processConnector/',
        interceptor: {
          response: function(response) {
            response.resource.pagination = parseContentRange(response.headers('Content-Range'));
            return response;
          }
        }
      },
      'update': {
        transformRequest: function(data) {
          delete data.process_id;
          delete data.definition_id;
          delete data.definition_version;
          return angular.toJson(data);
        },
        method: 'PUT'
      }

    });
  });
})();
