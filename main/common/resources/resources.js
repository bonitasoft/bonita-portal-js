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
   * @ngdoc service
   * @name bonita.common.resources.Resources
   * @description
   * Define the resources accessible from the Bonita API
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

  var contentRangeInterceptor = {
    response: function(response) {
      response.resource.pagination = parseContentRange(response.headers('Content-Range'));
      return response;
    }
  };

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

  var resourceDecorator = ['$delegate', '$http',
    function($delegate, $http) {
      return function(url, paramDefaults, actions, options) {
        //in angular 1.4 use angular.merge instead of angular.extend
        actions = angular.extend({}, actions, {
          'search': angular.extend({
            isArray: true,
            interceptor: contentRangeInterceptor
          }, actions && actions.search),

          'update': angular.extend({
            method: 'PUT',
            // we add our transform request first, before object serialization
            // It will remove id key from data to avoid API error for non allowed parameters
            transformRequest: [updateTransformRequest].concat($http.defaults.transformRequest)
          }, actions && actions.update)
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

          if (rejection.status === 401 && !/\/API\/platform\/license/.test(rejection.config.url)) {
            $window.parent.location.reload();
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
    'commentAPI': 'bpm/comment',
    'archivedCommentAPI': 'bpm/archivedComment',
    'categoryAPI': 'bpm/category',
    'customPageAPI': 'portal/page',
    'featureAPI': 'system/feature',
    'flowNodeAPI': 'bpm/flowNode',
    'archivedFlowNodeAPI': 'bpm/archivedFlowNode',
    'formMappingAPI': 'form/mapping',
    'groupAPI': 'identity/group',
    'archivedHumanTaskAPI': 'bpm/archivedHumanTask',
    'humanTaskAPI': 'bpm/humanTask',
    'i18nAPI': 'system/i18ntranslation',
    'personalDataAPI': 'identity/personalcontactdata',
    'processAPI': 'bpm/process',
    'processSupervisorAPI': 'bpm/processSupervisor',
    'processResolutionProblemAPI': 'bpm/processResolutionProblem',
    'professionalDataAPI': 'identity/professionalcontactdata',
    'profileAPI': 'portal/profile',
    'roleAPI': 'identity/role',
    'userAPI': 'identity/user',
    'sessionAPI': 'system/session',
    'tenantAdminAPI': 'system/tenant',
  });

  module.factory('userTaskAPI', function($http) {
    /*jshint camelcase: false */
    var userTaskAPI = {};
    userTaskAPI.execute = function(taskId, data) {
      return $http({
        url: API_PATH + 'bpm/userTask/'+ taskId +'/execution',
        method: 'POST',
        data: data
      });
    };
    return userTaskAPI;
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
        interceptor: contentRangeInterceptor
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

  module.factory('parameterAPI', function($http, $resource) {
    /*jshint camelcase: false */
    return $resource(API_PATH + 'bpm/processParameter/:process_id/:name', {
      'process_id': '@process_id',
      'name': '@name'
    }, {
      'search': {
        isArray: true,
        url: API_PATH + 'bpm/processParameter/',
        interceptor: contentRangeInterceptor
      },
      'update': {
        transformRequest: function(data) {
          delete data.process_id;
          delete data.name;
          return angular.toJson(data);
        },
        method: 'PUT'
      }
    });
  });

  module.factory('customUserInfoAPI', function ($http, $resource) {
    /*jshint camelcase: false */
    return $resource(API_PATH + 'customuserinfo/user/:id', {
      'id': '@id'
    }, {
      'update': {
        url: API_PATH + 'customuserinfo/value/:userId/:id',
        method: 'PUT',
        params: {
          userId: '@userId',
          id: '@id'
        }
      }
    });
  });

  module.factory('membershipAPI', function ($http, $resource) {
    /*jshint camelcase: false */
    return $resource(API_PATH + 'identity/membership/:id', {
      'id': '@id'
    }, {
      'delete': {
        url: API_PATH + 'identity/membership/:userId/:groupId/:roleId',
        method: 'DELETE',
        params: {
          userId: '@userId',
          groupId: '@groupId',
          roleId: '@roleId'
        }
      }
    });
  });

  module.factory('bdmAPI', function($http) {
    /*jshint camelcase: false */
    var bdmAPI = {};
    bdmAPI.save = function(options) {
      return $http({
        url: API_PATH + 'tenant/bdm',
        method: 'POST',
        data: {
          'fileUpload': '' + options.fileUpload
        }
      });
    };
    bdmAPI.get = function() {
      return $http({
        url: API_PATH + 'tenant/bdm',
        method: 'GET'
      });
    };

    return bdmAPI;
  });
})();
