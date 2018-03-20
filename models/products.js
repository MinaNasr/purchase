var mongoose = require("mongoose");
var mongoose_paginate = require("mongoose-paginate")
var schema = mongoose.Schema;
var products = new schema({
    
    productName:{
        type:String
    },
    ProductDesc:{
        type:String
    },
    ProductPrice:{
        type:String
    },
    productSubCategory:{
        type:String
    },
    availabePeaces:{
        type:Number
    }
})
products.plugin(mongoose_paginate);
//resister
mongoose.model("products",products);