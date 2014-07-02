'use strict';
angular.module('org.bonita.common.logged-user', [])
    .service('loggedUser', ['$http', '$q', function ($http, $q) {

        var deferred = $q.defer();

        $http.get('../API/system/session/unusedid')
            .success(function (data) {
                deferred.resolve(data);
            })
            .error(function (data, status, headers, config) {
                deferred.reject({data: data, status: status, headers: headers, config: config});
            });

        var getLoggedUser = function () {
            return deferred.promise;
        };

        return {
            getLoggedUser: getLoggedUser
        };
    }]);
