'use strict';

describe('Controller: adminListCtrl', function () {

    beforeEach(module('bonita.admin.users.list'));

    var scope, User;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _User_) {
        scope = $rootScope.$new();
        User = _User_;
        $controller('adminListCtrl', {
            $scope: scope,
            'User': User
        });
    }));

    it('should attach a list of users to the scope', function () {
        spyOn(User, 'search').and.returnValue({
            result: ['user'],
            pagination: { total: 2 }
        });

        scope.$apply();

        expect(scope.users.result).toEqual(['user']);
    });
});
