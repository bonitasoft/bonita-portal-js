// A reference configuration file.
'use strict';
exports.config = {

    chromeDriver: '../node_modules/webdriver-manager/selenium/chromedriver_2.38',

    seleniumServerJar: '../node_modules/webdriver-manager/selenium/selenium-server-standalone-3.11.0.jar',

    specs: [
      'e2e/**/*.e2e.js'
    ],

    capabilities: {
        'browserName': 'chrome'
    },

    baseUrl: 'http://localhost:' + (process.env.PROTRACTOR_PORT || 9002),

    rootElement: 'body',

   mocks: {
      dir: 'e2e/mocks',
      default: [] //To load default mock, you need to add mock() in your test
    },

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

        // maximize window - xvnc approved
        setTimeout(function() {
            browser.driver.executeScript(function() {
                return {
                    width: window.screen.availWidth,
                    height: window.screen.availHeight
                };
            }).then(function(result) {
                browser.driver.manage().window().setSize(result.width, result.height);
            });
        });

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
