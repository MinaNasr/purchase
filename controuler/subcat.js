var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var subcatModel = mongoose.model('subcat');

router.get("/", function (req, resp) {
    console.log("in");
    subcatModel.find({}).populate('subcat').exec((err, data) => {
        if (!err) {
            console.log(data);
            resp.json(data);
        }
    });
});


module.exports = router;
