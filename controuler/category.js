var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodeMid = bodyParser.urlencoded({ extended: true });
var jsonParser = bodyParser.json();
var mongoose = require('mongoose');
var catModel = mongoose.model('category');

router.get("/:catname?",function(req, resp){
  //console.log("sdfsdf");
  if(req.params.catname){
    catModel.find({name : req.params.catname},function(err,result){
      if (err) {
        resp.json(err);
      }else {
        //console.log(result);
        resp.json({"result":{"category":result}});
      }

    });
  }else {
    console.log("in");
    catModel.find({}).populate('subcat').exec((err, data) => {
      if(!err){
        console.log(data);

        resp.json(data);
      }
    });

  }
});


router.get("/:catname/products", function (req, resp) {
  if (req.params.catname == "all") {
    catModel.find({}).populate('subcat').exec((err, data) => {
      if (!err) {
        catModel.populate(data, {path:'subcat.products', model:'products'},(err, res) => {
          resp.json(data);
        })
      }
    });
  } else {   
    catModel.find({name: req.params.catname}).populate('subcat').exec((err, data) => {
      if (!err) {
        catModel.populate(data, {path:'subcat.products', model:'products'},(err, res) => {
          resp.json(data);
        })
      }
    });


  }
});



module.exports = router;
