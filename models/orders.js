var mongoose = require('mongoose');
var mongoose_paginate= require("mongoose-paginate");
var Schema = mongoose.Schema;

var orders = new Schema({
    orderId:{
        type:Number
      },
    name:String,
    user :{
        type:Number,
        // ref:"users"
      },
    products:{
        type:Number,
        // ref:"users"
      }
});

orders.plugin(mongoose_paginate);
// Register ...
mongoose.model("orders",orders);