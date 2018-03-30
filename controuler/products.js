var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var fs = require("fs");
var multer = require("multer");
var fileUploadMid = multer({ dest: "./public/images" });
var bodyParser = require("body-parser");
var UrlEncodedParser = bodyParser.urlencoded({ extended: true });
var jsonParser = bodyParser.json({limit:"50mb"});
var mongodb = require('mongodb');

//creating products database model
var productsModule = mongoose.model("products");
var subcatModule = mongoose.model("subcat");

/* GET home page. */


router.get('/search/:keyword', (req, res) => {
    var re = new RegExp("^" + req.params.keyword, "i");
    productsModule.find({$or : [{'name': { $regex:  re} }, {'desc': { $regex:  re} }]}, (error, data) => {
        res.json(data);
    });
});

router.get('/:id?', function (request, response, next) {
    if (request.params.id) {
        var id = request.params.id
        productsModule.findOne({ _id: id }, function (err, result) {
            response.json(result);
        })
    } else {
        productsModule.find({}, function (err, result) {
            response.json(result);
        })
    }

});

//seller id
router.get('/seller/:sellerid', function (request, response, next) {
    console.log("inside");
    
    if (request.params.sellerid) {
        var seller = request.params.sellerid
        productsModule.find({ userId : seller }, function (err, result) {
            response.json(result);
        })
    }

});

// add with post request
router.post('/add', jsonParser, function (request, response, next) {
    console.log(request.body.productName);
    var subcat = request.body.subcat;
    if(request.body.productName != "" && request.body.productPrice !="" && request.body.productDesc !="" &&
        request.body.image != ""){
    var product = new productsModule({
        productId: request.body.productId,
        name: request.body.productName,
        price: request.body.productPrice,
        desc: request.body.productDesc,
        stock: request.body.pcs,
        subcat: request.body.subcat,
        userId: request.body.userId,
        img: request.body.image
    })
    product.save(function (err, result) {
        if (!err) {
            subcatModule.updateOne({name:subcat}, {$push : {products:result._id}}, (err, res) => {
                if(!err){
                    response.json({ result: 'product added' });
                }else{
                    response.json(err);
                }
            });

        } else {
            response.json(err);
        }
    })

         }else{
        response.json({result:"fill all input in this form"});
    }

});

//edit with post request
router.put('/edit/:id', jsonParser, function (request, response, next) {
    var id = request.params.id;
    //response.send(request.body)
    console.log(request.body.productName);
    console.log(request.params.id);
     if (request.body.name != "" && request.body.price !="" && request.body.desc !="" &&
        request.body.image != "") {
    productsModule.update({ _id: id }, { "$set": { name: request.body.productName, price: request.body.productPrice, desc: request.body.productDesc, userId: request.body.userId, img: request.body.image } }, function (err, result) {
        if (!err) {
            response.json({ result: "product edited" });
        } else {
            console.log(err)
            response.json(err);
        }
    })
       }else{
         response.json({result:"fill all input in this form"});
    }
});

//delete with get request

router.delete('/delete/:id', function (request, response, next) {
    if (request.params.id) {
        productsModule.remove({ productId: request.params.id }, function (err, data) {
            if (!err) {
                response.json({ result: "deleted" });
            } else {
                response.status(404).json({ result: 'Not found' });
            }
        })
    } else {
        response.status(404).json({ result: 'Not found' });
    }
});


module.exports = router;
