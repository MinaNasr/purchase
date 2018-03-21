var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodeMid = bodyParser.urlencoded({ extended: true });
var jsonParser = bodyParser.json();
var mongoose = require('mongoose');
var catModel = mongoose.model('category');

router.get("/:catname?",function(req, resp){
  if(req.params.catname){
    catModel.find({name : req.params.catname},function(err,result){
      if (err) {
        resp.json(err);
      }else {
        resp.json({"result":{"category":result}});
      }

    });
  }else {
    console.log("in");    
    catModel.find({},function(err,result){
      if (err) {
        resp.json(err);
      }else {
        //resp.json({"result":{"category":result}});
        resp.json(result);
      }
    });
  }
});


module.exports = router;
