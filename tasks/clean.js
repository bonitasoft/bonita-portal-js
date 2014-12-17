var gulp  = require('gulp'),
    utils = require('gulp-util'),
    clean = require('gulp-clean');

/**
 * Clean the dist directory
 * @return {void}
 */
module.exports = function() {

  'use strict';

  gulp.src(utils.env.pathBuild, {read: false})
      .pipe(clean());
};
