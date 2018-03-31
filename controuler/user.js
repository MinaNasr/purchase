var jwt = require('jsonwebtoken');
var express = require("express");
var bodyParser = require("body-parser");
var urlEncodedMid = bodyParser.urlencoded({extended:true , limit:'50mb'});
var verifier = require('google-id-token-verifier');
var request = require('request');
var jsonParser = bodyParser.json({limit:'50mb'});
var rawBody = bodyParser.raw({limit:'50mb'})
var router = express.Router();
var bcrypt = require('bcrypt');
var mongoose = require("mongoose");
var User = mongoose.model("users");
var uuidv4 = require('uuid/v4');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var cloudinary = require('cloudinary');
let userImageURL = '';
cloudinary.config({
  cloud_name: 'djuaacu9g',
  api_key: '589981289168766',
  api_secret: 'HJECnp3ZuRNhsclSXGp9_cGe7tM'
});

var transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'nodemailerproject.iti@gmail.com',
    pass: 'hellotonodeproject'
  }
}));


router.get("/",rawBody,function (req,resp) {
})

router.post("/",urlEncodedMid,function(req,resp){
  cloudinary.uploader.upload(`${req.body.image}`, function(result) {
    userImageURL = result.secure_url;
    const saltRounds = 10;
    const myPlaintextPassword = `${req.body.password}`;
    bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
      if (!err) {
        let hashedPW = hash;
        if (req.body.nationalID != "123456789123") {
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
            provider:"tokenforLocal",
            image: userImageURL
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
            provider:"tokenforLocal",
            image: userImageURL
          });

        }

        newUser.save(function(err,result) {
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

router.post("/forgetpass",urlEncodedMid,function(req,resp){
  User.findOne({email:req.body.email},function(err,result){
    if (result == null) {
      resp.json({email:"invalid"});
    }
    else if(result.provider == "tokenforLocal"){
      let newUuid = uuidv4();
      User.updateOne({email:req.body.email},{"$set":{uuid:newUuid}},function(err,res) {
        if (!err) {
          var mailOptions = {
            from: 'nodemailerproject.iti@gmail.com',
            to: req.body.email,
            subject: 'Shopify: Verification Code',
            text: `verification Code: ${newUuid}`
          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
              resp.json({email:"sent",uuid:"sentLOL"});
            }
          });
        }
      });
    }
  })
});

router.put("/forgetpass",urlEncodedMid,function (req,resp) {
  User.findOne({uuid:req.body.uuid},function (err,result) {
    if (result == null) {
      resp.json({uuid:"invalid"})
    }
    else {
      const saltRounds = 10;
      const myPlaintextPassword = `${req.body.password}`;
      bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
        if (!err) {
          User.updateOne({uuid:req.body.uuid},{"$set":{password:hash}},function(err,res) {
            if (!err) {
              resp.json({uuid:"updated"})
            }
          });
        }
      })
    }
  })
  console.log(req.body);
})

router.put("/:id?",urlEncodedMid,function (req,resp) {
  let userID = req.params.id;
  User.findOne({email: req.body.email},function (err,result) {
    if (result != null && (result._id == userID)) {
      if (req.body.image != null) {
        cloudinary.uploader.upload(`${req.body.image}`, function(result) {
          userImageURL = result.secure_url;
          const saltRounds = 10;
          const myPlaintextPassword = `${req.body.password}`;
          bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
            if (!err) {
              let hashedPW = hash;
              User.updateOne({_id:userID},{"$set":{password:hash , email:req.body.email , name:req.body.userName , image:userImageURL , address:req.body.address}},function(err,res) {
                if (!err) {
                  resp.json(res)
                }
                else {
                  resp.json(err)
                }
              })
            }
          })
        })
      }
      else {
        const saltRounds = 10;
        const myPlaintextPassword = `${req.body.password}`;
        bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
          if (!err) {
            let hashedPW = hash;
            console.log(userID);
            User.updateOne({_id:userID},{"$set":{password:hash , email:req.body.email , name:req.body.userName , address:req.body.address}},function(err,res) {
              if (!err) {
                resp.json(res)
              }
              else {
                resp.json(err)
              }
            })
          }
        })
      }
    }
    else if (result == null) {
      if (req.body.image != null) {
        cloudinary.uploader.upload(`${req.body.image}`, function(result) {
          userImageURL = result.secure_url;
          const saltRounds = 10;
          const myPlaintextPassword = `${req.body.password}`;
          bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
            if (!err) {
              let hashedPW = hash;
              User.updateOne({_id:userID},{"$set":{password:hash , email:req.body.email , name:req.body.userName , image:userImageURL , address:req.body.address}},function(err,res) {
                if (!err) {
                  resp.json(res)
                }
                else {
                  resp.json(err)
                }
              })
            }
          })
        })
      }
      else {
        const saltRounds = 10;
        const myPlaintextPassword = `${req.body.password}`;
        bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
          if (!err) {
            let hashedPW = hash;
            User.updateOne({_id:userID},{"$set":{password:hash , email:req.body.email , name:req.body.userName , address:req.body.address}},function(err,res) {
              if (!err) {
                resp.json(res)
              }
              else {
                resp.json(err)
              }
            })
          }
        })
      }
    }
    else {
      resp.json({invalid:"Email Already Taken"})
    }
  })

})


module.exports = router;
