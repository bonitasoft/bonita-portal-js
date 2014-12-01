var gulp        = require('gulp'),
    utils       = require('gulp-util'),
    concat      = require('gulp-concat'),
    plumber     = require('gulp-plumber'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify'),
    jshint      = require('gulp-jshint'),
    ngAnnotate  = require('gulp-ng-annotate'),
    streamqueue = require('streamqueue'),
    stylish     = require('jshint-stylish'),
    reload      = require('browser-sync').reload;

module.exports = function() {

  'use strict';

  var stream = streamqueue({objectMode: true});

  stream.queue(gulp.src(utils.env.pathCommon + '**/*.js'));
  stream.queue(
    // When we build for the prod, we have a lint task which breaks the pipe if there is an error.
    gulp.src(utils.env.pathFeatureAdmin + '**/*.js')
      .pipe(!utils.env.prod ? jshint() : utils.noop())
      .pipe(!utils.env.prod ? jshint.reporter(stylish) : utils.noop())
  );
  stream.queue(gulp.src(utils.env.pathApp + 'bonita-portal-sp.js'));

  stream.done()
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(ngAnnotate({
      add: true,
      remove: true,
      single_quotes: true
    }))
    .pipe(sourcemaps.write())
    .pipe(utils.env.prod ? uglify() : utils.noop())
    .pipe(gulp.dest(utils.env.pathJsBuild))
    .pipe(!utils.env.prod ? reload({stream:true}) : utils.noop());
};
