var gulp   = require('gulp'),
    utils  = require('gulp-util'),
    reload = require('browser-sync').reload;

module.exports = function() {
  'use strict';

  gulp.src(utils.env.pathCommon + '**/*.{html,css}')
    .pipe(gulp.dest(utils.env.pathCommonBuild))
    .pipe(!utils.env.prod ? reload({stream:true}) : utils.noop());
};
