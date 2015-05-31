// Generated on 2014-06-10 using generator-angular 0.8.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    portaljs: {
      // configurable paths
      app: 'main',
      dist: 'dist',
      build: 'build'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= portaljs.app %>/*.js', '<%= portaljs.app %>/features/**/*.js', '<%= portaljs.app %>/commons/**/*.js', '<%= portaljs.app %>/assets/**/*.js'],
        tasks: ['newer:jshint:all', 'ngdocs:all'],
        options: {
          livereload: true
        }
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
          '<%= portaljs.app %>/**/*.html',
          '.tmp/styles/{,*/}*.css'
        ]
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
              port: 8080,
              https: false,
              changeOrigin: false,
              xforward: false
            };
          }

          return [
                  forward('/bonita/apps'),
                  forward('/bonita/API'),
                  forward('/bonita/portal/')
              ];
        })()
      },
      rules: [
        // prefix web appliation
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
            '<%= portaljs.app %>'
          ],
          middleware: function (connect, options) {
            if (!Array.isArray(options.base)) {
              options.base = [options.base];
            }

            // Setup the proxy
            var middlewares = [
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
          port: 9002,
          base: '<%= portaljs.dist %>',
          middleware: function (connect, options) {
            if (!Array.isArray(options.base)) {
              options.base = [options.base];
            }
            // Setup the proxy
            var middlewares = [
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
          jshintrc: '.jshintrc'
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
      server: '.tmp'
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
      'e2e': {
        src: ['<%= portaljs.app %>/index.html'],
        ignorePath: '<%= portaljs.app %>/'
      },
      'build': {
        src: ['<%= portaljs.app %>/index.html'],
        ignorePath: '<%= portaljs.app %>/',

        options: {
          'overrides': {
            'bootstrap': {'main': []}
          }
        }
      },

    },

    injector: {
      options: {
        ignorePath: 'main/',
        addRootSlash: false
      },
      sources: {
        files: {
          '<%= portaljs.app %>/index.html': [
            '<%= portaljs.app %>/common/**/*.js',
            '<%= portaljs.app %>/features/**/*.js',
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
      html: ['<%= portaljs.dist %>/**/*.html'],
      css: ['<%= portaljs.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= portaljs.dist %>']
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
          removeCommentsFromCDATA: true
        },
        files: [
          {
            expand: true,
            cwd: '<%= portaljs.dist %>',
            src: ['*.html', '**/*.html'],
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
              '**/*.html'
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
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    protractor: {
      options: {
        configFile: 'protractor.conf.js', // Default config file
        keepAlive: true, // If false, the grunt process stops when the test fails.
        noColor: false, // If true, protractor will not use colors in its output.
        //debug : true,
        args: {
          // Arguments passed to the command
        }
      },
      e2e: {
        options: {
          //configFile: "e2e.conf.js", // Target-specific config file
          args: {
            // suite: 'process-details-information'
          } // Target-specific arguments
        }
      }
    },


    /* jshint camelcase: false */
    nggettext_extract: {
      pot: {
        files: {
          'i18n/portaljs.pot': ['<%= portaljs.app %>/features/**/*.html', '<%= portaljs.app %>/common/**/*.html']
        }
      }
    },
    ngdocs: {
      options: {
        dest: '<%= portaljs.app %>/docs',
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
    }
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep:build',
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

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('buildE2e', [
    'clean:dist',
    'wiredep:e2e',
    'makeDist',
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:dist',
    'karma',
    'protractor:e2e'
  ]);

  grunt.registerTask('testE2e', [
    'concurrent:test',
    'autoprefixer',
    'connect:dist',
    'protractor:e2e'
  ]);

  grunt.registerTask('serveE2e', [
    'concurrent:test',
    'autoprefixer',
    'connect:dist',
    'protractor:e2e',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep:build',
    'makeDist'
  ]);

  grunt.registerTask('makeDist', [
    'injector',
    'lineending',
    'nggettext_extract',
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


  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build' //,
    //'testE2e'
  ]);
};
