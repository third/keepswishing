var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , Enums = require('../config/enums')
  , User = require('../app/models/user')


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  User.getAuthenticated(username, password, function(err, user, reason) {
    if(user === null) {
      user = false;
    }

    done(err, user);
  });
}));