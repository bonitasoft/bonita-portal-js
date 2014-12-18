describe('goThroughPortal', function () {
  'use strict';

  var manageTopUrl, compile;

  beforeEach(module('org.bonita.common.directives.bonitaHref'));

  beforeEach(function () {
    manageTopUrl = jasmine.createSpyObj('manageTopUrl', ['goTo']);
    module(function ($provide) {
      $provide.value('manageTopUrl', manageTopUrl);
    });

    inject(function ($rootScope, $compile) {
      compile = function (html) {
        var scope = $rootScope.$new();
        var element = $compile(html)(scope);
        scope.$apply();
        return element;
      };
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


});
