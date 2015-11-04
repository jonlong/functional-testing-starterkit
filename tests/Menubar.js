/**
 * Menubar
 */

define(function(require) {
  var registerSuite = require('intern!object');
  var assert = require('intern/chai!assert');

  registerSuite(function() {
    var page;

    return {
      name: 'Menubar',

      'setup': function() {
        page = this.remote

          // Load the Page
          .get(require.toUrl('../index.html'))

          // Cap the wait at five seconds
          .setFindTimeout(5000);
      },

      'dropdown toggle': function() {

        return page

          // Messages
          .findById('test-messages-menu')
            .findByClassName('dropdown-toggle')
              .click()
              .end()
            .findByClassName('dropdown-menu')
              .isDisplayed()
            .end()
          .end()

          // Notifications
          .findById('test-notifications-menu')
            .findByClassName('dropdown-toggle')
              .click()
              .end()
            .findByClassName('dropdown-menu')
              .isDisplayed()
            .end()
          .end()

          // Tasks
          .findById('test-tasks-menu')
            .findByClassName('dropdown-toggle')
              .click()
              .end()
            .findByClassName('dropdown-menu')
              .isDisplayed()
            .end()
          .end()
      },

      'sidebar toggle': function() {

        return page

          .findById('test-sidebar-menu-link')
            .click()
            .end()
          .findByClassName('control-sidebar-open');
      }

    };


  });
});