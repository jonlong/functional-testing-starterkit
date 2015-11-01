var path = require('path');

var makeAppPaths = function(cwd) {
  var cwd = cwd || '';
  var srcPath = path.join(cwd, 'src');
  var assetsPath = path.join(cwd, 'assets');
  var buildPath = path.join(cwd, 'dist');
  var testsPath = path.join(cwd, 'tests');

  return {
    root: cwd,
    src: srcPath,
    package: path.join(cwd, '/package.json'),
    components: path.join(srcPath, 'components'),
    node_modules: path.join(cwd, 'node_modules'),
    views: srcPath,
    backend: {
      default: path.join(cwd, 'index.js'),
      server: path.join(srcPath, 'server.js')
    },
    tests: {
      default: testsPath,
      config: path.join(testsPath, 'config'),
      functional: testsPath
    },
  };
};

var config = {};

config.PROTOCOL = process.env.NODE_ENV === 'development' ? 'http' : 'https';

config.APP_PATHS = makeAppPaths(process.cwd());

config.APP_SETTINGS = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT ? process.env.PORT : 3000,
  selenium_port: process.env.SELENIUM_PORT ? process.env.SELENIUM_PORT : 3001,
  build_url: 'http://intern-starterkit-build.herokuapp.com'
};

config.APP_URL = config.PROTOCOL + ':' + config.APP_SETTINGS.host + ':' + config.APP_SETTINGS.port;

config.RELATIVE_APP_PATHS = makeAppPaths();

module.exports = config;