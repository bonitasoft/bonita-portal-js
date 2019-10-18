'use strict';

var gulp = require('gulp');
var protractor = require('gulp-protractor');
var connect = require('connect');
var http = require('http');
var serveStatic = require('serve-static');
var config = require('./conf');

var mockMiddleware = require('../../../test/dev/server-mock.js');

function serveE2e() {
  var app = connect();
  app.use(serveStatic('dist/resources', {
    index: 'index.html'
  }));
  app.use(mockMiddleware);

  var server = http.createServer(app);
  server.listen(config.protractor.port);

  console.log('Server started http://localhost:' + config.protractor.port);
  return server;
}

function runProtractor (done) {
  var server = serveE2e();
  gulp.src([config.paths.community + '/test/e2e/features/user/tasks/*.js'])
    .pipe(protractor.protractor({
      configFile: config.paths.community + '/test/protractor.conf.js',
      args: [
        '--baseUrl', 'http://127.0.0.1:' + config.protractor.port,
        '--params.urls.userTaskList=/#'
      ]
    }))
    .on('error', (err) => {throw err;})
    .on('end', () => {
      server.close();
      done();
    });
}

gulp.task('e2e', ['build'], runProtractor);
