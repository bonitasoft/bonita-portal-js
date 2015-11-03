'use strict';

describe('iframe directive', function(){
  var element;
  var scope;

  beforeEach(module('org.bonitasoft.features.user.tasks.ui.iframe'));
  beforeEach(module('org.bonitasoft.portalTemplates'));

  var $httpBackend;
  var $timeout;
  var $document;

  beforeEach(inject(function($rootScope, $compile, $injector) {
    scope = $rootScope.$new();
    $timeout = $injector.get('$timeout');
    $httpBackend = $injector.get('$httpBackend');
    $document = $injector.get('$document');

    $httpBackend.whenGET(/templates\/.*\.html/gi).respond('');

    var markup =
        '<bonita-iframe-viewer frame-url="frameUrl" is-editable="isEditable" is-visible="tab.form">' +
        '</bonita-iframe-viewer>';

    scope.tab = {
      form: true
    };
    scope.isEditable = false;
    scope.frameUrl = '/base/dev/fixtures/form.html';

    $httpBackend.whenGET(/\/base\/dev\/fixtures\/form\.html.*/gi).respond('<!doctype html><html><head><meta charset="utf-8"><title>fixtures</title></head><body><div id="loading"></div><div id="main"><h1>Bonita Form</h1></div><script>"use strict";var loading = document.querySelector("#loading");var main = document.querySelector("#main");if (loading) {loading.style.display = "none";}if (main) {main.style.height = "500px";}</script></body></html>');

    element = $compile(markup)(scope);
    $document.find('body').append(element);
    scope.$digest();

  }));


  it('should compute params', function() {
    var isolated = element.isolateScope();
    expect(isolated.frameUrl).toBe(scope.frameUrl);
    expect(isolated.url).toBe(scope.frameUrl);
    expect(isolated.trigger).toEqual(scope.tab.form);
  });

  it('should update frameUrl and switching param when url change', function() {
    var isolated = element.isolateScope();
    expect(isolated.url).toBe(scope.frameUrl);
    scope.frameUrl = '/base/dev/fixtures/form.html?toto&tata';
    scope.$digest();
    expect(isolated.url).toBe('/base/dev/fixtures/form.html?tata&toto');
  });

  it('should remove overlay when editable is true', function() {
    var isolated = element.isolateScope();

    scope.isEditable = true;
    scope.$digest();

    expect(isolated.isEditable).toBe(true);

    var overlayDiv = [].slice.call(element.find('div')).filter(function(el){
      return el.className.match('Viewer-overlay');
    });

    expect(overlayDiv.length).toBe(0);
  });
});
