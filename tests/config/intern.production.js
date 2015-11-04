define(function(require) {

  // Load our CommonJS config file using the Dogo node loader
  var config = require('intern/dojo/node!../../config');

  return {

    capabilities: {
      'browserstack.selenium_version': '2.45.0'
    },

    // Browsers to run integration testing against on BrowserStack
    environments: [
      {
        browserName: 'internet explorer',
        version: '10',
        platform: 'WIN8'
      }, {
        browserName: 'firefox',
        version: '37',
        platform: [ 'WINDOWS' ]
      }, {
        browserName: 'chrome',
        version: '39',
        platform: [ 'MAC' ]
      }
    ],

    // Maximum number of simultaneous integration tests that should be executed on the remote WebDriver service
    maxConcurrency: 2,

    // Name of the tunnel class to use for WebDriver tests.
    // See <https://theintern.github.io/intern/#option-tunnel> for built-in options
    tunnel: 'BrowserStackTunnel',
    tunnelOptions: {
      username: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_ACCESSKEY
    },

    // We'll deploy to a build server that replicates our production
    // environment for the production tests
    proxyUrl: config.APP_SETTINGS.build_url,

    // Non-functional test suite(s) to run in each browser
    suites: null,

    // Functional test suite(s) to execute against each browser once non-functional tests are completed
    functionalSuites: [ 'built-tests/all.js' ],

    // A regular expression matching URLs to files that should not be included in code coverage analysis
    excludeInstrumentation: /^(?:tests|node_modules)\//
  };
});