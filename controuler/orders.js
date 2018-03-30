var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodeMid = bodyParser.urlencoded({ extended: true });
var jsonParser = bodyParser.json();
var mongoose = require('mongoose');
var ordersModel = mongoose.model('orders');
var productsModel = mongoose.model('products');


router.use(function (req, resp, next) {
  resp.header("Access-Control-Allow-Origin", "*");
  resp.header("Access-Control-Allow-Headers", "Content-Type");
  resp.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  next();
});
/* GET home page. */

router.get('/userOrders/:uId/:page?/:oId?', function (req, res, next) {
  var page = req.params.page ? page = req.params.page : page = 1;
  var query = { user: req.params.uId };
  var options = {
    sort: { time: -1 },
    populate: 'products',
    offset: 0,
    page: page,
    limit: 5
  };
  if (!req.params.oId) {
    ordersModel.find({ user: req.params.uId }, (err, result) => {
      if (!err && result != null) {
        ordersModel.paginate(query, options).then((data) => {
          console.log(data);
          data.docs.forEach(order => {
            var total = 0;
            for (let i = 0; i < order.products.length; i++) {
              const element = order.products[i];
              total += element.price;
            }
            order.total = total;
          });
          res.json({ data });
        });
      } else {
        res.json({ err: err });
      }
    });
  } else {
    ordersModel.findOne({ _id: req.params.oId }, (err, result) => {
      if (!err && result != null) {
        ordersModel.findOne({ _id: req.params.oId }).populate("products").populate("sellerId").exec((err, data) => {
          console.log(data);
          var total = 0;
          for (let i = 0; i < data.products.length; i++) {
            const element = data.products[i];
            total += element.price;
          }
          data.total = total;
          res.json({ res: data });
        });
      } else {
        res.json({ err: err });
      }
    });

  }
});



router.get('/:seller/:page?/:id?', function (req, res, next) {
  var page = req.params.page ? page = req.params.page : page = 1;
  var limit = 5;
  var query = { sellerId: req.params.seller };
  var options = {
    sort: { time: -1 },
    populate: 'products',
    offset: 0,
    page: page,
    limit: 5
  };


  console.log(req);
  if (req.params.id) {
    ordersModel.findOne({ _id: req.params.id }, (err, result) => {
      if (!err && result != null) {
        ordersModel.findOne({ _id: req.params.id }).populate("products").populate("user").exec((err, data) => {

          var elements = [];
          var arr = [];
          var total = 0;
          for (let i = 0; i < data.products.length; i++) {
            const element = data.products[i];
            if (element.userId == req.params.seller) {
              elements.push(element);
              total += element.price;
            }
          }
          if (elements.length > 0) {
            data.products = elements;
            data.total = total;
            arr.push(data);
          }
          res.json({ res: arr });
        });
      } else {
        res.json(err);
      }
    });


  } else {
    ordersModel.paginate(query, options).then((data) => {
      console.log(data);
      data.docs.forEach(order => {
        if (order.products.length > 0) {
          var total = 0;
          //   var elements=[];
          for (let i = 0; i < order.products.length; i++) {
            const element = order.products[i];
            total += element.price;
          }

          order.total = total;
        }
      });
      res.json(data);
    });
  }

});



router.post('/add', jsonParser, function (req, res, next) {

  var allProducts = req.body;
  var ordersArr = [];
  var productsArr = [];
  var quantitiesArr = [];

  for (const key in allProducts) {

    if (allProducts.hasOwnProperty(key)) {
      const element = allProducts[key];
      var order = new ordersModel({
        status: "ordered",
        products: element["products"],
        user: req.body.user,
        sellerId: key,
        quantities: element["numbers"],
        time: Date.now()
      });

      element["products"].forEach(product => {
        productsArr.push(product);
      });
      quantitiesArr.push(...order.quantities);
      ordersArr.push(order);
    }
  }
  ordersModel.insertMany(ordersArr, function (err, docs) {
    if (!err) {
      docs.forEach(doc => {
        decremnetProducts(doc)
      });
      res.json({ res: "success" });
    } else {
      res.json({ res: "error" });
    }
  });


});

// function checkAvaliablity(arr, quants) {
//   var errorArr = [];
//   for (let i = 0; i < arr.length; i++) {
//     const element = arr[i];
//     products.find({ _id: element }, function (err, data) {
//       if (err) {
//         errorArr.push(element);
//       } else {
//         if (data.stock < quants[i] || !data.amount) {
//           errorArr.push(element);
//         }
//       }
//     })
//   }
//   return errorArr;
// }

function decremnetProducts(doc) {
  ordersModel.findById(doc._id).populate("products")
    .exec((err, data) => {

      for (let i = 0; i < data.products.length; i++) {
        const product = data.products[i];
        const quant = data.quantities[i];
        productsModel.updateOne({ _id: product._id, stock: { $gt: 0 } }
          , { $inc: { stock: -quant } }
          , (err, raw) => {
            if (i == (data.products.length - 1)) {
              return 1;
            } else {
              return 0;
            }
          });

      }
    });

}

router.put('/edit/:id', jsonParser, function (req, res, next) {
  ordersModel.update({ _id: req.params.id },
    {
      "$set": {
        status: req.body.status,
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
  ordersModel.remove({ _id: req.params.id }, function (err, data) {
    if (err) {
      res.json(err);
    } else {
      res.json(data);
    }
  })
});

module.exports = router;
