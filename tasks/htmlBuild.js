var gulp         = require('gulp'),
    utils        = require('gulp-util'),
    concat       = require('gulp-concat'),
    plumber      = require('gulp-plumber'),
    usemin       = require('gulp-usemin'),
    cssmin       = require('gulp-minify-css'),
    htmlmin      = require('gulp-htmlmin'),
    rev          = require('gulp-rev'),
    eol          = require('gulp-eol'),
    replace      = require('gulp-replace'),
    autoprefixer = require('gulp-autoprefixer');

/**
 * Build the main html and css attach to it
 * Prevent cache in browser thanks to a random string at the end of
 * - template-*.js
 * - app-*.js
 * We replace {{randomAppCache}} in html with this UUID.
 * @return {void}
 */
module.exports = function() {

  'use strict';

  var htmlminOpt = {
    collapseWhitespace: true,
    removeComments: true,
    useShortDoctype: true
  };

  // The reload for this task is in the taski watch. Because usemin do not respect the pipe. So we reload before the end, if i try here
  return gulp.src(utils.env.pathApp + 'index.html')
    .pipe(plumber())
    .pipe(usemin({
      css: ['concat',autoprefixer({browsers: ['> 1%', 'IE 9']}),utils.env.prod ? cssmin() : utils.noop(),rev()],
      html: [htmlmin(htmlminOpt),replace('{{randomAppCache}}','?' + Math.random().toString(36).substring(7))]
    }))
    .pipe(eol('\n'))
    .pipe(gulp.dest(utils.env.pathBuild));
};
