var gulp    = require('gulp'),
    concat  = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    utils   = require('gulp-util'),
    uglify  = require('gulp-uglify'),
    html2js = require('gulp-ng-html2js'),
    reload  = require('browser-sync').reload;

module.exports = function(opt) {

  'use strict';
  gulp.src([utils.env.pathFeature + '**/*.html'])
    .pipe(plumber())
    .pipe(html2js(opt))
    .pipe(concat('templates-' + utils.env.project + '.js'))
    .pipe(uglify())
    .pipe(gulp.dest(utils.env.pathJsBuild))
    .pipe(!utils.env.prod && !utils.env.notRefreshCommunity ? reload({stream:true}) : utils.noop());
};
