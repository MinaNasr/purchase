<<<<<<< HEAD
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
=======
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var productSchema = new Schema({
    name : {
        type: String,       
    },
    price: {
        type: Number,
    },
    img:{
        type: String,
    },
    desc: {
        type: String,
    },
    userId:{ //seller
        type: Schema.Types.ObjectId,
        ref: "users"
    }
});

mongoose.model("products", productSchema);
>>>>>>> origin/database
