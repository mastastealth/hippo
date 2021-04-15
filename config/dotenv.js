/* eslint-env node */

'use strict';

const path = require('path');

module.exports = function(/* env */) {
  return {
    clientAllowedKeys: ['SUPA_KEY','SUPA_URL'],
    failOnMissingKey: false,
    path: path.join(path.dirname(__dirname), '.env')
  }
};
