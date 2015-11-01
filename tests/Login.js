/**
 * Login
 */

define(function(require) {
  var registerSuite = require('intern!object');
  var assert = require('intern/chai!assert');

  registerSuite({
    name: 'Login',

    'successful login': function() {

      return this.remote

        // Load the Page
        //
        // TODO: This is loading the root, not the specified page.
        .get(require.toUrl('/pages/examples/login.html'))

        // Cap the wait at five seconds
        .setFindTimeout(5000)

        // Log in
        .findById('test-login-email-field')
          .click()
          .type('test@fakelogin.com')
          .end()
        .findById('test-login-password-field')
          .click()
          .type('correcthorsebatterystaple')
          .end()
        .findById('test-login-submit-btn')
          .click()
          .end()

        // Limit the success page wait to five seconds
        .setFindTimeout(5000)

        // Find the marker that indicates successful login
        .findById('test-authenticated')
          .then(function() {

            // Return `true` on success.
            // Failing tests are caught automatically by Promise errors.
            return true;
          });
    }
  });
});