const cat = require('./category');
const subcat = require('./subcat');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/souq');

require('../models/category');
require('../models/subcat');

var catModel = mongoose.model('category');
var subcatModel = mongoose.model('subcat');

subcatModel.remove({}, (err, res) => {});

subcatModel.insertMany(subcat, (err, res) => {
    if(!err){
        console.log(res);   
        console.log(err);     
    }else{
        console.log(err);
        
    }
});

catModel.remove({}, (err, res) => {});

catModel.insertMany(cat, (err, res) => {
    if(!err){
        console.log(res);   
        console.log(err);     
    }else{
        console.log(err);
        
    }
});