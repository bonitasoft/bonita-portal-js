describe('goThroughPortal', function () {
  'use strict';

  var topLocation, compile;

  beforeEach(module('org.bonita.common.directives.goThroughPortal'));

  beforeEach(function () {
    topLocation = {};
    module(function ($provide) {
      $provide.value('topLocation', topLocation);
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

  it('should through an error when _p is not defined', function () {
    expect(function () {
      compile('<a go-through-portal="{}"></a>');
    }).toThrow();
  });

  it('should append page token to the url hash', function () {

    var element = compile('<a go-through-portal="{ _p: \'token\' }"></a>');

    expect(element.attr('href')).toBe('../portal/homepage#_p=token');
  });

  it('should append tenant id to the url query string', function () {
    topLocation.tenant = 1;

    var element = compile('<a go-through-portal="{ _p: \'token\' }"></a>');

    expect(element.attr('href')).toBe('../portal/homepage?tenant=1#_p=token');
  });

  it('should append profile id to the url hash', function () {
    topLocation._pf = 2;

    var element = compile('<a go-through-portal="{ _p: \'token\' }"></a>');

    expect(element.attr('href')).toBe('../portal/homepage#_pf=2&_p=token');
  });

  it('should append id to the url hash', function () {

    var element = compile('<a go-through-portal="{ _p: \'token\', id: 3 }"></a>');

    expect(element.attr('href')).toBe('../portal/homepage#_p=token&token_id=3');
  });

  it('should append tab to the url hash', function () {

    var element = compile('<a go-through-portal="{ _p: \'token\', tab: \'archives\' }"></a>');

    expect(element.attr('href')).toBe('../portal/homepage#_p=token&token_tab=archives');
  });
});
