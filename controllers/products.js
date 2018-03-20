var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var fs = require("fs");
var multer = require("multer");
var fileUploadMid = multer({dest:"./public/images"})
var bodyParser = require("body-parser");
var UrlEncodedParser = bodyParser.urlencoded({extended:true});
var jsonParser = bodyParser.json();


router.use(function(request,response,next){
    response.header("Access-Control-Allow-Origin","*");
    response.header("Acecess-Control-Allow-Headers","Content-Type");
    response.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE")
    next();
  })

//creating products database model
var productsModule = mongoose.model("products");

/* GET home page. */
router.get('/:id?', function(request, response, next) {
    if(request.params.id){
        var id = request.params.id
        response.send("products: "+id);
        productsModule.findOne({_id:id},function(err,result){
            response.json(result);
        })
    }else{
        response.send("products");
        productsModule.find({},function(err,result){
            response.json(results);
        })
    }
  
});

router.get('/add',function(request,response,next){
    response.send("products");
});

router.post('/add',fileUploadMid.single("image"),function(request,response,next){
    console.log(request.body)
    var product = new productsModule({
        productName:request.body.productName,
        productPrice:request.body.productPrice
    })

    product.save(function(err,result){
        if(!err){
            response.send('product added');
        }else{
            response.json(err);
            
        }
    })
    response.json(response.body)
    console.log(response.body.productName)

});

router.get('/edit/:id',function(request,response,next){
    
});

router.post('/edit/:id',fileUploadMid.single("image"),function(request,response,next){
    response.send("products");
    var id = request.params.id
    productsModule.update({_id:id}{"$set":{productName:request.body.productName,productPrice:request.body.productPrice,productDesc:request.body.productDesc}},function(err,result){
        if(!err){
            resonse.send("product edited")
        }else{
            resonse.send("failed to edit")
        }
    })
});

router.get('/delete/:id',function(request,response,next){
    response.send("products");
});

module.exports = router;
