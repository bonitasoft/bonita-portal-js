var community = '../..';
var bowerComponents = `${community}/main/assets`;
var dist = 'dist';
var temp = '.tmp';
var resources = `${dist}/resources`;

module.exports = {

  paths: {
    src: 'src',
    dist: dist,
    community: community,

    vendors: [
      'angular/angular.min.js',
      'angular-animate/angular-animate.min.js',
      'angular-bootstrap/ui-bootstrap-tpls.min.js',
      'angular-cookies/angular-cookies.min.js',
      'ngstorage/ngStorage.min.js',
      'angular-resource/angular-resource.min.js',
      'angular-sanitize/angular-sanitize.min.js',
      'angular-gettext/dist/angular-gettext.min.js',
      'angular-touch/angular-touch.min.js',
      'angular-ui-router/release/angular-ui-router.min.js',
      'ng-sortable/dist/ng-sortable.min.js',
      'bonita-js-components/dist/bonita-lib-tpl.min.js',
      'ngtoast/dist/ngToast.min.js',
      'angular-growl-2/build/angular-growl.min.js',
      'keymaster/keymaster.js',
      'moment/min/moment-with-locales.js'
    ].map((path) => `${bowerComponents}/${path}`),

    js: [
      `${community}/main/*.config.js`,
      `${community}/main/common/resources/*.js`,
      `${community}/main/common/moment/*.js`,
      `${community}/main/common/i18n/*.js`,
      `${community}/main/features/user/tasks/**/*.js`,
      `!${community}/main/features/user/tasks/**/*.routes.js`
    ],

    css: [
      'bootstrap/dist/css/bootstrap.min.css',
      'bonita-js-components/dist/bonita-lib.min.css',
      'ngtoast/dist/ngToast.min.css',
      'ng-sortable/dist/ng-sortable.min.css'
    ].map((path) => `${bowerComponents}/${path}`),

    less: [
      `${community}/main/styles/tasks/*`
    ],

    fonts: [
      `${bowerComponents}/bootstrap/fonts/*`,
      `${community}/main/styles/fonts/*`,
      `!${community}/main/styles/fonts/src`
    ],

    html: [
      `${community}/main/features/user/tasks/**/*.html`
    ],

    dest: {
      resources: resources,
      less: `${temp}/less`,
      fonts: `${resources}/fonts`,
      vendors: `${resources}/js/vendor`,
      js: `${resources}/js/app`,
      css: `${resources}/css`
    }
  },

  protractor: {
    port: process.env.PROTRACTOR_PORT || 9002
  }
};
