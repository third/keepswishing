// Load configurations
var config = require('./toolbox').config


// Bootstrap db connection
var mongoose = require('mongoose')


/**
 * Initializes database connection
 * @param  {String}   connStr   Optional parameter. Database connection string.
 * @param  {Function} next
 * @return {Function}
 */
module.exports = function(connStr, next) {
  if(typeof connStr === 'function') {
    next = connStr;
    connStr = config.db;
  }

  mongoose.connect(connStr);

  var db = mongoose.connection;


  db.once('open', function() {
    console.log('done db connection');

    next(mongoose);
  });

  db.on('error', function() {
    console.error.bind(console, 'connection error:');
  });

}



