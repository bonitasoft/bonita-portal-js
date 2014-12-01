var gulp   = require('gulp'),
    utils  = require('gulp-util'),
    reload = require('browser-sync').reload;

module.exports = function() {

  'use strict';

  gulp.watch([
    utils.env.pathFeatureAdmin + '**/*.html',
    utils.env.assets + 'bonita-portal-js/**/*.html'
  ],['templates']);
  gulp.watch([utils.env.pathFeatureAdmin + '**/*.js'],['app']);
  gulp.watch([utils.env.assets + 'bonita-portal-js/' + '**/*.js'],['html:build',reload]);
  gulp.watch([utils.env.pathCommon + '**/*.{html,css}'],['common']);
  gulp.watch(['./main/index.html'],['html:build',reload]);
};
