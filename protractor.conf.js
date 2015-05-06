// A reference configuration file.
'use strict';
exports.config = {
  //seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.42.0.jar',
  //seleniumPort: null,
  chromeDriver: './node_modules/protractor/selenium/chromedriver',
  //seleniumArgs: [],
  directConnect: true,

  specs: [
      'test/e2e/**/*.e2e.js'
  ],
  suites : {
    'arch-case-list-deletion': ['test/e2e/features/admin/cases/arch-case-list-buttons.e2e.js'],
    'arch-case-list': ['test/e2e/features/admin/cases/arch-case-*.e2e.js'],
    'arch-case-list-filter': ['test/e2e/features/admin/cases/arch-case-list-filter.e2e.js'],
    'process-details-information': ['test/e2e/features/admin/processes/details/*.e2e.js']
  },

  capabilities: {
      'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:9002/',

  rootElement: 'body',

  onPrepare: function() {
  // The require statement must be down here, since jasmine-reporters
  // needs jasmine to be in the global and protractor does not guarantee
  // this until inside the onPrepare function.
    require('jasmine-reporters');
    jasmine.getEnv().addReporter(
      new jasmine.JUnitXmlReporter('test/e2e-reports/'));
  }
};
