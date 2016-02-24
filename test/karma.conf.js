// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  'use strict';


  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '..',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    preprocessors: {
      'main/*.js': ['coverage'],
      'main/!(assets)/**/*.js': ['coverage'],
      'main/features/**/*.html': ['ng-html2js']
      },

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'main/assets/es5-shim/es5-shim.js',
      'main/assets/jquery/dist/jquery.js',
      'main/assets/angular/angular.js',
      'main/assets/angular-animate/angular-animate.js',
      'main/assets/angular-bootstrap/ui-bootstrap-tpls.js',
      'main/assets/angular-cookies/angular-cookies.js',
      'main/assets/angular-file-upload/dist/angular-file-upload.min.js',
      'main/assets/angular-gettext/dist/angular-gettext.js',
      'main/assets/angular-growl-2/build/angular-growl.js',
      'main/assets/angular-multi-select/isteven-multi-select.js',
      'main/assets/angular-resource/angular-resource.js',
      'main/assets/angular-sanitize/angular-sanitize.js',
      'main/assets/angular-touch/angular-touch.js',
      'main/assets/angular-ui-router/release/angular-ui-router.js',
      'main/assets/angular-ui-tree/dist/angular-ui-tree.js',
      'main/assets/angular-xeditable/dist/js/xeditable.js',
      'main/assets/bootstrap/dist/js/bootstrap.js',
      'main/assets/ng-sortable/dist/ng-sortable.js',
      'main/assets/ngstorage/ngStorage.js',
      'main/assets/bonita-js-components/dist/bonita-lib-tpl.js',
      'main/assets/bootstrap-tags/dist/js/bootstrap-tags.js',
      'main/assets/bootstrap-toggle/js/bootstrap-toggle.min.js',
      'main/assets/jquery-resizable-columns/dist/jquery.resizableColumns.min.js',
      'main/assets/jqueryui/ui/jquery-ui.js',
      'main/assets/json3/lib/json3.min.js',
      'main/assets/keymaster/keymaster.js',
      'main/assets/lodash/lodash.js',
      'main/assets/moment/min/moment-with-locales.js',
      'main/assets/ngtoast/dist/ngToast.js',
      'main/assets/numeral/numeral.js',
      'main/assets/numeral/languages.js',
      'main/assets/angular-mocks/angular-mocks.js',
      // endbower
      'main/templates.js',
      'main/common/**/*.js',
      'main/features/**/*.js',
      'main/features/**/*.html',
      'main/bonita-portal.js',
      'test/spec/helpers/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: process.env.KARMA_PORT || 8988,

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
    singleRun: true,

    reporters: ['dots', 'junit', 'coverage'],

    junitReporter: {
      outputFile: 'target/reports/unit/TESTS-xunit.xml'
    },

    coverageReporter: {
      type: 'lcov',
      dir: 'target/reports/coverage',
      subdir: '.'
    }

    //ngHtml2JsPreprocessor: {
      // prepend this to the
      //stripPrefix: 'main/',
      // setting this option will create only a single module that contains templates
      // from all the files, so you can load them all with module('foo')
      //moduleName: 'org.bonitasoft.templates'
    //}

  });
};
