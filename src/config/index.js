require('dotenv').config();

// init update config file for postgres
require('./postgres');

module.exports = {
  sessionLifetime: process.env.SESSION_LIFETIME || 1000 * 60 * 30, // 30 minutes
  userAuthTypeList: [
    'BASIC',
  ],
};
