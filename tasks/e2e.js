var gulp       = require('gulp'),
    protractor = require('gulp-protractor').protractor;

/**
 * Run protractor tests
 * @param  {Array} testList Glob of file to load
 * @return {void}
 */
module.exports = function(testList) {

  'use strict';

  // Gulp-protractor is stupid and do not read files from the the config :/
  gulp.src(testList || ['./test/e2e/**/*.e2e.js'],{read: false})
    .pipe(protractor({
      configFile: './protractor.conf.js'
    }))
    .on('error', function(e) { throw e; })
    .on('close', function() {
      // Close gulp at the end as we also have a server
      process.exit(0);
    });
};
