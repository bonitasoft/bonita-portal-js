var gulp  = require('gulp'),
    utils = require('gulp-util'),
    clean = require('gulp-clean');

module.exports = function() {

  'use strict';

  gulp.src(utils.env.pathBuild, {read: false})
      .pipe(clean());
};
