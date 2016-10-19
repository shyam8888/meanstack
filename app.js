var express = require('express');
var session = require('express-session');
var compression = require('compression')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
app.use(compression());
app.use(session({
  secret: 'Th!sI$E9!aYP6Y',
  cookie: {
    maxAge: 864000
  },
  resave: true,
  saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//app.use(express.static(__dirname + '/client'));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// API related routes
require('./server/routes')(app);
var routes = require('./routes/index');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(request, response, next) {
  var err = new Error('Not Found');
  err.status = 404;
  if (request.accepts('json')) {
    response.statusCode = 404;
    response.send({
      status: false,
      error: {
        code: 404,
        message: 'Not found'
      }
    });
    return;
  }
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// production error handler
// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error', {
//    message: err.message,
//    error: {}
//  });
//});

module.exports = app;
