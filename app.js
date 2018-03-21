var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var fs = require("fs");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


//mongodb://admin:123456@localhost:27017/node_day3 --> AuthMod
mongoose.connect("mongodb://localhost:27017/purchase");

fs.readdirSync(path.join(__dirname, "models")).forEach(function (filename) {
  require('./models/' + filename);
});

var orders = require('./controuler/orders');

var app = express();
var fs = require('fs');
var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/souq");

fs.readdirSync(path.join(__dirname,"models")).forEach(function (fileName) {
    
    require("./models/" + fileName);
    
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/orders', orders);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);

});
app.listen(9050);
module.exports = app;
