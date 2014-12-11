var gulp     = require('gulp'),
    path     = require('path'),
    utils    = require('gulp-util'),
    gif      = require('gulp-if'),
    uglify   = require('gulp-uglify'),
    concat   = require('gulp-concat'),
    reload   = require('browser-sync').reload,
    bowerDep = require('main-bower-files');


module.exports = function() {
  'use strict';

  function isJs(file) {
    return '.js' === path.extname(file.path);
  }

  /**
   * Build 3 type of vendor
   * - angular lib
   * - jQuery lib
   * - Other
   *
   * It prevents files to have a fileSize > Mo, which is bad for webperf.
   * @type {Object}
   */
  var vendor = {
    jQuery: [
      function isJQuery(file) {
        return /jquery|jQuery/.test(file.path) && isJs(file);
      },
      concat('jQuery.vendor.js')
    ],

    angular: [
      function isAngular(file) {
        return /angular/.test(file.path) && isJs(file);
      },
      concat('angular.vendor.js')
    ],

    other: [
      function isNotAngularOrJQuery(file) {
        return /^((?!(angular|jquery|jQuery)).)*$/.test(file.path) && isJs(file);
      },
      concat('vendor.js')
    ],
  };

  gulp.src(bowerDep())
    .pipe(gif.apply(this,vendor.jQuery))
    .pipe(gif.apply(this,vendor.angular))
    .pipe(gif.apply(this,vendor.other))
    .pipe(!utils.env.prod ? reload({stream:true}) : utils.noop())
    .pipe(!utils.env.prod ? utils.noop() : uglify())
    .pipe(gulp.dest(utils.env.pathJsBuild));

};
