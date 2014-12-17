var url         = require('url'),
    path       = require('path'),
    utils       = require('gulp-util'),
    proxy       = require('proxy-middleware'),
    browserSync = require('browser-sync');

/**
 * Load a server with livereload for dev.
 * It provides:
 * - Livereload accros any browser/device
 * - Sync for scroll/click etc.
 * - proxy
 * - mock API for e2e tests
 * @return {void}
 */
module.exports = function() {

  'use strict';

  var middlewares = [];

  /**
   * Create a proxy
   * - URL to match, URL to load
   * @param  {String} from Url to match
   * @param  {String} to   URL to load
   * @return {Object}      Return url object
   */
  function proxify(from, to) {
    var opt = url.parse(to);
    opt.route = from;
    return opt;
  }

  middlewares.push(proxify('/bonita/portaljs/', 'http://127.0.0.1:9100/'));

  // Default proxy for dev mode to load data from the portal
  if(!utils.env.e2e) {
    middlewares.push(proxify('/bonita/API', 'http://127.0.0.1:8080/bonita/API/'));
    middlewares.push(proxify('/bonita/portal/', 'http://127.0.0.1:8080/bonita/portal/'));
    middlewares.push(proxify('/bonita/services/', 'http://127.0.0.1:8080/bonita/services/'));
  }

  // Create a proxy from each item
  middlewares = middlewares.map(proxy);

  // Load mocks for the API for e2e tests only
  if(utils.env.e2e) {
    middlewares.push(require(path.resolve(__dirname ,'../test/dev/server-mock.js')));
  }

  browserSync({
    port: 9100,
    startPath: '/bonita/portaljs/#/admin/cases/list', // Default url to open
    host: '127.0.0.1',
    open: 'external',
    minify: false,
    notify: false,
    server: {
      baseDir: utils.env.pathBuild,
      middleware: middlewares
    }
  });
};
