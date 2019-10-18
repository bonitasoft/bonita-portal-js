'use strict';

var gulp = require('gulp');
var bower = require('gulp-bower');
var inject = require('gulp-inject');
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var less = require('gulp-less');
var replace = require('gulp-replace');
var stripCssComments = require('gulp-strip-css-comments');
var LessPluginCSScomb = require('less-plugin-csscomb');

var html2js = require('gulp-ng-html2js');

var paths = require('./conf').paths;

/**
 * Main build task
 */
gulp.task('build', ['bower', 'copy', 'compile', 'inject']);

/**
 * Fetch bower dependencies from portal js
 */
gulp.task('bower', () => bower({cwd: paths.community}));

/**
 * Copy sources files
 */
gulp.task('copy', ['copy:src', 'copy:font', 'copy:css', 'copy:vendors', 'copy:js']);

gulp.task('copy:src', () => {
  return gulp.src(paths.src + '/**/*.*')
    .pipe(gulp.dest(paths.dist));
});

gulp.task('copy:font', ['bower'], () => {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest(paths.dest.fonts));
});

gulp.task('copy:css', ['bower'], () => {
  return gulp.src(paths.css)
    .pipe(gulp.dest(paths.dest.css));
});

gulp.task('copy:vendors', ['bower'], () => {
  return gulp.src(paths.vendors)
    .pipe(gulp.dest(paths.dest.vendors));
});

gulp.task('copy:js', () => {
  return gulp.src(paths.js, { base: `${paths.community}/main` })
    .pipe(gulp.dest(paths.dest.js));
});

/**
 * Compile what needs to be compiled
 */
gulp.task('compile', ['compile:less', 'compile:templates']);

gulp.task('replace:less', ['bower'], () => {
  return gulp.src(paths.less)
    .pipe(replace('@{skinFontPath}', '../fonts/'))
    .pipe(gulp.dest(paths.dest.less));
});

gulp.task('compile:less', ['bower', 'replace:less'], () => {
  return gulp.src(`${paths.dest.less}/main.less`)
    .pipe(stripCssComments({all: true}))
    .pipe(less({plugins: [new LessPluginCSScomb('zen')]}))
    .pipe(rename('task-list.css'))
    .pipe(gulp.dest(paths.dest.css));
});

gulp.task('compile:templates', ['bower'], () => {
  return gulp.src(paths.html)
    .pipe(html2js({
      moduleName: 'org.bonitasoft.portalTemplates',
      prefix: 'portalTemplates/user/tasks/'
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(paths.dest.js));
});

/**
 * Inject js and css files in index.html
 */
gulp.task('inject', ['copy:js', 'copy:vendors', 'compile:templates', 'compile:less', 'copy:css'], () => {
  return gulp.src(`${paths.dest.resources}/index.html`)
    .pipe(inject(gulp.src([
      `${paths.dest.vendors}/angular.min.js`,
      `${paths.dest.vendors}/*.js`,
      `${paths.dest.js }/**/*.module.js`,
      `${paths.dest.js }/**/*.js`,
      `${paths.dest.css}/*.css`
    ], {read: false}), {
      ignorePath: paths.dest.resources,
      relative: true
    }))
    .pipe(gulp.dest(paths.dest.resources));
});
