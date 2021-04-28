var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');

//configuration for okta login
const oktaConfig = require('./config.js').webServer;	

var indexRouter = require('./routes/index');
var searchRouter = require('./routes/search');
var usersRouter = require('./routes/users');

const port = 8080;

//middleware config for login
const oidc = new ExpressOIDC(Object.assign({
    issuer: oktaConfig.oidc.issuer,
    client_id: oktaConfig.oidc.clientId,
    client_secret: oktaConfig.oidc.clientSecret,
    appBaseUrl: oktaConfig.oidc.appBaseUrl,
    scope: oktaConfig.oidc.scope,
    testing: oktaConfig.oidc.testing
  }, {}));

var app = express();

app.use(session({
    secret: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHrandomstring',
    resave: true,
    saveUninitialized: false
  }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//use this if you just want to render HTML
//app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname,'public','favicon.ico')));

app.use(oidc.router);

app.use('/', indexRouter);
app.use('/search', searchRouter);

app.get('/profile', oidc.ensureAuthenticated(), (req, res) => {
    // Convert the userinfo object into an attribute array, for rendering with mustache
    // ^^ not using mustache but not going to remove this because ... it's not hurting anyone 
    const userinfo = req.userContext && req.userContext.userinfo;
    const attributes = Object.entries(userinfo);
    //res.send(JSON.stringify(req.userContext.userinfo));
    res.render('userProfile', {
      isLoggedIn: !!userinfo,
      userinfo: userinfo,
      title: 'ejs',
      attributes
    });
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {error: err.message});
});

module.exports = app;

oidc.on('ready', () => {
	app.listen(port, () => {
    	console.log(`Dietmaster webserver listening at http://localhost:${port}`);
	});

oidc.on('error', err => {
    // An error occurred with OIDC
    // eslint-disable-next-line no-console
    console.error('OIDC ERROR: ', err);

    // Throwing an error will terminate the server process
    // throw err;
  });
});