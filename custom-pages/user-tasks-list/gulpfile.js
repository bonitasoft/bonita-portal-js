/* jshint node:true */

'use strict';

var gulp = require('gulp');
var rimraf = require('rimraf');
var wrench = require('wrench');
var config = require('./gulp/conf');

/**
 *  This will load all js files in the gulp directory
 *  in order to load all gulp tasks
 */
wrench.readdirSyncRecursive('./gulp').filter((file) => {
  return (/\.(js)$/i).test(file);
}).map((file) => {
  require('./gulp/' + file);
});

gulp.task('clean', function(cb) {
  rimraf(config.paths.dist, cb);
});

gulp.task('default', gulp.series('clean', 'build'));
