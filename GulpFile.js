'use strict';

var gulp  = require('gulp'),
    utils = require('gulp-util');

utils.env.pathApp                  = './main/';
utils.env.pathFeature              = './main/features/';
utils.env.pathFeatureAdmin         = './main/features/admin/';
utils.env.pathFeatureaCases        = './main/features/admin/cases/';
utils.env.pathCommon               = './main/common/';
utils.env.assets                   = './main/assets/';
utils.env.pathCommonBuild          = './dist/common/';
utils.env.pathJsBuild              = './dist/scripts';
utils.env.pathBuild                = './dist/';

// These tasks do not have to be add to build or default. See package.json or readme
gulp.task('lint',require('./tasks/lint'));
gulp.task('clean',require('./tasks/clean'));

gulp.task('browser',require('./tasks/browser'));
gulp.task('watch',require('./tasks/watch'));
gulp.task('i18n',require('./tasks/i18n'));
gulp.task('common',require('./tasks/common'));
gulp.task('templates',require('./tasks/templates'));
gulp.task('app',require('./tasks/app'));
gulp.task('html:build',require('./tasks/htmlBuild'));
gulp.task('server',['templates','app','html:build'], require('./tasks/server'));

// Default task for the dev
gulp.task('default',['server','watch', 'browser']);

// Task for the prod
gulp.task('build', ['i18n','templates','app','html:build']);
