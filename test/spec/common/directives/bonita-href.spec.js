describe('goThroughPortal', function () {
  'use strict';

  var manageTopUrl, compile;

  beforeEach(module('org.bonitasoft.common.directives.bonitaHref'));

  beforeEach(function () {
    inject(function ($rootScope, $compile, _manageTopUrl_) {
      compile = function (html) {
        var scope = $rootScope.$new();
        var element = $compile(html)(scope);
        scope.$apply();
        return element;
      };
      manageTopUrl = _manageTopUrl_;
      spyOn(manageTopUrl, 'goTo');
    });
  });

  it('should call manageTopUrl when click is called', function () {
    var destination = {};
    var element = compile('<a bonita-href="'+JSON.stringify(destination)+'"></a>');
    element.trigger('click');
    expect(manageTopUrl.goTo.calls.allArgs()).toEqual([[destination]]);
  });

  it('should call manageTopUrl with destination params when click is called', function () {
    var destination = {token : 'caselistingadmin', '_tab' : 'archived'};
    var element = compile('<a bonita-href="'+JSON.stringify(destination).replace(/"/g,'\'')+'"></a>');
    element.trigger('click');
    expect(manageTopUrl.goTo.calls.allArgs()).toEqual([[destination]]);
  });


  it('should call manageTopUrl with simple destination params when click is called', function () {
    var destination = 'caselistingadmin';
    var element = compile('<a bonita-href="'+destination+'"></a>');
    element.trigger('click');
    expect(manageTopUrl.goTo.calls.allArgs()).toEqual([[destination]]);
  });
});
