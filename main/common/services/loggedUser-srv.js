'use strict';
angular.module('common', [])
    .service('loggedUserSrv', ['$http', '$q', function ($http, $q) {
        var deferred = $q.defer();
        $http.get('../API/system/session/unusedid')
            .success(function (data, status, headers, config) {
                deferred.resolve(response);
            })
            .error(function (data, status, headers, config) {
                deferred.reject({data:data, status:status, headers:headers, config:config});
            });

        var getLoggedUser = function () {
            return deferred.promise;
        };

        return {
            getLoggedUser: getLoggedUser
        };
    }]);
