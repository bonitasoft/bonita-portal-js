// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  'use strict';


  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    preprocessors: {
      'main/*.js': ['coverage'],
      'main/features/**/*.js': ['coverage'],
      'main/common/**/*.js': ['coverage'],
      'main/features/**/*.html': ['ng-html2js']
      },

    // list of files / patterns to load in the browser
    files: [
      'main/assets/lodash/lodash.js',
      'test/spec/helpers/fakeModal.js',
      'main/assets/jquery/dist/jquery.js',
      'main/assets/angular/angular.js',
      'main/assets/angular-cookies/angular-cookies.js',
      'main/assets/angular-resource/angular-resource.js',
      'main/assets/angular-mocks/angular-mocks.js',
      'main/assets/angular-ui-router/release/angular-ui-router.js',
      'main/assets/angular-bootstrap/ui-bootstrap-tpls.js',
      'main/assets/bootstrap/dist/js/bootstrap.js',
      'main/assets/bootstrap-tags/dist/js/bootstrap-tags.js',
      'main/assets/bootstrap-toggle/js/bootstrap-toggle.min.js',
      'main/assets/jqueryui/ui/jquery-ui.js',
      'main/assets/angular-gettext/dist/angular-gettext.js',
      'main/assets/angular-file-upload/angular-file-upload.min.js',
      'main/assets/angular-ui-tree/dist/angular-ui-tree.js',
      'main/assets/moment/min/moment-with-locales.js',
      'main/assets/angular-multi-select/isteven-multi-select.js',
      'main/assets/bonita-js-components/dist/bonita-lib-tpl.js',
      'main/assets/jquery-resizable-columns/dist/jquery.resizableColumns.js',
      'main/assets/angular-animate/angular-animate.js',
      'main/assets/angular-growl-2/build/angular-growl.js',
      'main/assets/ng-sortable/dist/ng-sortable.js',
      'main/assets/angular-xeditable/dist/js/xeditable.js',
      'main/assets/lodash/lodash.js',
      'main/common/**/*.js',
      'main/features/**/*.js',
      'main/features/**/*.html',
      'main/bonita-portal.js',
      'test/spec/fixtures/i18nMock.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8988,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    reporters: ['dots', 'junit', 'coverage'],

    junitReporter: {
      outputFile: 'test/reports.xml'
    }

  });
};
