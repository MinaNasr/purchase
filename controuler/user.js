var jwt = require('jsonwebtoken');
var express = require("express");
var bodyParser = require("body-parser");
var urlEncodedMid = bodyParser.urlencoded({extended:true});
var verifier = require('google-id-token-verifier');
var request = require('request');
var jsonParser = bodyParser.json();
var router = express.Router();
var bcrypt = require('bcrypt');
var mongoose = require("mongoose");
var User = mongoose.model("users");


router.get("/",urlEncodedMid,function (req,resp) {
  console.log(req.body);
})

router.post("/",urlEncodedMid,function(req,resp){

  const saltRounds = 10;
  const myPlaintextPassword = `${req.body.password}`;
  bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    if (!err) {
      let hashedPW = hash;
      if (req.body.nationalID != "123456789123") {
        console.log("first if");
        let tokenData = {
          name:req.body.userName,
          userType:"seller",
          email:req.body.email,
          provider:"tokenforLocal",
          password: hashedPW,
        }
        var token = jwt.sign(tokenData , process.env.sercret, {
          expiresIn: 60*60*24*1000
        });
        var newUser = new User({
          name: req.body.userName,
          email: req.body.email,
          password: hashedPW,
          address: req.body.address,
          national_id:req.body.nationalID,
          userType:"seller",
          token: token,
          provider:"tokenforLocal"
        });
      }
      else {
        let tokenData = {
          name:req.body.userName,
          userType:"customer",
          email:req.body.email,
          provider:"tokenforLocal",
          password: hashedPW
        }
        var token = jwt.sign(tokenData , process.env.sercret, {
          expiresIn: 60*60*24*1000
        });

        var newUser = new User({
          name: req.body.userName,
          email: req.body.email,
          password: hashedPW,
          address: req.body.address,
          userType:"customer",
          token: token,
          provider:"tokenforLocal"
        });

      }

      newUser.save(function(err,result) {
        console.log(result);
        if (!err) {
          resp.json({token:result.token,provider:result.provider});
        }
        else {
          resp.json(err);
        }
      })
    }
  });
});

router.post("/validations",urlEncodedMid,function(req,resp){
  User.findOne({email:req.body.mail},function(err,result){
    if (result == null) {
      resp.json({});
    }
    else{
      resp.json({data:"invalid"});
    }
  })
});



module.exports = router;
