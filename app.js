const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const logger = require('./logger');
const app = express();
const mongooseURL = "mongodb://localhost/"
const mongoosePort = "27017";

mongoose.Promise=global.Promise;
mongoose.connect(mongooseURL+mongoosePort);

const studentRoutes = require('./routes/student');
const companyRoutes = require('./routes/company');

// view engine setup(views not created though)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan('dev', {
    skip: function (req, res) {
        return res.statusCode < 400
    }, stream: process.stderr
}));

app.use(morgan('dev', {
    skip: function (req, res) {
        return res.statusCode >= 400
    }, stream: process.stdout
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(studentRoutes);
app.use(companyRoutes);

/*For parsing JSON data from request body*/
app.use(bodyParser.json());
/*For parsing URL Encoded data from request body*/
app.use(bodyParser.urlencoded({ extended: false}));

// catch 404 and forward to error handler after logging at error level
app.use(function(req, res, next) {
  const error = new Error('Not found');
  error.statusCode = 404;
  logger.error(error);
  next(error);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //logging the error at error level
  logger.error(err);
  // render the error page
  res.status(err.status || 500);
  res.json({
      error : {
          message : err.message
      }
  });

});

module.exports = app;
