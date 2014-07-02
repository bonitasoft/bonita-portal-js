describe('Register', function() {
  'use strict';
  it('should display the list of the tenth first users', function() {
    browser.get('#/admin/users');
    var userList = $('#userList');
    expect(userList.length).toBe(10);
  });
});
