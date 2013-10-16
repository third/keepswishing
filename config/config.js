//set reminder to empty once you're done what it says (i.e. var reminder = '';)
var reminder = '\n\nIMPORTANT:\n1. Make sure to update the default settings on /config/config.js.\n2. Set \'reminder\' to empty string to remove this message.\n\n';

module.exports = {
  development: {
    db: 'mongodb://localhost/thirdseeddb',
    session_secret: 'ac9c6389330cae9b46469e3a1f2861db',                                 //don't forget to change this
    cookie_secret: 'f0d54f986354f2ece1f0234eec1e2eec',                                  //don't forget to change this
    mailer: {
      from: 'notification@mydomain.com',                                                //don't forget to change this
      fromFriendlyName: 'MyDomain.com',                                                 //don't forget to change this
      provider: 'mandrill',
      apiKey: ''                                                                        //don't forget to change this
    },
    reminder: reminder
  }, 
  production: {
    db: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL,                            //process.env.DB
    session_secret: 'ac9c6389330cae9b46469e3a1f2861db',                                 //don't forget to change this
    cookie_secret: 'f0d54f986354f2ece1f0234eec1e2eec',                                  //don't forget to change this
    mailer: {
      from: 'notification@mydomain.com',                                                //don't forget to change this
      fromFriendlyName: 'MyDomain.com',                                                 //don't forget to change this
      provider: 'mandrill',
      apiKey: ''                                                                        //don't forget to change this
    },
    reminder: reminder
  }
}