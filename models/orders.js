var mongoose = require('mongoose');

var mongoose_paginate = require("mongoose-paginate");
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    orderId: {
        type: Number
    },

    status: {
        type: String
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'products'
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    sellerId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    quantities:[{
        type: Number
    }],
    total:Number,
    time:Date
});
orderSchema.plugin(mongoose_paginate);
mongoose.model("orders", orderSchema);
