var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('/', index);
app.use('/users', users);

var mongoose = require('mongoose');

/*
mongoose.set('debug', function (collectionName, method, query, doc) {
    console.log('______________________________');
    console.log('collectionName', collectionName);
    console.log('method', method);
    console.log('query', query);
    console.log('doc', doc);
});
*/

var timeout = 3000000;

mongoose.connect(
    'mongodb+srv://formationNodeUser:formationNodePassword@cluster0-kt0tr.mongodb.net/test?retryWrites=true&w=majority',
    {
      promiseLibrary: global.Promise,
      useNewUrlParser: true
    }, function(err, db) {
      if (err) {
        console.error('Connection database : KO');
        console.error(err);
      } else {
        console.log('Connection database : OK');

      }
    });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
