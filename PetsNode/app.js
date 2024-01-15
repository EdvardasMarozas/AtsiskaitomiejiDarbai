var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var methodOverride = require('method-override');
var multer = require('multer');
var session = require('express-session');
var db = require('./database/mysql');

var app = express();

app.use(function (req, res, next) {
  req.db = db;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(multer({ dest: "uploads/" }).single("image"));

app.use(
  methodOverride((req) => {
    // console.log(req.headers['content-type']);
    // console.log(req.body);
    // console.log(req.files);
    return req.body._method;
  })
);

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: "asdlkf.fdgskljpoefcsdffęėčęč",
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false,
  })
);

var indexRouter = require('./routes/index');
app.use("/", indexRouter);
var usersRouter = require('./routes/users');
app.use("/users", usersRouter);
var petsRouter = require('./routes/PetsRouter');
app.use("/petwars", petsRouter);

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
  res.render('error');
});

module.exports = app;
