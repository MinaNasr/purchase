var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodeMid = bodyParser.urlencoded({ extended: true });
var jsonParser = bodyParser.json();
var mongoose = require('mongoose');
var ratingsModel = mongoose.model('rating');
var productsModel = mongoose.model('products');


router.put('/:uId/:pId',jsonParser,function (req,res){
    console.log("ddddd");
    
    ratingsModel.update({$and : [{user:req.params.uId}, {product:req.params.pId}]},{"$set": {
        rate: req.body.rate,
      }
    },function (err,raw) {
        console.log(raw); 
        console.log(err); 
        if (!raw.nModified) {
                       
            var rating = new ratingsModel({
                product:req.params.pId,
                user:req.params.uId,
                rate :req.body.rate
            });
            rating.save(function (err,result) {
                if (!err) {
                    //console.log(result);                    
                    res.json(result);
                }else{
                    res.json(err);
                }
            })

        }else{
            res.json(raw);
        }
    })
});

router.get('/:uId/:pId', function (req,res){
    
    ratingsModel.findOne({$and :[{user:req.params.uId}, {product: req.params.pId}]}, {rate:1}, function (err, data) {
       if(!err && data){
           console.log(data);
           
           res.json(data);
       }else{
           res.json({'rate' : 0});
       }
    })
});

router.get('/:pId',function (req,res) {

    ratingsModel.find({product:req.params.pId},function (err,result) {
        if (!err) {
            totalRate=0;
            result.forEach(element => {
                totalRate +=element.rate;
            });
            avgRate = totalRate / result.length;
            res.json({rate:avgRate});
        }else{
            res.json(err);
        }
    })

})


module.exports = router;

