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

// make the same while register to encrypt the password


router.get("/",function(req , resp) {

  let userToken = req.headers.token;
  jwt.verify(userToken, 'mykey' , function (err,authData) {
    if (err) {
      resp.status(404).json({redirect :"redirect to login"});
    }
    else {
      let currentProvider = authData.provider;
      User.findOne({email:authData.email},function(err,result){
        if (!err) {
          var userInfo = {
            email:result.email,
            provider:result.provider,
            name:result.name,
            image:result.image,
            userType:result.userType,
            id:result._id
          }
          switch (currentProvider) {
            case "google":
            resp.status(200).json({logIn :"Login Now", loggedInWith :"google",user:userInfo});
            break;
            case "facebook":
            resp.status(200).json({logIn :"Login Now", loggedInWith :"facebook",user:userInfo});
            break;
            case "tokenforLocal":
                resp.status(200).json({logIn :"Login Now", loggedInWith :"local",user:userInfo});
            break;
          }
        }
        else {
          resp.status(304).json({redirect :"redirect to login"});
        }
      })
    }
  });
})


router.post("/",jsonParser,function(req,resp) {
  User.findOne({email:req.body.email},function(err,result){
    if (result == null) {
      if (req.body.provider == "google") {
        var userid = req.body.id;
        // verify with database
        var IdToken = req.body.idToken;
        var clientId = '484031253264-4o9uj7ts2lacfepdbe7sk5n45eue39q6.apps.googleusercontent.com';
        verifier.verify(IdToken, clientId, function (err, tokenInfo) {
          if (!err) {
            var socialUser = {"id":tokenInfo.sub , "email":tokenInfo.email , "provider":req.body.provider}
            var token = jwt.sign(socialUser , process.env.sercret, {
              expiresIn: 60*60*24*1000
            });
            var user = new User({
              name: req.body.name,
              email: req.body.email,
              image: req.body.image,
              userType:"customer",
              token: token,
              provider:"tokenforGoogle",
              userSocialID:tokenInfo.sub
            });
            user.save(function(err,result) {
              if (!err) {
                var userInfo = {
                  email:result.email,
                  provider:result.provider,
                  name:result.name,
                  image:result.image,
                  userType:result.userType,
                  id:result._id
                }
                resp.json({
                  resp: "tokenforGoogle",
                  token: token,
                  user:userInfo
                })
              }
              else {
                resp.json(err);
              }
            })
          }
        });
      }
      else if (req.body.provider == "facebook") {
        var userid = req.body.id;
        request.get(`https://graph.facebook.com/me?fields=id&access_token=${req.body.token}`,function (err, res , reqbody) {
          if (!err) {
            let userIDSentFromFB = JSON.parse(reqbody).id;
            var socialUser = {"id":userIDSentFromFB , "email":req.body.email , "provider":req.body.provider}
            var token = jwt.sign(socialUser , process.env.sercret, {
              expiresIn: 60*60*24*1000
            });
            var user = new User({
              name: req.body.name,
              email: req.body.email,
              image: req.body.image,
              userType:"customer",
              token: token,
              provider:"tokenforFaceBook",
              userSocialID: userIDSentFromFB
            });
            user.save(function(err,result) {
              if (!err) {
                var userInfo = {
                  email:result.email,
                  provider:result.provider,
                  name:result.name,
                  image:result.image,
                  userType:result.userType,
                  id:result._id
                }
                resp.json({
                  resp: "tokenforFaceBook",
                  token: token,
                  user: userInfo
                })
              }
              else {
                resp.json(err);
              }
            })
          }
        })
      }
      else {
        console.log("in else");
        resp.json({
          resp: "invalid username and password"
        })
      }
    }

    else
    {
      if (req.body.provider == "google") {
        var IdToken = req.body.idToken;
        var clientId = '484031253264-4o9uj7ts2lacfepdbe7sk5n45eue39q6.apps.googleusercontent.com';
        verifier.verify(IdToken, clientId, function (err, tokenInfo) {
          if (!err) {
            if(tokenInfo.sub == result.userSocialID){
              var userInfo = {
                email:result.email,
                provider:result.provider,
                name:result.name,
                image:result.image,
                userType:result.userType,
                id:result._id
              }
              resp.json({
                resp: "tokenforGoogle",
                token: result.token,
                user : userInfo
              })
            };
          }
        });
      }
      else if (req.body.provider == "facebook") {
        request.get(`https://graph.facebook.com/me?fields=id&access_token=${req.body.token}`,function (err, res , reqbody) {
          if (!err) {
            let userIDSentFromFB = JSON.parse(reqbody).id;
            if (userIDSentFromFB == result.userSocialID) {
              var userInfo = {
                email:result.email,
                provider:result.provider,
                name:result.name,
                image:result.image,
                userType:result.userType,
                id:result._id
              }
              resp.json({
                resp: "tokenforFaceBook",
                token: result.token ,
                user: userInfo
              })
            }
          }
        })
      }
      else if (req.body.provider == "local") {
        console.log("in local");
        User.findOne({email:req.body.email},function(err,result){
          if (!err) {
            bcrypt.compare(req.body.password, result.password, function(err, res) {
              if (res == true) {
                var userInfo = {
                  email:result.email,
                  provider:result.provider,
                  name:result.name,
                  image:result.image,
                  userType:result.userType,
                  id:result._id
                }
                resp.json({
                  resp: "tokenforLocal",
                  token: result.token,
                  user: userInfo
                })
              }
              else {
                resp.status(304).json({redirect :"redirect to login"});
              }
            })

          }
        })
      }
      else {
        console.log("in else");
        resp.json({
          resp: "invalid username and password"
        })
      }
    }
  })
})


module.exports = router;
