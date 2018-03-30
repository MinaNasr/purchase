var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var subcatModel = mongoose.model('subcat');

router.get("/:subcat?", function (req, resp) {
    console.log(req.params);
    if (req.params.subcat) {
        subcatModel.find({name:req.params.subcat}).populate('products').exec((err, data) => {
            if (!err) {
                //console.log(data);
                resp.json(data);
            }
        });
    }else{
        subcatModel.find({}, (err, data) => {
            if(!err){
                resp.json(data);
            }
        });
    }

});




module.exports = router;
