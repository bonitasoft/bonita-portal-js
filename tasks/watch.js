var gulp   = require('gulp'),
    utils  = require('gulp-util'),
    reload = require('browser-sync').reload;

module.exports = function() {

  'use strict';
  gulp.watch([utils.env.pathFeature + '**/*.html'],['templates']);
  gulp.watch([utils.env.pathFeature + '**/*.js'],['app']);
  gulp.watch([utils.env.pathCommon + '**/*.{html,css}'],['common']);
  gulp.watch(['./main/index.html'],['html:build',reload]);
};
