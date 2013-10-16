var passport = require('passport')
  , User = require('../models/user')
  , toolbox = require('../../config/toolbox')
  , config = toolbox.config


exports.showLogin = function(req, res, next) {
  res.render('pages/content/website/login');
}

exports.authenticate = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      //req.session.messages =  [info.message];
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/dashboard');
    });
  })(req, res, next);
}


exports.showSignup = function(req, res, next) {
  res.render('pages/content/website/signup');
}

exports.saveSignup = function(req, res, next) {

  var form = req.body;
  var username = form.txtUsername;
  var password = form.txtPassword;
  var confirmPassword = form.txtConfirmPassword;
  var companyName = form.txtCompanyName;
  var firstName = form.txtFirstName;
  var lastName = form.txtLastName;

  //TODO: validation here

  var newUser = new User();
  newUser.username = username;
  newUser.password = password;
  newUser.firstName = firstName;
  newUser.lastName = lastName;

  if(config.is_demo) {
    newUser.confirmed = true;
    newUser.confirmedAt = toolbox.now;
  }

  newUser.save(function(err, user) {
    if(err) {
      throw err;
      return;
    }

    res.redirect('/login');
  });
}

exports.confirmSignup = function(req, res, next) {

}

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};