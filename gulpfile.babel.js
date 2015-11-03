var gulp = require('gulp');
var gutil = require('gulp-util');
var nodemon = require('gulp-nodemon');
var babel = require('gulp-babel');
var browserSync = require('browser-sync');
var shell = require('gulp-shell');
var del = require('del');
var chromeDriver = require('chromedriver');
var Server = require('gulp-live-server');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var { APP_PATHS, APP_SETTINGS, RELATIVE_APP_PATHS } = require('./config');

/**
 * Server
 *
 * Runs the test app and watches server files for changes.
 */

gulp.task('server', function() {

  nodemon({
    script: APP_PATHS.backend.default,
    env: {
      'NODE_ENV': 'development'
    },
    watch: [
      `${RELATIVE_APP_PATHS.src}/*.js`
    ]
  })

  .on('restart', function() {
    gutil.log('[nodemon] restarted');
    browserSync.reload();
  });

});

/**
 * Functional Tests
 *
 * - Configures a local Selenium server using ChromeDriver (for development environments)
 * - Builds tests with Babel
 * - Runs tests with environment-specific Intern configs
 * - Cleans up built tests
 */

gulp.task('tests:functional', function() {

  // Local Selenium settings
  var env = {
    TEST_ENV: 'test',
    NODE_ENV: 'test',
    PORT: APP_SETTINGS.selenium_port
  };

  var chromeDriverArgs = [
    '--url-base=wd/hub',
    '--port=4444'
  ];

  var server = Server(APP_PATHS.backend.default, { env: env });
  var chromeDriverProcess;

  // Cleanup function to remove compiled test files
  var cleanup = function() {
    if (chromeDriverProcess) {
      chromeDriverProcess.kill();
    }

    server.stop();

    del([ 'built-tests' ]);
  }

  /**
   * Run Tests
   */

  return gulp.src(`${APP_PATHS.tests.default}/**/*`)
    .pipe(babel())
    .pipe(gulp.dest('built-tests'))
    .on('finish', function() {

      /**
       * After the files are built, run Intern and clean up afterwards.
       *
       * We want to run local Selenium tests as the default, and BrowserStack
       * tests for anything headed to production.
       *
       * To run local Selenium tests, we need to start a child process locally,
       * so that gets scaffolded in this task. BrowserStack doesn't require any
       * setup and is configured in `intern.production.js`.

       */

      if (process.env.TEST_ENV !== 'production') {

        // Start a server to run the local Selenium tests against
        server.start();

        chromeDriverProcess = require('child_process')
          .execFile(chromeDriver.path, chromeDriverArgs);
      }

      gulp.src('')
        .pipe(shell([
          `<%= debugConfig() %>./node_modules/.bin/intern-runner config=${RELATIVE_APP_PATHS.tests.config}/<%= internConfig() %>`
        ], {
          templateData: {
            internConfig: function() {

              /**
               * Use a different Intern config for different environments.
               *
               * For example, locally we want to run our tests using local Selenium,
               * but for production builds, we want to test against a ton of
               * browsers using BrowserStack.
               */

              switch(process.env.TEST_ENV) {
              case 'production':
                return 'intern.production';
              default:
                return 'intern.development';
              }
            },

            debugConfig: function() {

              /**
               * Use Node Inspector for Debugging
               *
               * If we want to debug local builds with Node Inspector, this command
               * accepts a debug flag to run the tests accordingly.
               */

              if(process.env.DEBUG_TESTS) {
                return './node_modules/.bin/node-debug ';
              }
            }
          }
        }))

        .on('finish', function() {
          cleanup();
          process.exit(0);
        })

        .on('error', function() {
          cleanup();

          /**
           * Explicity exit the process with an error. Otherwise gulp will exit
           * with `code 0`, which fools our CI builds into thinking everything
           * is successful.
           */

          process.exit(1);
        });
    });

});

/**
 * .gitignore
 *
 * This task is used to dynamically add paths to our .gitignore file,
 * which are specified in the `config`.
 *
 * It's main use is to help our CI server build everything, but only
 * deploy what the servers need to run. Since the CI builds
 * everything, it needs our devDependencies, but we don't want to
 * push any of that with our deployments. Since the servers manage
 * deployments with Git, we need to exclude those files, so we add
 * them to those servers' .gitignore configurations.
 *
 * This keeps the devDeps avaialble on the CI server, but ensures
 * they aren't deployed, and speeds up the builds considerably.
 */

gulp.task('gitignore', function() {

  // Load package.json
  var pkg = JSON.parse(
    fs.readFileSync(
        path.join(APP_PATHS.root, 'package.json'),
        'utf8')
    );

  // Extract devDeps
  var devDependencies = _.map(_.keys(pkg.devDependencies), function(dep) {
    return '/node_modules/' + dep;
  });

  // Create an iterable object
  var entries = _.flatten(devDependencies);

  // Build our batch of files, so we can include them all at once
  var batch = '\r\n';

  _.forEach(entries, function(entry) {
    batch += entry + '\r\n';
  });

  // Add them to the .gitignore
  fs.appendFile(path.join(APP_PATHS.root, '.gitignore'), batch, function(err) {
    if (err) {
      throw Error();
    }

    return;
  });

});
