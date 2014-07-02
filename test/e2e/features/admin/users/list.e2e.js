describe('Register', function() {
  'use strict';

  beforeEach(function(){
    //need to use driver directly for browser not to wait for angular to load
    browser.driver.get('http://127.0.0.1:8080/bonita/loginservice?username=william.jobs&password=bpm');
  });

  afterEach(function(){
    browser.driver.get('http://127.0.0.1:8080/bonita/logoutservice');
  });

  it('should display the list of the tenth first users', function() {
    browser.get('http://127.0.0.1:9000/#/admin/users');
    browser.debugger(); //launch protractor with debug option and use 'c' in console to continue test execution
    var userList = $('#userList');
    expect(userList).toBeDefined();
    userList.getWebElement().findElements(By.css('.user')).then(function(users){
      expect(users.length).toBe(10);
      userList.getWebElement().findElement(By.css('#userID-6')).then(function(daniela){
        var danielaText = daniela.getText();
        expect(danielaText).toContain('Daniela');
        expect(danielaText).toContain('Angelo');
        expect(danielaText).toContain('Vice President of Sales');
      });
    });
  });
});
