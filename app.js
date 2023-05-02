const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

let corsOptions = {
  origin: "https://p.eagate.573.jp"
}

const indexRouter = require('./routes/index');
const musicRouter = require('./routes/music');
const trackRouter = require('./routes/track');
const saveScoreRouter = require('./routes/saveScore');
const renewalRouter = require('./routes/renewal');

const app = express();
app.use(cors(corsOptions));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/script', express.static(__dirname + "/public/javascripts"));

app.use('/', indexRouter);
app.use('/music', musicRouter);
app.use('/track', trackRouter);
app.use('/saveScore', saveScoreRouter);
app.use('/renewal', renewalRouter);

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

app.listen(8001, () => console.log('Server Up and running at 8001'));
