var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var fs = require("fs");
var multer = require("multer");
var fileUploadMid = multer({dest:"./public/images"})
var bodyParser = require("body-parser");
var UrlEncodedParser = bodyParser.urlencoded({extended:true});
var jsonParser = bodyParser.json();
var mongodb = require('mongodb');




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
        productsModule.findOne({_id:id},function(err,result){
            response.json(result);
        })
    }else{
        productsModule.find({},function(err,result){
            response.json(result);
        })
    }
  
});

// add with post request
router.post('/add',UrlEncodedParser,function(request,response,next){
    console.log(request.body.productName)
    var product = new productsModule({
        name :request.body.productName,
        price:request.body.productPrice,
        desc:request.body.productDesc,
        userId:request.body.userId,
        img:request.body.image
    })
    product.save(function(err,result){
        if(!err){
            // response.send(request.body)
            response.send('product added');
        }else{
            response.json(err);
            
        }
    })
    

});

//edit with post request
router.post('/edit/:id',fileUploadMid.single("image"),function(request,response,next){
    var id = request.params.id
    response.send(request.body)
    console.log(request.body.productName)
    console.log(request.params.id)
    productsModule.update({_id:id},{"$set":{name:request.body.productName,price:request.body.productPrice,desc:request.body.productDesc,userId:request.body.userId,img:request.body.image}},function(err,result){
         if(!err){
             response.send("product edited")
         }else{
             console.log(err)
             response.send("failed to edit")
         }
     })
});

//delete with get request

router.get('/delete/:id?',function(request,response,next){
    if(request.params.id){
            productsModule.remove({_id:request.params.id},function(err,data){
                    if(!err){
                        response.send("deleted")
                    }else{
                        response.status(404).send('Not found');
                    } 
             })    
        }else{
            response.status(404).send('Not found');
        }
    });

module.exports = router;
