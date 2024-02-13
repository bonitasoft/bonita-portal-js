'use strict';

var gulp = require('gulp');
var connect = require('connect');
var http = require('http');
var serveStatic = require('serve-static');
var config = require('./conf');

var mockMiddleware = require('../../../test/dev/server-mock.js');

let server;

gulp.task('runServer', gulp.series('build', () => {
  var app = connect();
  app.use(serveStatic('dist/resources', {
    index: 'index.html'
  }));
  app.use(mockMiddleware);

  var server = http.createServer(app);
  server.listen(config.protractor.port);

  console.log('Server started http://localhost:' + config.protractor.port);
}));

gulp.task('closeServer', () => {
  server.close();
});
