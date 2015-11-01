var config = require('./config');
var errorhandler = require('errorhandler');
var express = require('express');
var app = express();
var { APP_PATHS, APP_SETTINGS, RELATIVE_APP_PATHS } = config;
var port = process.env.PORT || APP_SETTINGS.port;
var host = process.env.HOST || APP_SETTINGS.host;

app.set('view engine', 'html');
app.set('views', APP_PATHS.views);

/**
 * Routes and Static Files
 *
 * - The sample front end for this repo is installed with the `admin-lte` package.
 * - Static files are in that package's `dist` directory
 * - Views are static HTML and load on any request method
 */

app.use(express.static(`${RELATIVE_APP_PATHS.views}/dist`));

app.all('*', function(req, res, next) {
  res.sendFile(APP_PATHS.views + req.originalUrl);
});

/**
 * Fire it up
 */

if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler());
}

app.listen(port, host);

console.info('==> ✅  Server is listening');
console.info('==> 🌎  Go to ' + host + ':' + port);

exports = module.exports = app;
