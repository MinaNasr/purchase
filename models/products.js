var mongoose = require("mongoose");
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

//resister
mongoose.model("products",products);