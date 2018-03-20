var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodeMid = bodyParser.urlencoded({ extended: true });
var jsonParser = bodyParser.json();
var mongoose = require('mongoose');
var ordersModel = mongoose.model('orders');

router.use(function(req,resp,next){
  resp.header("Access-Control-Allow-Origin","*");
  resp.header("Access-Control-Allow-Headers","Content-Type");
  resp.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE");
  next();
});
/* GET home page. */
router.get('/:id?', function (req, res, next) {

  if (req.params.id) {
    ordersModel.findOne({ orderId: req.params.id }, function (err, result) {
      if (err) {
        res.json(err);
      } else {
        res.json({"result":{"orders":result}});
      }
    });

  } else {
    ordersModel.find({}, function (err, result) {
      if (err) {
        res.json(err);
      } else {
        res.json({"result":{"orders":result}});
      }
    });
  }

});

router.post('/add',urlencodeMid, function (req, res, next) {
  console.log(req.body);
  console.log(req.body.status);
  console.log(req.body.products);
  
  var order = new ordersModel({
    orderId: req.body.orderId,
    status: req.body.status,
    products: req.body.products,
    user: req.body.userId
  });

  order.save(function (err, doc) {
    if (err) {
      res.json(err);
    } else {
      res.json(doc);
    }
  });
});

router.put('/edit/:id', function (req, res, next) {
  ordersModel.update({ orderId: req.params.id },
    {
      "$set": {
        status: req.body.status,
        products: req.body.products,
        user: req.body.userId
      }
    }
    , function (err, data) {
      if (!err) {
        res.json(err);
      } else {
        res.json(data);
      }
    })
});


router.delete('/delete/:id', function (req, res, next) {
  ordersModel.remove({ orderId: req.params.id }, function (err, data) {
    if (err) {
      res.json(err);
    } else {
      res.json(data);
    }
  })
});

module.exports = router;
