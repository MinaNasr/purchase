const cat = require('./category');
const subcat = require('./subcat');
const products = require('./products')
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/purchase');

require('../models/category');
require('../models/subcat');
require('../models/products');

var catModel = mongoose.model('category');
var subcatModel = mongoose.model('subcat');
var productModel = mongoose.model('products');

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

productModel.remove({}, (err, res) => {});

// productModel.insertMany(products, (err, res) => {
//     if(!err){
//         console.log(res);   
//         console.log(err);     
//     }else{
//         console.log(err);
        
//     }
// });
