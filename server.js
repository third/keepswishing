var express = require('express'),
  http = require('http'),
  helmet = require('helmet'),
  passport = require('passport'),
  colors = require('colors'), 
  toolbox = require('./config/toolbox'),
  pass = require('./config/pass')



var app = express();
var MongoStore = require('connect-mongo')(express);


var config = toolbox.config;

//connect to the database
require('./config/db')(function(mongoose) {
 
});


 // all environments
app.set('port', process.env.PORT || 3333);
app.set('views', __dirname + '/app//views');
app.set('view engine', 'jade');
app.enable('trust proxy');
app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(helmet.xframe());
//app.use(helmet.iexss());
//app.use(helmet.contentTypeOptions());
//app.use(helmet.cacheControl());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(config.cookie_secret));
app.use(express.session({
  secret: config.session_secret,
  key: 'sid',
  //cookie: {httpOnly: true, secure: true}
  cookie: {httpOnly: true},
  store: new MongoStore({
    url: config.db
  })
}));
app.use(passport.initialize());
app.use(passport.session());

// app.use(express.csrf());
// app.use(function (req, res, next) {
//   res.locals.csrftoken = req.csrfToken();
//   next();
// });
//


app.use(express.static(__dirname + '/public', {maxAge: 60000}));  // 1min
app.use(express.compress());
app.use(app.router);

// development only
if ('development' == app.get('env')){
  app.use(express.errorHandler());
  app.locals.pretty = true;
}

//make these libraries available on our view engine
app.locals._      = require('underscore');
app.locals._.str  = require('underscore.string');
app.locals.moment = require('moment');


require('./config/routes')(app);

//TODO:
//1. DONE. Add models. Make it testable.
//2. DONE. Add passport
//3. Add angular
//4. App locals that will take care of page vars like title, menus, submenus, etc.
//5. DONE. Add ability to auto increment
//6. Login form
//7. Sign up form
//8. Send email
//9. Validate
//10. Add twitter bootstrap







http.createServer(app).listen(app.get('port'), function(){
  console.log('Third Express Seed app listening on port ' + app.get('port') + ', running in ' + app.settings.env + ' mode.');
  console.warn(config.reminder.yellow);
});