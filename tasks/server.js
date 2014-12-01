var url         = require('url'),
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
  middlewares.push(proxify('/bonita/API', 'http://127.0.0.1:8080/bonita/API/'));
  middlewares.push(proxify('/bonita/portal/', 'http://127.0.0.1:8080/bonita/portal/'));

  if(!utils.env.e2e) {
    middlewares.push(proxify('/bonita/services/', 'http://127.0.0.1:8080/bonita/services/'));
  }

  browserSync({
    port: 9100,
    open: false,
    minify: false,
    server: {
      baseDir: utils.env.pathBuild,
      middleware: middlewares.map(proxy)
    }
  });
};
