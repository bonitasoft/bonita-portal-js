var gulp    = require('gulp'),
    utils   = require('gulp-util'),
    jshint  = require('gulp-jshint'),
    stylish = require('jshint-stylish');

module.exports = function() {

  'use strict';

  gulp.src(utils.env.pathFeature + '**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
};
