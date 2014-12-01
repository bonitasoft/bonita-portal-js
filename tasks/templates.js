var gulp    = require('gulp'),
    concat  = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    utils   = require('gulp-util'),
    uglify  = require('gulp-uglify'),
    html2js = require('gulp-ng-html2js'),
    reload  = require('browser-sync').reload;

module.exports = function() {

  'use strict';

  gulp.src([utils.env.pathFeatureAdmin + '**/*.html'])
    .pipe(plumber())
    .pipe(html2js({
      moduleName: 'tpl',
      prefix: 'features/admin/'
    }))
    .pipe(concat('templates.js'))
    .pipe(uglify())
    .pipe(gulp.dest(utils.env.pathJsBuild))
    .pipe(!utils.env.prod ? reload({stream:true}) : utils.noop());

  gulp.src([utils.env.assets + 'bonita-portal-js/**/*.html'])
    .pipe(plumber())
    .pipe(html2js({
      moduleName: 'org.bonita.features.admin',
      stripPrefix: 'main/',
      declareModule: false
    }))
    .pipe(concat('templatesPortaljs.js'))
    .pipe(uglify())
    .pipe(gulp.dest(utils.env.pathJsBuild))
    .pipe(!utils.env.prod ? reload({stream:true}) : utils.noop());
};
