/**
 * Menubar
 */

define(function(require) {
  var registerSuite = require('intern!object');
  var assert = require('intern/chai!assert');

  registerSuite(function() {
    var page;

    return {
      name: 'Mobile',

      'setup': function() {
        page = this.remote

          // Load the Page
          .get(require.toUrl('../index.html'))

          // Cap the wait at five seconds
          .setFindTimeout(5000)

          // Set a mobile breakpoint (in pixels)
          .setWindowSize(760, 800);
      },

      'nav toggle': function() {

        return page

          // Messages
          .findById('test-sidebar-toggle')
            .click()
            .end()
          .findByClassName('sidebar-open')
            .end()
          .findByClassName('main-sidebar')
            .isDisplayed()
      }

    };


  });
});