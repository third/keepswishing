var Middleware = require('./middleware')
  , pass = require('./pass')
  , errors = require('./errors')
  , User = require('../app/controllers/user')
  , WebsiteIndex = require('../app/controllers/website/index')
  , DashboardIndex = require('../app/controllers/dashboard/index')
  , AdminIndex = require('../app/controllers/admin/index')

module.exports = function(app) {

  // set up our security to be enforced on all requests to secure paths
  app.all('/dashboard', Middleware.ensureAuthenticated);
  app.all('/dashboard/admin', Middleware.ensureAdmin);



  app.get('/dashboard', Middleware.ensureAuthenticated, DashboardIndex.show);


  app.get('/admin', AdminIndex.show);


  app.get('/', WebsiteIndex.show);


  //login
  app.get('/login', User.showLogin);
  app.post('/login', User.authenticate);


  //logout
  app.get('/logout', User.logout);


  //signup
  app.get('/signup', User.showSignup);
  app.post('/signup', User.saveSignup);
  app.get('/signup/confirm/:id', User.confirmSignup);


  //default
  errors(app);

}