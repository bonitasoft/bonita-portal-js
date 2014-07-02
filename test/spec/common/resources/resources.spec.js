(function () {
    'use strict';

    describe('User', function () {

        beforeEach(module('org.bonita.common.resources'));

        var $httpBackend, User;

        beforeEach(inject(function ($q, $rootScope, _$httpBackend_, _User_) {
            $httpBackend = _$httpBackend_;
            User = _User_;
        }));

        it('should get user specified by the id', inject(function () {

            $httpBackend.expectGET('../API/identity/user/123').respond({
                id: 123
            });

            var user = User.get({ id: 123 });
            $httpBackend.flush();

            expect(user.id).toBe(123);
        }));

        it('should search an users and return an array also containing pagination', inject(function () {

            $httpBackend.expectGET('../API/identity/user?c=10&p=0').respond(function () {
                return [200, [{ id: 1 }, { id: 2 }], {'Content-Range': '0-10/10'}];
            });

            var users = User.search({ p: 0, c: 10 });
            $httpBackend.flush();

            expect(users.result).toEqual([{ id: 1 }, { id: 2 }]);
            expect(users.pagination).toEqual({ total : 10, index : 0, currentPage : 1, numberPerPage : 10 });
        }));
    });
})();
