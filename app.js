var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');

var indexRouter = require('./routes/index');
var searchRouter = require('./routes/search');
var usersRouter = require('./routes/users');
var settingsRouter = require('./routes/settings');
var userProfileRouter = require('./routes/userProfile');
/*var dietPrefrencesRouter = require('./routes/dietPrefrences');
var notificationsRouter = require('./routes/notifications');
var accountSecurityRouter = require('./routes/accountSecurity');*/

const port = 8000;

var app = express();

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

app.use('/', indexRouter);
app.use('/search', searchRouter);
app.use('/users', usersRouter);
app.use('/settings', settingsRouter);
app.use('/userProfile', userProfileRouter);

//handle form 
// app.post('/search', function (req, res) {
//   console.log(req.body);
//   res.send(req.body);
// });

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

app.listen(port, () => {
  console.log(`Dietmaster webserver listening at http://localhost:${port}`)
})