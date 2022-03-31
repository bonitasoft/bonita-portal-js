// Generated on 2014-06-10 using generator-angular 0.8.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

function redirectCSS(url, file) {
  return function(req, res, next) {
    if (req.url === url) {
      res.setHeader("Content-Type", "text/css");
      require('fs')
          .createReadStream(file)
          .pipe(res);
      return;
    }
    next();
  }
}

function redirectFonts(urlPrefix, filePrefix) {
  return function (req, res, next) {
    if (req.url.startsWith(urlPrefix)) {
      var fileName = req.url.replace(urlPrefix, "");
      require('fs')
        .createReadStream(filePrefix + fileName)
        .pipe(res);
      return;
    }
    next();
  }
}

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  require('grunt-html2js')(grunt);


  var licenseTemplate = grunt.file.read('license-tpl.txt');

  function getPomVersion (fileName){
    var parsePom = require('node-xml-lite');
    var fileParsed = parsePom.parseFileSync(fileName);
    var mainCore = JSON.parse(JSON.stringify(fileParsed.childs));

    for (var i in mainCore){
      if (mainCore[i].name === 'version'){
        return mainCore[i].childs[0];
      }
    }
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    portaljs: {
      // configurable paths
      app: 'main',
      test: 'test',
      dist: 'target/dist',
      build: 'build'
    },

    pomVersion: getPomVersion("pom.xml"),

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= portaljs.app %>/*.js', '<%= portaljs.app %>/features/**/*.js', '<%= portaljs.app %>/commons/**/*.js', '<%= portaljs.app %>/assets/**/*.js', '!<%= portaljs.app %>/templates.js'],
        tasks: ['newer:jshint:all', 'ngdocs:all'],
        options: {
          livereload: true
        }
      },
      html: {
        files: ['main/features/**/*.html'],
        tasks: ['html2js']
      },
      jsTest: {
        files: ['test/spec/**/*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      e2eTest: {
        files: ['test/e2e/**/*.js'],
        tasks: ['protractor:e2e']
      },
      styles: {
        files: ['<%= portaljs.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= portaljs.app %>/templates.js',
          '.tmp/styles/{,*/}*.css'
        ]
      }
    },

    esteWatch: {
      options: {
        dirs: [
          '<%= portaljs.app %>/',//js
          '<%= portaljs.app %>/{features, commons, assets}/**/',//js
          '<%= portaljs.app %>/test/{spec,e2e}/**/',//js test & e2e
          '<%= portaljs.app %>/styles/**/',//styles
          '<%= portaljs.app %>/styles/**/'
          ],
        livereload:{
          enabled: true,
          port:'<%= connect.options.livereload %>',
          extensions:['js','css','html','json'],
          key: null, // provide a filepath or Buffer for `key` and `cert` to enable SSL.
          cert: null
        }
      },
      js: function(filepath) {
        grunt.config(['esteJs','app'], filepath);
        return ['newer:jshint:all', 'ngdocs:all'];
      },
      jsTest: function(){
        return ['newer:jshint:test', 'karma'];
      },
      e2eTest: function(){
        return ['protractor:e2e'];
      },
      styles: function(){
        return ['<%= portaljs.app %>/styles/{,*/}*.css'];
      }
    },




    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729,
        base: [
          '.tmp',
          '<%= portaljs.app %>'
        ]
      },
      server: {
        proxies: (function () {
          function forward(context) {
            return {
              context: context,
              host: 'localhost',
              port: grunt.option('proxyport') || 8080,
              https: false,
              changeOrigin: false,
              xforward: false
            };
          }

          return [
                  forward('/bonita/apps'),
                  forward('/bonita/API'),
                  forward('/bonita/portal/'),
                  forward('/bonita/services/'),
                  forward('/bonita/theme/')
              ];
        })()
      },
      rules: [
        // prefix web application
        {
          from: '^/bonita/portaljs(.*)$',
          to: '/$1'
        },
        {
          from: '^(?!/bonita/portaljs)(.*)$',
          to: '/bonita/portaljs$1',
          redirect: 'temporary'
        }
      ],
      livereload: {
        options: {
          base: [
            '.tmp',
            'target/css',
            '<%= portaljs.app %>'
          ],
          middleware: function (connect, options) {
            if (!Array.isArray(options.base)) {
              options.base = [options.base];
            }

            // Setup the proxy
              var middlewares = [
                  redirectCSS('/bonita/portal-theme/bonita-skin.css', __dirname + '/target/css/bonita-skin.css'),
                  redirectCSS('/bonita/portal-theme/css/bootstrap.min.css', __dirname + '/target/css/bootstrap.min.css'),
                  redirectFonts('/bonita/portal-theme/skin/fonts/', __dirname + '/target/css/skin/fonts/'),
                  require('grunt-connect-proxy/lib/utils').proxyRequest,
                  require('grunt-connect-rewrite/lib/utils').rewriteRequest];

            // Serve static files.
            options.base.forEach(function (base) {
              middlewares.push(connect.static(base));
            });

            // Make directory browse-able.
            var directory = options.directory || options.base[options.base.length - 1];
            middlewares.push(connect.directory(directory));

            return middlewares;
          }
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= portaljs.app %>'
          ]
        }
      },
      dist: {
        options: {
          port: process.env.PROTRACTOR_PORT || 9002,
          base: ['<%= portaljs.dist %>', 'target/css'],
          middleware: function (connect, options) {
            if (!Array.isArray(options.base)) {
              options.base = [options.base];
            }
            // Setup the proxy
            var middlewares = [
                  redirectCSS('/portal-theme/bonita-skin.css', __dirname + '/target/css/bonita-skin.css'),
                  redirectCSS('/portal-theme/css/bootstrap.min.css', __dirname + '/target/css/bootstrap.min.css'),
                  redirectFonts('/portal-theme/skin/fonts/', __dirname + '/target/css/skin/fonts/'),
                  require('./test/dev/server-mock.js'),
                  require('grunt-connect-proxy/lib/utils').proxyRequest,
                  require('grunt-connect-rewrite/lib/utils').rewriteRequest];
            // Serve static files.
            options.base.forEach(function (base) {
              middlewares.push(connect.static(base));
            });
            // Make directory browse-able.
            var directory = options.directory || options.base[options.base.length - 1];
            middlewares.push(connect.directory(directory));
            return middlewares;
          }
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        '<%= portaljs.app %>/features/**/*.js',
        '<%= portaljs.app %>/common/**/*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '.tmp',
              '<%= portaljs.dist %>/*',
              '!<%= portaljs.dist %>/.git*'
            ]
          }
        ]
      },
      server: '.tmp',
      test: {
        files: [
          {
            src: [
              'target/reports/'
            ]
          }
        ]
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '.tmp/styles/',
            src: '{,*/}*.css',
            dest: '.tmp/styles/'
          }
        ]
      }
    },

    wiredep: {
      'karma': {
        devDependencies: true,
        src: ['test/karma.conf.js'],
        fileTypes: {
          js: {
            block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*(\/\/\s*endbower)/gi,
            detect: {
              js: /('.*\.js')/gi
            },
            replace: {
              js: '\'{{filePath}}\','
            }
          }
        }
      },
      'build': {
        src: ['<%= portaljs.app %>/index.html'],
        ignorePath: '<%= portaljs.app %>/',

        options: {
          'overrides': {
            'bootstrap': {'main': []}
          }
        }
      }
    },

    injector: {
      options: {
        ignorePath: 'main/',
        addRootSlash: false
      },
      sources: {
        files: {
          '<%= portaljs.app %>/index.html': [
            '<%= portaljs.app %>/!(assets)/**/*.module.js',
            '<%= portaljs.app %>/!(assets)/**/*.js',
            '<%= portaljs.app %>/*.module.js',
            '<%= portaljs.app %>/*.js'
          ]
        }
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= portaljs.dist %>/**/*.js',
            '<%= portaljs.dist %>/styles/{,*/}*.css'
          ]
        }
      }
    },

    //ensure locals CSS files are not included for packaging other bonita global theming will fail
    taskHelper: {
      useminPrepare: {
        options: {
          handlerByFileSrc: function (src) {
            var regexp = /<link rel="stylesheet" href="(((styles)|(common)|(features))\/.*css)">/g;
            var indexContent = grunt.file.read(src, {
              encoding: 'utf-8'
            });
            var result;
            if ((result = regexp.exec(indexContent))) {
              var msg = result[1] + '\n';
              while ((result = regexp.exec(indexContent)) !== null) {
                msg += result[1] + '\n';
              }
              throw new Error('It seems that you have local CSS files should not be packaged here but to be added in bonita-web/looknfeel : \n' + msg);
            }
          }
        },
        src: '<%= useminPrepare.html %>'
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= portaljs.app %>/index.html',
      options: {
        dest: '<%= portaljs.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= portaljs.dist %>/**/*.html','!<%= portaljs.dist %>/assets/keymaster/test.html'],
      css: ['<%= portaljs.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= portaljs.dist %>']
      }
    },
    html2js: {
      options: {
        base:'main/',
        module:'org.bonitasoft.portalTemplates',
        useStrict: true,
        rename: function (moduleName) {
          return moduleName.replace('features/', 'portalTemplates/');
        },
        quoteChar: '\''
      },
      main: {
        src: ['main/features/**/*.html'],
        dest: 'main/templates.js'
      }
    },
    // The following *-min tasks produce minified files in the dist folder
    cssmin: {
      options: {
        root: '<%= portaljs.app %>'
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: false,
          caseSensitive: true,
          keepClosingSlash: true
        },
        files: [
          {
            expand: true,
            cwd: '<%= portaljs.dist %>',
            src: ['*.html', '**/*.html','!**/keymaster/test.html','!**/bootstrap/docs/**/*.html'],
            dest: '<%= portaljs.dist %>'
          }
        ]
      }
    },

    // ngmin tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngAnnotate: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '.tmp/concat/scripts',
            src: '*.js',
            dest: '.tmp/concat/scripts'
          }
        ]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= portaljs.app %>',
            dest: '<%= portaljs.dist %>',
            src: [
              '**/*.html',
              'images/**/*.png'
            ]
          }
        ]
      },
      generated: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '.tmp/concat/scripts',
            dest: '<%= portaljs.build %>',
            src: 'scripts.js',
            rename: function (dest) {
              return dest + '/bonita-portal.js';
            }
          }
        ]
      },
      styles: {
        expand: true,
        cwd: '<%= portaljs.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      },
      'concat-tmp': {
        expand: true,
        cwd: '.tmp/concat/scripts',
        dest: 'dist/scripts/',
        src: '*.js'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },

    protractor: {
      options: {
        configFile: 'test/protractor.conf.js'
      },
      e2e: {}
    },


    /* jshint camelcase: false */
    nggettext_extract: {
      pot: {
        files: {
          'target/portal-js.pot': [
              '<%= portaljs.dist %>/features/**/*.html',
              '<%= portaljs.dist %>/common/**/*.html',
              '<%= portaljs.app %>/features/**/*.js',
              '<%= portaljs.app %>/common/**/*.js'
            ]
        }
      }
    },
    ngdocs: {
      options: {
        dest: 'target/docs',
        html5Mode: true,
        startPage: '/api',
        title: 'Bonita Portal JS Documentation',
        bestMatch: true
      },
      all: ['<%= portaljs.app %>/features/**/*.js', '<%= portaljs.app %>/common/**/*.js']
    },
    lineending: {
      dist: {
        options: {
          eol: 'lf'
        },
        files: {
          'main/index.html': ['main/index.html']
        }
      }
    },
    usebanner: {
      license: {
        options: {
          position: 'top',
          linebreak: true,
          process: function ( filepath ) {
            return grunt.template.process(
              licenseTemplate , {
                data: {
                  year: new Date().getFullYear()
                }
              }
            );
          },
          pattern: /^((?!\/\*\* Copyright).)+.*/gi
        },
        files: {
          src: [ 'main/common/**/*.js', 'main/features/**/*.js', 'test/**/*.js']
        }
      }
    }
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'html2js',
      'clean:server',
      'injector',
      'lineending',
      'concurrent:server',
      'configureRewriteRules',
      'configureProxies:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('esteServe', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'html2js',
      'clean:server',
      'injector',
      'lineending',
      'concurrent:server',
      'configureRewriteRules',
      'configureProxies:server',
      'autoprefixer',
      'connect:livereload',
      'esteWatch'
    ]);
  });

  grunt.registerTask('test', [
    'html2js',
    'clean:server',
    'clean:test',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('testE2e', [
    'html2js',
    'concurrent:test',
    'autoprefixer',
    'connect:dist',
    'protractor:e2e'
  ]);

  grunt.registerTask('serveE2e', [
    'html2js',
    'concurrent:test',
    'autoprefixer',
    'connect:dist',
    'protractor:e2e',
    'watch'
  ]);

  grunt.registerTask('build', [
    'html2js',
    'clean:dist',
    'makeDist'
  ]);

  grunt.registerTask('makeDist', [
    'html2js',
    'injector',
    'lineending',
    'taskHelper',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'htmlmin',
    'ngdocs'
  ]);

  grunt.registerTask('pot', [
    'clean:dist',
    'copy:dist',
    'htmlmin',
    'nggettext_extract'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
