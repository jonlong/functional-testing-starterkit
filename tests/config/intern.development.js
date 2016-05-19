define(function(require) {

  // Load our CommonJS config file using the Dogo node loader
  var config = require('intern/dojo/node!../../config');

  /**
   * Configuration
   */

  return {

    // Browsers to run integration testing against.
    environments: [
      { browserName: 'chrome', version: '49' }
    ],

    // Maximum number of simultaneous integration tests that should be executed on the remote WebDriver service
    maxConcurrency: 2,

    // Name of the tunnel class to use for WebDriver tests.
    // See <https://theintern.github.io/intern/#option-tunnel> for built-in options
    tunnel: 'NullTunnel',
    proxyUrl: 'http://localhost:' + config.APP_SETTINGS.selenium_port,

    // Non-functional test suite(s) to run in each browser
    suites: null,

    // Only set this to true for debugging during local development.
    // It causes the browser to hang after error, which will also cause the CI
    // server to hang if it gets deployed while set to `true`.
    leaveRemoteOpen: false,

    // Functional test suite(s) to execute against each browser once non-functional tests are completed
    functionalSuites: [ 'built-tests/all.js' ],

    // A regular expression matching URLs to files that should not be included in code coverage analysis
    excludeInstrumentation: /^(?:tests|node_modules)\//
  };

});
