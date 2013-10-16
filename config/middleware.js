
exports.ensureAuthenticated = function(req, res, next) {
  if(req.isAuthenticated()) {
    console.log('is isAuthenticated');
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  }
  else {
    res.redirect('/logout');
  }
}

exports.ensureAdmin = function(req, res, next) {
  if(req.user && req.user.admin === true) {
    next();
  }
  else {
    res.redirect('/logout');
  }
}

exports.show404Page = function(req, res, next) {
  res.send('Opps 404');
}

