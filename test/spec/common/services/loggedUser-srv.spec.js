/*jshint camelcase: false */
'use strict';

describe('Service: loggedUser-srv', function () {

    beforeEach(module('common'));

    var deferred,
        loggedUserSrv,
        promise,
        resolvedValue;

    var user = {
        last_connection: '',
        created_by_user_id: '1',
        creation_date: '2014-06-11 12:06:12.827',
        id: '22',
        icon: '/default/icon_user.png',
        enabled: 'true',
        title: 'Mrs',
        manager_id: '18',
        job_title: 'Account manager',
        userName: 'giovanna.almeida',
        lastname: 'AlmeidaTest',
        firstname: 'Giovanna',
        password: '',
        last_update_date: '2014-06-11 12:06:12.827'
    };

    beforeEach(inject(function ($q, $rootScope, _loggedUserSrv_, $httpBackend) {

        deferred = $q.defer();
        loggedUserSrv = _loggedUserSrv_;
        //promise = loggedUserSrv.getLoggedUser();
        promise = deferred.promise;

        $httpBackend.expectGET('../API/system/session/unusedid')
            .respond(user);

        promise.then(function (value) {
            resolvedValue = value;
        });
    }));

    it('should simulate promise return undefined', inject(function () {
        expect(resolvedValue).toBeUndefined();
    }));

    it('should simulate promise return user', inject(function ($rootScope) {

        // Simulate resolving of promise
        deferred.resolve(user);

        // Propagate promise resolution to 'then' functions using $apply().
        $rootScope.$apply();
        expect(resolvedValue).toEqual(user);
    }));
});
