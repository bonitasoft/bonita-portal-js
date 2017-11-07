// A reference configuration file.
'use strict';
exports.config = {

    /**
     * ChromeDriver location is used to help find the chromedriver binary. This will be passed to the
     * Selenium jar as the system property webdriver.chrome.driver. If the value is not set when
     * launching locally, it will use the default values downloaded from webdriver-manager.
     *
     * example:
     * chromeDriver: './node_modules/webdriver-manager/selenium/chromedriver_X'
     */
    chromeDriver: '',

    /**
    * The location of the standalone Selenium Server jar file, relative
    * to the location of webdriver-manager. If no other method of starting
    * Selenium Server is found, this will default to
    * node_modules/protractor/node_modules/webdriver-manager/selenium/<jar file>
    */
    seleniumServerJar: '',
    directConnect: false,

    specs: [
        'e2e/**/*.e2e.js'
    ],

    capabilities: {
        'browserName': 'chrome'
    },

    baseUrl: 'http://localhost:' + (process.env.PROTRACTOR_PORT || 9002),

    rootElement: 'body',

    onPrepare: function() {
      require('babel-core/register')({presets: ['babel-preset-bonita']});

      browser.bonitaSpEdition = function() {
            return false;
        };

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
