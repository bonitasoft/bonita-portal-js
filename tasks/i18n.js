var gulp    = require('gulp'),
    utils   = require('gulp-util'),
    gettext = require('gulp-angular-gettext');

module.exports = function() {

  'use strict';

  gulp.src([utils.env.pathFeatureAdmin + '**/*.{js,html}', utils.env.pathCommon + '**/*.{js,html}'])
    .pipe(gettext.extract('portaljs.pot'))
    .pipe(gulp.dest('../bonita-home/src/main/resources/client/platform/work/i18n/'));
};
