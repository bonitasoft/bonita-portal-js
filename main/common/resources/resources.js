(function () {
    'use strict';
    /**
    * @ngdoc service
    * @name bonita.common.resources.Resources
    * @description
    * Define the resources accessible from the Bonita API
    */

    var API_PATH = '../API/';

    function parseContentRange(headersGetter) {
        var strContentRange = headersGetter('Content-Range');
        var arrayContentRange = strContentRange.split('/');
        var arrayIndexNumPerPage = arrayContentRange[0].split('-');
        return {
            total: parseInt(arrayContentRange[1]),
            index: parseInt(arrayIndexNumPerPage[0]),
            currentPage: parseInt(arrayIndexNumPerPage[0]) + 1,
            numberPerPage: parseInt(arrayIndexNumPerPage[1])
        };
    }

    angular.module('org.bonita.common.resources', ['ngResource'])
        /**
        * @ngdoc method
        * @name Resources#search
        * @methodOf bonita.common.resources.Resources
        * @description
        * the Resources service decorate the $resource to add a new search
        * function parsing the http header response to find the number of results
        * for the given resource search
        */
        .config(['$provide', function($provide) {
            $provide.decorator('$resource', ['$delegate', function($delegate) {
                return function(url, paramDefaults, actions, options) {
                    actions = angular.extend({}, actions, {
                        'search': { transformResponse: function (data, headersGetter) {
                            return {
                                result: angular.fromJson(data),
                                pagination: parseContentRange(headersGetter)
                            };
                        }}
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
        }]);
})();
