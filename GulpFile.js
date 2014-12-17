'use strict';

var gulp  = require('gulp'),
    utils = require('gulp-util');

utils.env.project = 'community';

utils.env.pathApp         = './main/';
utils.env.pathFeature     = './main/features/';
utils.env.pathCommon      = './main/common/';
utils.env.assets          = './main/assets/';
utils.env.pathCommonBuild = './dist/common/';
utils.env.pathJsBuild     = './dist/scripts';
utils.env.pathBuild       = './dist/';

// These tasks do not have to be add to build or default. See package.json or readme
gulp.task('lint',require('./tasks/lint'));
gulp.task('clean',require('./tasks/clean'));

gulp.task('watch',require('./tasks/watch'));
gulp.task('common',require('./tasks/common'));
gulp.task('vendor',require('./tasks/vendor'));
gulp.task('templates',function() {
  require('./tasks/templates')({
    moduleName: 'org.bonita.portal',
    prefix: 'features/'
  });
});
gulp.task('app',require('./tasks/app'));
gulp.task('html:build',require('./tasks/htmlBuild'));

gulp.task('dev',['templates','common','vendor','app','html:build']);
gulp.task('server',['dev'], require('./tasks/server'));

// Default task for the dev
gulp.task('default',['server','watch']);

// Task for the prod
gulp.task('build', ['dev']);

gulp.task('e2e', function() {
  // In order to launch the serveur with e2e configuration (mocks...)
  utils.env.e2e = true;
  gulp.start('server');
  require('./tasks/e2e')();
});
