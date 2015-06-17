describe('Factory i18nMsg', function() {

  'use strict';

  var factory;

  beforeEach(module('org.bonitasoft.common.i18n.factories'));

  beforeEach(inject(function ($injector) {
    factory = $injector.get('i18nMsg');
  }));

  it('should have some translations for error fields', function() {
    expect(factory.field).toBeDefined();
  });

});
