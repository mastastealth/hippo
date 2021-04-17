/* eslint-env node */

'use strict';

const path = require('path');

module.exports = function (env) {
  return {
    clientAllowedKeys: ['SUPA_KEY', 'SUPA_URL'],
    failOnMissingKey: true,
    path: path.join(path.dirname(__dirname), '.env'),
    enabled: env !== 'production',
  };
};
