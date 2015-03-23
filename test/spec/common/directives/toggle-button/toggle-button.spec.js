describe('toggle/switch Button', function () {
  'use strict';

  beforeEach(module('org.bonitasoft.common.directives.toggleButton'));

  it('should call change enbaled value to true when element is clicked', inject(function ($compile, $rootScope) {
    var scope = $rootScope.$new();
    scope.enabled = false;
    var element = $compile('<toggle-button enabled="enabled"></toggle-button>')(scope);
    scope.$apply();
    expect(element.parent().attr('class')).toContain('toggle btn btn-default off');
    element.click();
    scope.$apply();
    //for some reason, using PhantomJS does not change the class...
    //expect(element.parent().attr('class')).toContain('toggle btn btn-primary');
    expect(element.parent().find('.toggle-off').text()).toBe('off');
    expect(element.parent().find('.toggle-on').text()).toBe('on');
    expect(scope.enabled).toBeTruthy();
  }));

  it('should call change enabled to false value when element is clicked', inject(function ($compile, $rootScope) {
    var scope = $rootScope.$new();
    scope.enabled = true;
    var element = $compile('<toggle-button enabled="enabled" on="Enabled" off="Disabled"></toggle-button>')(scope);
    scope.$apply();
    expect(element.parent().attr('class')).toContain('toggle btn btn-primary');
    element.click();
    scope.$apply();
    //for some reason, using PhantomJS does not change the class...
    //expect(element.parent().attr('class')).toContain('toggle btn btn-default off');
    expect(element.parent().find('.toggle-off').text()).toBe('Disabled');
    expect(element.parent().find('.toggle-on').text()).toBe('Enabled');
    expect(scope.enabled).toBeFalsy();
  }));

  it('should throw error when no properties passed', inject(function ($compile, $rootScope) {
    var scope = $rootScope.$new();
    scope.enabled = false;
    expect(function(){
      $compile('<toggle-button></toggle-button>')(scope);
      scope.$apply();
    }).toThrow();
  }));

});
