'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'hippo',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {},
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {},
  };

  // if (environment === 'development') {}

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    ENV.SUPA_KEY = process.env.SUPA_KEY;
    ENV.SUPA_URL = process.env.SUPA_URL;
  }

  return ENV;
};
