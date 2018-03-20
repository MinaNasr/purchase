var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodeMid = bodyParser.urlencoded({ extended: true });
var mongoose = require('mongoose');
var ordersModel = mongoose.model('orders');


/* GET home page. */
router.get('/:id?', function (req, res, next) {

  if (req.params.id) {
    ordersModel.findOne({ orderId: req.params.id }, function (err, result) {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    });

  } else {
    ordersModel.find({}, function (err, result) {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    });
  }

});

router.post('/add',urlencodeMid, function (req, res, next) {
var order = new ordersModel({
orderId:req.body.id,
name:req.body.name,
user:req.body.user
});

order.save(function(err,doc){
  if (err) {
    res.json(err);
  }else{
    res.json(doc);
  }
});
});

router.put('/edit/:id', function (req, res, next) {
  ordersModel.update({orderId:req.params.id},{"$set":{name:req.body.name}},function(err,data){
    if(!err){
      res.json(err);
    }else{
      res.json(data);
    }
  })
});

router.delete('/delete/:id', function (req, res, next) {
ordersModel.remove({orderId:req.params.id},function (err,data) {
  if (err) {
    res.json(err);
  }else{
    res.json(data);
  }
})
});

module.exports = router;
