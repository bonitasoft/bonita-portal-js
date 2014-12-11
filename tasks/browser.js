var gulp        = require('gulp'),
    utils       = require('gulp-util'),
    openBrowser = require('gulp-open');

module.exports = function() {

  'use strict';

  gulp.src(utils.env.pathBuild  + 'index.html')
    .pipe(openBrowser('google-chrome', {
      url: 'http://127.0.0.1:9100/bonita/portal.js/'
    }));

};
