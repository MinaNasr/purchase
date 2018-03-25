var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodeMid = bodyParser.urlencoded({ extended: true });
var jsonParser = bodyParser.json();
var mongoose = require('mongoose');
var ordersModel = mongoose.model('orders');
var productsModel = mongoose.model('products');


router.use(function(req,resp,next){
  resp.header("Access-Control-Allow-Origin","*");
  resp.header("Access-Control-Allow-Headers","Content-Type");
  resp.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE");
  next();
});
/* GET home page. */
router.get('/:seller/:id?', function (req, res, next) {

  if (req.params.id) {
    ordersModel.findOne({_id: req.params.id }).populate("products").exec((err,data) =>{
      var elements=[];
      var arr =[];
      var total=0;
  for (let i = 0; i < data.products.length; i++) {
    const element = data.products[i];
    if(element.userId == req.params.seller){
      elements.push(element);
      total += element.price;
    }
  }
  if(elements.length > 0){
    data.products = elements;
    data.total = total;
    arr.push(data);
  }
  res.json({res:arr});
    });
    // , function (err, result) {
    //   if (err) {
    //     res.json(err);
    //   } else {
    //     res.json({"result":{"orders":result}});
    //   }
    // });

  } else {
    ordersModel.find({}).populate("products").exec((err,data)=>{
      console.log(data);
      var arr =[];
      
      var a = {};
      data.forEach(order => {
        var total=0;
        var elements=[];
        for (let i = 0; i < order.products.length; i++) {
          const element = order.products[i];
          if(element.userId == req.params.seller){
            elements.push(element);
            total += element.price;
          }
        }
        if(elements.length > 0){
        order.products = elements;
        order.total = total ;
        a.totalPrice=total;
        arr.push(order);
        }
      });
      res.json({res:arr});
      });
  }

});

router.get('/filter/:id', function (req, res, next) {
ordersModel.find({}).populate("products").exec((err,data)=>{
console.log(data);
var arr =[];

var a = {};
data.forEach(order => {
  var total=0;
  var elements=[];
  for (let i = 0; i < order.products.length; i++) {
    const element = order.products[i];
    if(element.userId == req.params.id){
      elements.push(element);
      total += element.price;
    }
  }
  if(elements.length > 0){
  order.products = elements;
  order.total = total ;
  a.totalPrice=total;
  arr.push(order);
  }
});
res.json({res:arr});
});
    // ordersModel.find({}, function (err, result) {
    //   var orders=[];
    //   if (err) {
    //     res.json(err);
    //   } else {
    //     result.forEach(element => {
    //       var prod=element.products;
    //       var arr = [];
    //       for (let i = 0; i < prod.length; i++) {
    //         const p = prod[i];
    //         productsModel.findOne({_id:p},function (err,result1) {
    //           if (result1.userId == req.params.id) {
    //           arr.push(result1);
    //           }
    //         });
            
    //       }
    //       if(arr.length > 0){
    //         console.log("if");
            
    //         element.products = arr;
    //         orders.push(element);
    //       }
          
    //     });
    //     res.json({"result":{"orders":orders}});
    //   }
    // });
  

});

router.post('/add',jsonParser, function (req, res, next) {
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

router.put('/edit/:id',jsonParser, function (req, res, next) {
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
