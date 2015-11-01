/**
 * ES6 looks awesome! Hey, and Node 0.12 supports a ton of features!
 *
 * ::HOURS LATER::
 *
 * In strict mode only!
 *
 * ::HOURS LATER::
 *
 * The docs say modules are supported! Let's convert everything now!
 *
 * ::HOURS LATER::
 *
 * Actually no, the docs just list the flag as a reference for what
 * you'd use *once modules are officially supported*.
 *
 * God dammit.
 *
 * ::HOURS LATER::
 *
 * Babel! Turn that frown upside down by transpiling our code into an
 * ES6 environment!
 *
 * ::HOURS LATER::
 *
 * Babel doesn't transpile the file it's required from. Sure.
 *
 * Anyways, I guess this is the entry point into our app now. Enjoy your
 * fuckin fat arrows, or whatever.
 *
 * Christ almighty.
 */

require('babel/register')({
  stage: 0,
  optional: [
    'es7.objectRestSpread'
  ],
  only: [
    process.cwd() + '/*.js'
  ]
});

module.exports = require('./server');
