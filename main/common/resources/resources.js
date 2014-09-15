(function () {
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
     * a specific transformResponse apply for Resources#search
     * Wrap result array inside an object and add pagination data
     * @see Resources#search
     */
    function searchTransformResponse(data, headers) {
        return {
            result: data,
            pagination: parseContentRange(headers('Content-Range'))
        };
    }

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

  angular.module('org.bonita.common.resources', ['ngResource'])
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
    .config(['$provide', function ($provide) {
      $provide.decorator('$resource', ['$delegate', function ($delegate) {
        return function (url, paramDefaults, actions, options) {
          actions = angular.extend({}, actions, {
            'search': {
              isArray: true,
              interceptor: {
                response: function (response) {
                  response.resource.pagination = parseContentRange(response.headers('Content-Range'));
                  return response;
                }
              }},
            'update': {
              method: 'PUT'
            }

          });
          return $delegate(url, paramDefaults, actions, options);
        };
      }]);
    }])

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
    .factory('User', ['$resource', function ($resource) {
      return $resource(API_PATH + 'identity/user/:id', { id: '@id' });
    }])

    .factory('Case', ['$resource', function ($resource) {
      return $resource(API_PATH + 'bpm/case/:id', { id: '@id' });
    }])

    .factory('Process', ['$resource', function ($resource) {
      return $resource(API_PATH + 'bpm/process/:id', { id: '@id' });
    }])

    .factory('HumanTask', ['$resource', function ($resource) {
      return $resource(API_PATH + 'bpm/humanTask/:id', { id: '@id' });
    }])
    .factory('I18N', ['$resource', function ($resource) {
      return $resource(API_PATH + 'system/i18ntranslation/');
    }])
    .factory('Profile', ['$resource', function ($resource) {
      return $resource(API_PATH + 'portal/profile/:id', { id: '@id' });
    }])
    .factory('Membership', ['$resource', function ($resource) {
      return $resource(API_PATH + 'identity/membership/:id', { id: '@id' });
    }])
    .factory('ProfessionalData', ['$resource', function ($resource) {
      return $resource(API_PATH + 'identity/professionalcontactdata/:id', { id: '@id' });
    }])
    .factory('PersonalData', ['$resource', function ($resource) {
      return $resource(API_PATH + 'identity/personalcontactdata/:id', { id: '@id' });
    }]);
})();
