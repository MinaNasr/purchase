var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var fs = require("fs");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var https = require("https");
var jwt = require("jsonwebtoken");
var jwtDecode = require('jwt-decode');
var urlEncodedMid = bodyParser.urlencoded({extended:true,limit:"50mb"});
var app = express();

var options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
};

process.env.sercret = "mykey";

mongoose.connect("mongodb://localhost:27017/purchase");

fs.readdirSync(path.join(__dirname, "models")).forEach(function (filename) {
  require('./models/' + filename);
});

var apiAuth = require("./controuler/auth");
var apiUser = require("./controuler/user");
var orders = require('./controuler/orders');
var products = require('./controuler/products');
var categories = require('./controuler/category');
var subcats = require('./controuler/subcat');
var user = require('./controuler/user');
var cart = require('./controuler/cart')





app.use(function(req,resp,next){
  resp.header("Access-Control-Allow-Origin","*");
  resp.header("Access-Control-Allow-Headers","X-ACCESS_TOKEN , Access-Control-Allow-Origin , Authorization , Origin , x-requested-with , Content-Type , token,email");
  resp.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE")
  next();
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(urlEncodedMid);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/user",apiUser);
app.use("/api/authenticate",apiAuth);

// app.use(function (req,resp,next) {
//   var userToken = req.headers['token'];
//   if (typeof userToken !== "undefined") {
//     jwt.verify(userToken, 'mykey' , function (err,authData) {
//       if (err) {
//         resp.json({resp:"not Authurized"});
//       }
//       else {
//         var decoded = jwtDecode(userToken);
//         req.userEmail = decoded.email;
//         next();
//       }
//     })
//   }
//   else {
//     resp.json({token:"not Authurized"});
//   }
// })

app.use('/api/orders', orders);
app.use('/api/products', products);
app.use('/api/categories', categories);
app.use('/api/subcat', subcats);
app.use('/api/user', user);
app.use('/api/cart', cart);


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

https.createServer(options, app).listen(9050);
