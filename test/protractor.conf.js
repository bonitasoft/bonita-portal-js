// A reference configuration file.
'use strict';

const capabilities = {
  browserName: 'chrome',
  chromeOptions: {
    args: ['--window-size=1920,1080']
  }
};

// activate chrome in headless mode
// see https://developers.google.com/web/updates/2017/04/headless-chrome
if (process.env.HEADLESS) {
  capabilities.chromeOptions.args = capabilities.chromeOptions.args.concat([
    '--headless',
    // Temporarily needed if running on Windows.
    '--disable-gpu',
    // We must disable the Chrome sandbox when running Chrome inside Docker
    '--no-sandbox'
  ]);
}

var webdriverManagerPath = '../node_modules/webdriver-manager/selenium/chromedriver_98.0.4758.102';

//Specify binary path to enable windows build
if(process.platform.indexOf('win') === 0) {
  webdriverManagerPath += '.exe';
}

exports.config = {

    directConnect: true,
    chromeDriver: webdriverManagerPath,

    specs: [
      'e2e/**/*.e2e.js'
    ],

    capabilities,

    baseUrl: 'http://localhost:' + (process.env.PROTRACTOR_PORT || 9002),

    rootElement: 'body',

   mocks: {
      dir: 'e2e/mocks',
      default: [] //To load default mock, you need to add mock() in your test
    },

    jasmineNodeOpts: {
      includeStackTrace: true,
      defaultTimeoutInterval: 120000
    },

    allScriptsTimeout: 120000,
    getPageTimeout: 120000,

    onPrepare: function() {
      require('protractor-http-mock').config = {
        rootDirectory: __dirname, // default value: process.cwd()
        protractorConfig: 'protractor.conf.js' // default value: 'protractor-conf.js'
      };

      require('babel-core/register')({presets: ['babel-preset-bonita']});

        var jasmineReporters = require('jasmine-reporters');
        jasmine.getEnv().addReporter(
            new jasmineReporters.JUnitXmlReporter({
                savePath: 'target/reports/e2e',
                filePrefix: 'e2e',
                consolidateAll: true
            }));

        var disableNgAnimate = function() {
            angular.module('disableNgAnimate', []).run(['$animate', function($animate) {
                $animate.enabled(false);
            }]);
        };
        browser.addMockModule('disableNgAnimate', disableNgAnimate);

        var disableCssAnimate = function() {
            angular
                .module('disableCssAnimate', [])
                .run(function() {
                    var style = document.createElement('style');
                    style.type = 'text/css';
                    style.innerHTML = '* {' +
                        '-webkit-transition: none !important;' +
                        '-moz-transition: none !important' +
                        '-o-transition: none !important' +
                        '-ms-transition: none !important' +
                        'transition: none !important' +
                        '}';
                    document.getElementsByTagName('head')[0].appendChild(style);
                });
        };
        browser.addMockModule('disableCssAnimate', disableCssAnimate);
    }
};
