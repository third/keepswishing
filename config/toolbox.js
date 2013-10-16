var moment = require('moment')
  , env = process.env.NODE_ENV || 'development'
  , config = require('./config')[env]

/**
 * Helper function for getting a handle to config/config.js
 * with the appropriate node environment
 * @type {[type]}
 */
exports.config = config;


exports.now = function() {
  return moment.utc();
}