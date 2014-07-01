(function () {
    'use strict';
    function getContentRangeFromHeader(headers) {
        var strContentRange = headers('Content-Range');
        var arrayContentRange = strContentRange.split('/');
        var arrayIndexNumPerPage = arrayContentRange[0].split('-');
        return {
            total: parseInt(arrayContentRange[1]),
            index: parseInt(arrayIndexNumPerPage[0]),
            currentPage: parseInt(arrayIndexNumPerPage[0])+1,
            numberPerPage: parseInt(arrayIndexNumPerPage[1])
        };
    }
    angular.module('bpmModel', [])
        .service('model', ['$http', function ($http) {
            return {
                search: function (url, searchParams) {
                    var searchObj = {};
                    $http({
                        method: 'GET',
                        url: url,
                        params: {
                            /*p: searchParams.p || '0',
                            c: searchParams.c || '10',
                            o: searchParams.o || '',
                            f: searchParams.f || ''*/
                            p: searchParams.p || '0',
                            c: searchParams.c || '10',
                            o: searchParams.o || null,
                            f: searchParams.f || null,
	                        s: searchParams.s || null
                        }
                    }).success(function (data, status, headers) {
                        var pager = getContentRangeFromHeader(headers);
                        angular.copy({
                            resultset: data,
                            pager: pager
                        }, searchObj);
                    });
                    return searchObj;
                },
                get: function (url, id) {
                    return $http({
                        method: 'GET',
                        url: url + id
                    });
                },
                update: function (url, obj) {
                    return $http({
                        method: 'PUT',
                        url: url + obj.id,
                        data: obj
                    });
                },
                create: function (url, obj) {
                    return $http({
                        method: 'POST',
                        url: url,
                        data: obj
                    });
                }
            };
        }])
        .service('userModel', ['model', function (model) {
            var apiurl = '/bonita/API/identity/user';
            return {
                search: function (searchParams) {
                    return model.search(apiurl, searchParams);
                },
                get: function (id) {
                    return model.get(apiurl, id);
                },
                update: function (user) {
                    return model.update(apiurl, user);
                },
                create: function (user) {
                    return model.create(user);
                }
            };
        }]);

})();
