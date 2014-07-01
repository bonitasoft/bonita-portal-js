'use strict';
angular.module('common', [])
    .service('loggedUserSrv', ['$http', '$q', function ($http, $q) {
        var deferred = $q.defer();
        $http.get('../API/system/session/unusedid')
            .success(function (response) {
                deferred.resolve(response);
            })
            .error(function (response) {
                deferred.reject(response);
            });

        var getLoggedUser = function () {
            return deferred.promise;
        };

        return {
            getLoggedUser: getLoggedUser
        };
    }]);
