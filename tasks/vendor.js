var gulp     = require('gulp'),
    path     = require('path'),
    utils    = require('gulp-util'),
    gif      = require('gulp-if'),
    uglify   = require('gulp-uglify'),
    concat   = require('gulp-concat'),
    reload = require('browser-sync').reload,
    bowerDep = require('main-bower-files');


module.exports = function() {
  'use strict';

  function isNotPolyfill(file) {
    return file.path.indexOf('es5-shim') === -1 && file.path.indexOf('json3') === -1;
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
        return isNotPolyfill(file) && /jquery|jQuery/.test(file.path);
      },
      concat('jQuery.vendor.js')
    ],

    angular: [
      function isAngular(file) {
        return isNotPolyfill(file) && /angular/.test(file.path);
      },
      concat('angular.vendor.js')
    ],

    other: [
      function isNotAngularOrJQuery(file) {
        return isNotPolyfill(file) && /^((?!(angular|jquery|jQuery)).)*$/.test(file.path);
      },
      concat('vendor.js')
    ],
  };

  gulp.src(bowerDep({
    filter: function isJs(file) {
      return '.js' === path.extname(file);
    }
  }))
    .pipe(gif.apply(this,vendor.jQuery))
    .pipe(gif.apply(this,vendor.angular))
    .pipe(gif.apply(this,vendor.other))
    .pipe(!utils.env.prod ? reload({stream:true}) : utils.noop())
    .pipe(!utils.env.prod ? utils.noop() : uglify())
    .pipe(gulp.dest(utils.env.pathJsBuild));

};
