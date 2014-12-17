# Bonita-portal-js

## Requirements

- node.js + npm
- bower
- gulp (Use npm so we do not need to have gulp installed)

```sh
$ npm install
```

## Important

- Gulp runs task with a maximum concurency so ['env','test','build'] is not equal to env then test, then build. It's parallel.
- We use tasks from Community project. But we have our owns too, because we have to override some tasks. Such as the watch.


## Development

```sh
$ npm start
```

### About

This task runs in background:

```sh
$ ./node_modules/.bin/gulp community && ./node_modules/.bin/gulp --watchCommunity
```

So we build community and then we start gulp in dev mode with a flag in order to watch community files.

> You can also use `gulp`, but with npm you do not have to have gulp install in global

### Development + TDD

```sh
$ npm run tdd
```

## Production

```sh
$ npm run build
```

This task will run:

1. `gulp clean`: Remove previous dist directory
2. `gulp lint`: Run jshint and break if it fails
3. `gulp build`: Build the application and minify {app,assets}
4. `npm test`: Run unit tests

## Tests

### Run jshint

If you use `npm start`, jshint is loaded since we are in dev mode, the output is in the console. But we do not break the pipe if there is an error. Lint is a task build for this purpose.

```sh
$ gulp lint
```

### Run Karma with the watch

```sh
$ npm run testwatch
```

### Run karma one time before a PR or anything else

```sh
$ npm test
```

### View the coverage

Open the directory `./coverage`, this directory is build when you run karma.

## Tasks available

### Via npm

- `npm run clean`: clean the build directory
- `npm start`: launch dev mode (livereload etc.)
- `npm run tdd`: tdd
- `npm test`: test (single run)
- `npm testwatch`: test (no single run)
- `npm run build`: build the application (run gulp lint before and npm test after)
- `npm run e2e`: launch e2e test
- `npm run test:all`: launch e2e test and unit test

### Via gulp

- `gulp`: dev mode (server, browser, watch)
- `gulp lint`: Validate the code (if errors it breaks)
- `gulp clean`: Clean build directory
- `gulp e2e`: Run e2e tests
- `gulp browser`: Open the application in Chrome
- `gulp watch`: Watch changed on the code
- `gulp i18n`: Create .pot text for translations
- `gulp common`: Build common libraries
- `gulp styles`: Build CSS
- `gulp templates`: Build templates
- `gulp app`: Build the js app
- `gulp community`: Build community files
- `gulp community:load`: Load community files to the project dist
- `gulp html:build`: Build the html (assets, css)
- `gulp server`: Lauch dev server (dep: templates,app,html:build)
- `gulp build --prod`: Create a prod version (gulp *,!server,!lint,!clean)


## Configuration for Bower

We use bower but some libs need to be override since they do not provide the valid source file:

(ex `bower.json`):

```json
"overrides": {
  "moment": {
    "main": "min/moment-with-locales.js"
  }
},
```


## Configuration

Each task available exist in `./tasks`, one file per task.

> Except for the task build and default, as they aggregate other task.
