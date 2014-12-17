var url         = require('url'),
    path       = require('path'),
    utils       = require('gulp-util'),
    proxy       = require('proxy-middleware'),
    browserSync = require('browser-sync');

module.exports = function() {

  'use strict';

  var middlewares = [];
  function proxify(from, to) {
    var opt = url.parse(to);
    opt.route = from;
    return opt;
  }

  middlewares.push(proxify('/bonita/portaljs/', 'http://127.0.0.1:9100/'));

  if(!utils.env.e2e) {
    middlewares.push(proxify('/bonita/API', 'http://127.0.0.1:8080/bonita/API/'));
    middlewares.push(proxify('/bonita/portal/', 'http://127.0.0.1:8080/bonita/portal/'));
    middlewares.push(proxify('/bonita/services/', 'http://127.0.0.1:8080/bonita/services/'));
  }
  middlewares = middlewares.map(proxy);

  if(utils.env.e2e) {
    middlewares.push(require(path.resolve(__dirname ,'../test/dev/server-mock.js')));
  }

  browserSync({
    port: 9100,
    startPath: '/bonita/portaljs/#/admin/cases/list',
    minify: false,
    notify: false,
    server: {
      baseDir: utils.env.pathBuild,
      middleware: middlewares
    }
  });
};
