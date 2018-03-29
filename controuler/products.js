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
    console.log(re);
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

// add with post request
router.post('/add', jsonParser, function (request, response, next) {
    console.log(request.body.productName);
    var subcat = request.body.subcat;
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


});

//edit with post request
router.put('/edit/:id', jsonParser, function (request, response, next) {
    var id = request.params.id;
    //response.send(request.body)
    console.log(request.body.productName);
    console.log(request.params.id);
    productsModule.update({ productId: id }, { "$set": { name: request.body.productName, price: request.body.productPrice, desc: request.body.productDesc, userId: request.body.userId, img: request.body.image } }, function (err, result) {
        if (!err) {
            response.json({ result: "product edited" });
        } else {
            console.log(err)
            response.json({ result: "failed to edit" });
        }
    })
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
