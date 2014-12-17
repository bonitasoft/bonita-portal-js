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

/**
 * Build your application
 * - 1. load common, features, main modules
 * - 2. Concat, add sourcemaps, ngAnnotate and minify for production
 * @return {void}
 */
module.exports = function() {

  'use strict';

  // create a queue for streams in order to have sequencial streams and respect the order
  var stream = streamqueue({objectMode: true});

  // Add common files to the pipe
  stream.queue(gulp.src(utils.env.pathCommon + '**/*.js'));
  stream.queue(
    // When we build for the prod, we have a lint task which breaks the pipe if there is an error.
    gulp.src(utils.env.pathFeature + '**/*.js')
      .pipe(!utils.env.prod ? jshint() : utils.noop())
      .pipe(!utils.env.prod ? jshint.reporter(stylish) : utils.noop())
  );

  // Base app module
  stream.queue(gulp.src(utils.env.pathApp + '*.js'));

  // Ok all previous pipe are done, we can proceed
  stream.done()
    .pipe(plumber())
    .pipe(utils.env.prod ? sourcemaps.init() : utils.noop()) // Enable sourcemaps in your browser to map src files
    .pipe(concat('app-' + utils.env.project + '.js'))
    .pipe(ngAnnotate({
      add: true,
      remove: true,
      single_quotes: true
    }))
    .pipe(utils.env.prod ? sourcemaps.write() : utils.noop())
    .pipe(utils.env.prod ? uglify() : utils.noop())
    .pipe(gulp.dest(utils.env.pathJsBuild))
    .pipe(!utils.env.prod && !utils.env.notRefreshCommunity ? reload({stream:true}) : utils.noop());
};
