// A reference configuration file.
'use strict';
exports.config = {
    //seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.42.0.jar',
    //seleniumPort: null,
    chromeDriver: './node_modules/protractor/selenium/chromedriver',
    //seleniumArgs: [],
    directConnect: false,

    specs: [
        'test/e2e/**/*.e2e.js'
    ],
    suites: {
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
