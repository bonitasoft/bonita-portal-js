'use strict';

describe('Controller: adminListCtrl', function () {

    beforeEach(module('org.bonita.features.admin.users.list'));

    var scope, User, createController;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _User_) {
        scope = $rootScope.$new();
        User = _User_;
        createController = function () {
            $controller('adminListCtrl', {
                $scope: scope,
                'User': User
            });
        };
    }));

    it('should attach a list of users to the scope', function () {
        spyOn(User, 'search').and.returnValue({
            result: ['user'],
            pagination: { total: 2 }
        });

        createController();

        expect(scope.users.result).toEqual(['user']);
    });
});
