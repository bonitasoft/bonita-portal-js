'use strict';

describe('Controller: adminListCtrl', function () {

    beforeEach(module('org.bonita.features.admin.users.list'));

    var scope, User, createController, loggedUser, rootScope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _User_, $q) {
        scope = $rootScope.$new();
        User = _User_;
        rootScope = $rootScope;
        loggedUser = {
                getLoggedUser: function () {
                    var deferred = $q.defer();
                    deferred.resolve({
                        'user_id': '2'
                    });
                    return deferred.promise;
                }
            };
        createController = function () {
            $controller('adminListCtrl', {
                $scope: scope,
                'User': User,
                'loggedUser' : loggedUser
            });
        };
    }));

    it('should attach a list of users to the scope', function () {
        spyOn(User, 'search').and.returnValue({
            result: ['user'],
            pagination: { total: 2 }
        });

        createController();
        rootScope.$apply();
        expect(scope.users.result).toEqual(['user']);
    });
});
