require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// languages
var i18next = require('i18next')
var middleware = require('i18next-http-middleware')
i18next.use(middleware.LanguageDetector).init({
  preload: ['en', 'ar'],
  fallbackLng: 'en',
  resources: {
    en: {
      translation: require('./lib/v1/locales/en/translation.json')
    },
    ar: {
      translation: require('./lib/v1/locales/ar/translation.json')
    }
  }
})


var v1Routes = require('./lib/v1/routes');
var app = express();

app.use(
  middleware.handle(i18next, {})
)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1', v1Routes)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
